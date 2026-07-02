import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// ===== HTTP请求工具（带重试） =====
async function httpGet(url: string, headers?: Record<string, string>): Promise<string> {
  const maxRetries = 3;
  let lastError: Error | null = null;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', ...headers },
      });
      return await res.text();
    } catch (err) {
      lastError = err as Error;
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 500 * (i + 1)));
      }
    }
  }
  throw lastError;
}

// ===== JSONP解析 =====
function parseJsonp(text: string): any {
  const match = text.match(/jsonpgz\(([\s\S]*?)\);?$/);
  if (match) {
    try { return JSON.parse(match[1]); } catch {}
  }
  const match2 = text.match(/^\s*[\w$]+\(([\s\S]*?)\);?\s*$/);
  if (match2) {
    try { return JSON.parse(match2[1]); } catch {}
  }
  return null;
}

// ===== 天天基金接口：基金排行（获取所有基金） =====
async function fetchFundRank(page: number = 1, pageSize: number = 20, sortField: string = 'zzf', sortOrder: string = 'desc', fundType: string = 'all'): Promise<{ funds: any[], total: number }> {
  try {
    // ft参数：all-全部, gp-股票型, hh-混合型, zq-债券型, zs-指数型
    const ftMap: Record<string, string> = {
      'all': 'all',
      '股票型': 'gp',
      '混合型': 'hh',
      '债券型': 'zq',
      '指数型': 'zs',
      'ETF': 'etf',
      'QDII': 'qdii',
    };
    const ft = ftMap[fundType] || 'all';
    
    const url = `https://fund.eastmoney.com/data/rankhandler.aspx?op=ph&dt=kf&ft=${ft}&rs=&gs=0&sc=${sortField}&st=${sortOrder}&sd=2025-07-02&ed=2026-07-02&qdii=&tabSubtype=,,,,,&pi=${page}&pn=${pageSize}&dx=1`;
    const text = await httpGet(url, { Referer: 'https://fund.eastmoney.com/' });
    
    // 解析返回数据：var rankData = {datas:["...","..."],allRecords:19856,...}
    const datasMatch = text.match(/datas:\[(.*?)\]/);
    const allRecordsMatch = text.match(/allRecords:(\d+)/);
    
    if (!datasMatch) return { funds: [], total: 0 };
    
    const datasStr = datasMatch[1];
    const datas = datasStr.split('","').map(s => s.replace(/^"|"$/g, ''));
    const total = allRecordsMatch ? parseInt(allRecordsMatch[1]) : 0;
    
    const funds = datas.map(data => {
      const fields = data.split(',');
      return {
        code: fields[0],
        name: fields[1],
        shortName: fields[2],
        date: fields[3],
        nav: parseFloat(fields[4]) || 0,
        accumulatedNav: parseFloat(fields[5]) || 0,
        dailyChange: parseFloat(fields[6]) || 0,
        weekReturn: parseFloat(fields[7]) || 0,
        monthReturn: parseFloat(fields[8]) || 0,
        month3Return: parseFloat(fields[9]) || 0,
        month6Return: parseFloat(fields[10]) || 0,
        year1Return: parseFloat(fields[11]) || 0,
        year2Return: parseFloat(fields[12]) || 0,
        year3Return: parseFloat(fields[13]) || 0,
        thisYearReturn: parseFloat(fields[14]) || 0,
        sinceEstablishReturn: parseFloat(fields[15]) || 0,
        establishDate: fields[16] || '',
        fee: fields[18] || '',
      };
    });
    
    return { funds, total };
  } catch (err) {
    console.error('fetchFundRank error:', err);
    return { funds: [], total: 0 };
  }
}

// ===== 天天基金接口：实时估值 =====
async function fetchFundEstimate(code: string): Promise<any> {
  try {
    const url = `https://fundgz.1234567.com.cn/js/${code}.js`;
    const text = await httpGet(url, { Referer: 'https://www.1234567.com.cn/' });
    const data = parseJsonp(text);
    if (data && data.fundcode) {
      const dwjz = parseFloat(data.dwjz) || 0;
      const gsz = parseFloat(data.gsz) || 0;
      const gszzl = parseFloat(data.gszzl) || 0;
      if (dwjz > 0) {
        return {
          name: data.name || '',
          nav: dwjz,
          estimatedNav: gsz,
          estimatedChange: gszzl,
          navDate: data.jzrq || '',
          estimateTime: data.gztime || '',
        };
      }
    }
  } catch {}
  return null;
}

// ===== 东方财富接口：历史净值 =====
async function fetchFundHistory(code: string, pageSize: number = 500): Promise<any[]> {
  try {
    const url = `https://api.fund.eastmoney.com/f10/lsjz?fundCode=${code}&pageIndex=1&pageSize=${pageSize}`;
    const text = await httpGet(url, { Referer: `https://fund.eastmoney.com/${code}.html` });
    const data = JSON.parse(text);
    return data.Data?.LSJZList || [];
  } catch { return []; }
}

// ===== 东方财富接口：基金详情(pingzhongdata) =====
async function fetchPingzhongData(code: string): Promise<any> {
  try {
    const url = `https://fund.eastmoney.com/pingzhongdata/${code}.js`;
    const text = await httpGet(url, { Referer: `https://fund.eastmoney.com/${code}.html` });
    const getData = (varName: string): any => {
      const regex = new RegExp(`var ${varName} = ([\\s\\S]*?);`);
      const m = text.match(regex);
      if (!m) return null;
      try { return eval(m[1]); } catch { return null; }
    };
    return {
      name: getData('fS_name'),
      code: getData('fS_code'),
      manager: getData('currentFundManager')?.[0],
      company: getData('jjgs'),
      establishDate: getData('fund_setupDate'),
      scale: parseFloat(getData('fund_endNetAsset') || 0),
      netWorth: getData('Data_netWorthTrend'),
      performance: {
        month1: parseFloat(getData('syl_1y') || 0),
        month3: parseFloat(getData('syl_3y') || 0),
        month6: parseFloat(getData('syl_6y') || 0),
        year1: parseFloat(getData('syl_1n') || 0),
        year2: parseFloat(getData('syl_2n') || 0),
        year3: parseFloat(getData('syl_3n') || 0),
        year5: parseFloat(getData('syl_5n') || 0),
        thisYear: parseFloat(getData('syl_jn') || 0),
        sinceEstablish: parseFloat(getData('syl_ln') || 0),
      },
      stockHoldings: getData('stockCodes'),
      assetAllocation: getData('Data_assetAllocation'),
      ranking: getData('fund_ScaleInfo'),
    };
  } catch { return null; }
}

// ===== 计算风险指标 =====
function calcRiskMetrics(history: { date: string; value: number }[]): { maxDrawdown: number; volatility: number; sharpeRatio: number; alpha: number } {
  if (history.length < 2) return { maxDrawdown: 0, volatility: 0, sharpeRatio: 0, alpha: 0 };
  
  const values = history.map(h => h.value);
  const returns: number[] = [];
  for (let i = 1; i < values.length; i++) {
    returns.push((values[i] - values[i - 1]) / values[i - 1]);
  }
  
  let maxDrawdown = 0;
  let peak = values[0];
  for (const v of values) {
    if (v > peak) peak = v;
    const dd = (v - peak) / peak;
    if (dd < maxDrawdown) maxDrawdown = dd;
  }
  
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + (r - avgReturn) ** 2, 0) / returns.length;
  const dailyVolatility = Math.sqrt(variance);
  const annualizedVolatility = dailyVolatility * Math.sqrt(252) * 100;
  
  const riskFreeRate = 2.0;
  const annualizedReturn = avgReturn * 252 * 100;
  const sharpeRatio = annualizedVolatility > 0 ? (annualizedReturn - riskFreeRate) / annualizedVolatility : 0;
  
  return {
    maxDrawdown: Math.round(maxDrawdown * 10000) / 100,
    volatility: Math.round(annualizedVolatility * 100) / 100,
    sharpeRatio: Math.round(sharpeRatio * 100) / 100,
    alpha: Math.round((annualizedReturn - riskFreeRate) * 100) / 100,
  };
}

// ===== 计算区间收益率 =====
function calcReturn(history: any[], days: number): number {
  if (history.length < days) return 0;
  const latest = parseFloat(history[0].DWJZ) || 0;
  const old = parseFloat(history[days - 1]?.DWJZ) || 0;
  if (old <= 0) return 0;
  return Math.round((latest / old - 1) * 10000) / 100;
}

// ===== 基金列表接口（直接调用天天基金API） =====
app.get('/api/funds/list', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const size = parseInt(req.query.size as string) || 20;
    const fundType = req.query.type as string || 'all';
    const sortBy = req.query.sortBy as string || 'year1Return';
    const sortOrder = req.query.sortOrder as string || 'desc';

    // 映射排序字段到天天基金API的排序字段
    const sortFieldMap: Record<string, string> = {
      'year1Return': 'zzf', // 近1年收益
      'year3Return': '3nzf', // 近3年收益
      'month6Return': '6yzf', // 近6月收益
      'month3Return': '3yzf', // 近3月收益
      'month1Return': '1yzf', // 近1月收益
      'dailyChange': 'rzdf', // 日涨跌幅
    };
    const apiSortField = sortFieldMap[sortBy] || 'zzf';

    // 直接调用天天基金排行API
    const { funds: rankFunds, total } = await fetchFundRank(page, size, apiSortField, sortOrder, fundType);

    // 转换为前端需要的格式
    const funds = rankFunds.map(f => ({
      code: f.code,
      name: f.name,
      type: '混合型', // 天天基金API没有返回类型，暂时默认
      manager: '--',
      company: '--',
      establishDate: f.establishDate,
      scale: 0,
      riskLevel: 3,
      nav: f.nav,
      accumulatedNav: f.accumulatedNav,
      dailyChange: f.dailyChange,
      year1Return: f.year1Return,
      year3Return: f.year3Return,
      month6Return: f.month6Return,
      month3Return: f.month3Return,
      month1Return: f.month1Return,
      thisYearReturn: f.thisYearReturn,
      sinceEstablishReturn: f.sinceEstablishReturn,
      yearlyReturn: f.year1Return,
      riskMetrics: {
        maxDrawdown: 0,
        volatility: 0,
        sharpeRatio: 0,
        alpha: 0,
      },
      source: '1234567',
    }));

    res.json({ funds, total, source: '1234567' });
  } catch (err) {
    console.error('Fund list error:', err);
    res.json({ funds: [], total: 0, source: 'error', error: String(err) });
  }
});

// ===== 基金搜索接口 =====
app.get('/api/funds/search', async (req, res) => {
  const keyword = req.query.keyword as string;
  if (!keyword) { res.json({ funds: [] }); return; }
  try {
    const url = `https://fundsuggest.eastmoney.com/FundSearch/api/FundSearchAPI.ashx?callback=&m=1&key=${encodeURIComponent(keyword)}&_=${Date.now()}`;
    const text = await httpGet(url, { Referer: 'https://fund.eastmoney.com/' });
    const data = JSON.parse(text.replace(/^[^{]*({[\s\S]*})[^}]*$/, '$1'));
    const funds = (data.Datas || []).map((item: any) => ({
      id: item.CODE,
      code: item.CODE,
      name: item.NAME,
      type: item.FundBaseInfo?.FTYPE || '混合型',
      nav: 0, accumulatedNav: 0, dailyChange: 0, yearlyReturn: 0,
      riskLevel: 3, manager: '--', company: '--', establishDate: '--', scale: 0,
    }));
    res.json({ funds, source: 'eastmoney' });
  } catch {
    res.json({ funds: [], source: 'error' });
  }
});

// ===== 基金详情接口 =====
app.get('/api/funds/:code/detail', async (req, res) => {
  const code = req.params.code;
  try {
    const [estimate, history, pingzhong] = await Promise.all([
      fetchFundEstimate(code),
      fetchFundHistory(code, 500),
      fetchPingzhongData(code),
    ]);

    const baseInfo = FUND_DATABASE.find(f => f.code === code);

    const nav = estimate?.nav || (history[0] ? parseFloat(history[0].DWJZ) : 0);
    const accumulatedNav = history[0] ? parseFloat(history[0].LJJZ) || 0 : 0;
    const dailyChange = estimate?.estimatedChange || 0;

    const navHistory = history.slice(0, 500).reverse().map((h: any) => ({
      date: h.FSRQ,
      value: parseFloat(h.DWJZ) || 0,
    }));
    const riskMetrics = calcRiskMetrics(navHistory);

    const performance = pingzhong?.performance || {
      month1: calcReturn(history, 22),
      month3: calcReturn(history, 66),
      month6: calcReturn(history, 132),
      year1: calcReturn(history, 250),
      year2: calcReturn(history, 500),
      year3: 0, year5: 0, thisYear: 0, sinceEstablish: 0,
    };

    const assetAllocation = pingzhong?.assetAllocation || { stock: 0, bond: 0, cash: 0, other: 0 };

    const managerInfo = pingzhong?.manager || {};
    const managerDetail = {
      name: managerInfo.name || baseInfo?.manager || '--',
      tenure: managerInfo.workTime ? Math.round((Date.now() - new Date(managerInfo.workTime).getTime()) / (365 * 24 * 60 * 60 * 1000) * 10) / 10 : 0,
      tenureReturn: parseFloat(managerInfo.fundScale) || 0,
      managedFunds: managerInfo.fundCount || 0,
      totalScale: managerInfo.totalScale || 0,
      style: managerInfo.investmentStyle || '--',
    };

    const detail = {
      id: code,
      code,
      name: estimate?.name || pingzhong?.name || baseInfo?.name || `基金${code}`,
      type: baseInfo?.type || '混合型',
      riskLevel: baseInfo?.riskLevel || 3,
      manager: managerDetail.name,
      company: pingzhong?.company || baseInfo?.company || '--',
      establishDate: pingzhong?.establishDate || baseInfo?.establishDate || '--',
      scale: (pingzhong?.scale || baseInfo?.scale || 0) / 100000000,
      nav: Math.round(nav * 10000) / 10000,
      accumulatedNav: Math.round(accumulatedNav * 10000) / 10000,
      dailyChange: Math.round(dailyChange * 100) / 100,
      yearlyReturn: performance.year1 || 0,
      performance,
      ranking: { month1: 0, month3: 0, year1: 0, sameTypeCount: 0 },
      riskMetrics,
      assetAllocation,
      industryAllocation: [],
      topHoldings: pingzhong?.stockHoldings || [],
      managerDetail,
      fees: { managementFee: 0, custodyFee: 0, purchaseFee: 0, redemptionFee: 0 },
      source: 'eastmoney',
    };

    res.json(detail);
  } catch (err) {
    console.error('Fund detail error:', err);
    const baseInfo = FUND_DATABASE.find(f => f.code === code);
    res.json({
      id: code, code,
      name: baseInfo?.name || `基金${code}`,
      type: baseInfo?.type || '混合型',
      riskLevel: baseInfo?.riskLevel || 3,
      manager: baseInfo?.manager || '--',
      company: baseInfo?.company || '--',
      establishDate: baseInfo?.establishDate || '--',
      scale: baseInfo?.scale || 0,
      nav: 0, accumulatedNav: 0, dailyChange: 0, yearlyReturn: 0,
      performance: { month1: 0, month3: 0, month6: 0, year1: 0, year2: 0, year3: 0, year5: 0, thisYear: 0, sinceEstablish: 0 },
      ranking: { month1: 0, month3: 0, year1: 0, sameTypeCount: 0 },
      riskMetrics: { maxDrawdown: 0, volatility: 0, sharpeRatio: 0, alpha: 0 },
      assetAllocation: { stock: 0, bond: 0, cash: 0, other: 0 },
      industryAllocation: [],
      topHoldings: [],
      managerDetail: { name: '--', tenure: 0, tenureReturn: 0, managedFunds: 0, totalScale: 0, style: '--' },
      fees: { managementFee: 0, custodyFee: 0, purchaseFee: 0, redemptionFee: 0 },
      source: 'error',
    });
  }
});

// ===== 基金净值历史接口 =====
app.get('/api/funds/:code/nav', async (req, res) => {
  const code = req.params.code;
  const days = parseInt(req.query.days as string) || 365;
  try {
    const history = await fetchFundHistory(code, days);
    if (history.length > 0) {
      const data = history.slice(0, days).reverse().map((item: any) => ({
        date: item.FSRQ || '',
        value: parseFloat(item.DWJZ) || 0,
        accumulatedNav: parseFloat(item.LJJZ) || 0,
        dailyChange: parseFloat(item.JZZZL) || 0,
      }));
      res.json({ data, source: 'eastmoney' });
      return;
    }
  } catch {}
  res.json({ data: [], source: 'empty' });
});

// ===== 市场指数接口（天天基金ETF估值） =====
app.get('/api/market/indices', async (_req, res) => {
  try {
    // 使用天天基金ETF估值数据
    const etfCodes = [
      { code: '510300', name: '沪深300ETF' },
      { code: '510050', name: '上证50ETF' },
      { code: '159915', name: '创业板ETF' },
      { code: '510500', name: '中证500ETF' },
      { code: '159949', name: '创业板50ETF' },
      { code: '513100', name: '纳指ETF' },
    ];
    
    const results = await Promise.all(etfCodes.map(async (etf) => {
      const estimate = await fetchFundEstimate(etf.code);
      if (estimate) {
        return {
          code: etf.code,
          name: estimate.name || etf.name,
          value: estimate.nav,
          change: estimate.estimatedNav - estimate.nav,
          changePercent: estimate.estimatedChange,
          high: 0,
          low: 0,
          open: 0,
          prevClose: estimate.nav,
        };
      }
      return null;
    }));
    
    const indices = results.filter(r => r !== null);
    res.json({ success: true, data: indices, source: '1234567' });
  } catch (err) {
    console.error('Market indices error:', err);
    res.json({ success: false, data: [], source: 'error' });
  }
});

// ===== 指数历史K线（天天基金历史净值） =====
app.get('/api/market/index-history', async (req, res) => {
  const days = parseInt(req.query.days as string) || 30;
  try {
    // 使用沪深300ETF的历史净值作为指数走势
    const code = '510300';
    const url = `https://api.fund.eastmoney.com/f10/lsjz?fundCode=${code}&pageIndex=1&pageSize=${days}`;
    const text = await httpGet(url, { Referer: `https://fund.eastmoney.com/${code}.html` });
    const data = JSON.parse(text);
    const history = (data.Data?.LSJZList || []).map((item: any) => ({
      date: item.FSRQ,
      value: parseFloat(item.DWJZ) || 0,
    })).reverse();
    res.json({ success: true, data: history, source: '1234567' });
  } catch {
    res.json({ success: false, data: [], source: 'error' });
  }
});

// ===== 板块行情接口（天天基金行业主题ETF） =====
app.get('/api/market/sectors', async (_req, res) => {
  try {
    // 使用行业主题ETF的估值数据模拟板块行情
    const sectorETFs = [
      { code: '512690', name: '酒ETF' },
      { code: '512480', name: '半导体ETF' },
      { code: '512800', name: '银行ETF' },
      { code: '515030', name: '新能源车ETF' },
      { code: '516160', name: '新能源ETF' },
      { code: '512660', name: '军工ETF' },
      { code: '512200', name: '房地产ETF' },
      { code: '512170', name: '医疗ETF' },
      { code: '515050', name: '5GETF' },
      { code: '515880', name: '通信ETF' },
      { code: '512980', name: '传媒ETF' },
      { code: '512580', name: '环保ETF' },
      { code: '512510', name: '食品饮料ETF' },
      { code: '512400', name: '有色金属ETF' },
      { code: '512280', name: '计算机ETF' },
      { code: '512950', name: '基建ETF' },
      { code: '512880', name: '证券ETF' },
      { code: '515220', name: '煤炭ETF' },
      { code: '512120', name: '医药ETF' },
      { code: '515170', name: '食品ETF' },
    ];
    
    const results = await Promise.all(sectorETFs.map(async (etf) => {
      const estimate = await fetchFundEstimate(etf.code);
      if (estimate) {
        return {
          code: etf.code,
          name: estimate.name || etf.name,
          change: estimate.estimatedChange,
          volume: 0,
        };
      }
      return null;
    }));
    
    const sectors = results.filter(r => r !== null).sort((a, b) => b.change - a.change);
    res.json({ success: true, data: sectors, source: '1234567' });
  } catch {
    res.json({ success: false, data: [], source: 'error' });
  }
});

// ===== 基准历史接口（天天基金指数ETF历史净值） =====
app.get('/api/benchmarks/:code/history', async (req, res) => {
  const code = req.params.code;
  const days = parseInt(req.query.days as string) || 365;
  try {
    if (code === 'category_avg') {
      res.json({ success: false, data: [], source: 'not_supported' });
      return;
    }
    // 映射指数代码到对应的ETF
    const indexETFMap: Record<string, string> = {
      '000300': '510300', // 沪深300
      '000905': '510500', // 中证500
      '000852': '159949', // 中证1000
      '000016': '510050', // 上证50
      '399006': '159915', // 创业板指
    };
    const etfCode = indexETFMap[code] || '510300';
    
    const url = `https://api.fund.eastmoney.com/f10/lsjz?fundCode=${etfCode}&pageIndex=1&pageSize=${days}`;
    const text = await httpGet(url, { Referer: `https://fund.eastmoney.com/${etfCode}.html` });
    const data = JSON.parse(text);
    const history = (data.Data?.LSJZList || []).map((item: any) => ({
      date: item.FSRQ,
      value: parseFloat(item.DWJZ) || 0,
    })).reverse();
    res.json({ success: true, data: history, source: '1234567' });
  } catch {
    res.json({ success: false, data: [], source: 'error' });
  }
});

// ===== 组合分析接口 =====
app.post('/api/analysis/portfolio', (req, res) => {
  const { fundIds } = req.body;
  res.json({
    industryDistribution: [],
    holdingsOverlap: { overlappedStocks: [], overlapRate: 0 },
    styleExposure: { marketCap: '--', style: '--', score: 0 },
    portfolioRisk: { estimatedMaxDrawdown: 0, estimatedVolatility: 0, diversificationScore: 0 },
    source: 'not_implemented',
  });
});

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
  console.log('Data sources: fundgz.1234567.com.cn, api.fund.eastmoney.com, push2.eastmoney.com (HTTP)');
});