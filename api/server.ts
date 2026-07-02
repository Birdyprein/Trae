import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// ===== 缓存系统 =====
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5分钟缓存

function getCached<T>(key: string): T | null {
  const item = cache.get(key);
  if (item && Date.now() - item.timestamp < CACHE_TTL) {
    return item.data as T;
  }
  cache.delete(key);
  return null;
}

function setCache(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() });
}

// ===== HTTP请求工具（带重试和超时） =====
async function httpGet(url: string, headers?: Record<string, string>): Promise<string> {
  const maxRetries = 3;
  const timeout = 10000; // 10秒超时
  let lastError: Error | null = null;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', ...headers },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      return await res.text();
    } catch (err) {
      lastError = err as Error;
      console.log(`httpGet retry ${i + 1}/${maxRetries} failed for ${url}`);
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
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
    
    // 支持多个类型（逗号分隔），取第一个类型进行筛选
    // 如果天天基金API支持多类型筛选，可以后续扩展
    const types = fundType.split(',').map(t => t.trim()).filter(t => t);
    const ft = types.length > 0 ? (ftMap[types[0]] || 'all') : 'all';
    
    const url = `https://fund.eastmoney.com/data/rankhandler.aspx?op=ph&dt=kf&ft=${ft}&rs=&gs=0&sc=${sortField}&st=${sortOrder}&sd=2025-07-02&ed=2026-07-02&qdii=&tabSubtype=,,,,,&pi=${page}&pn=${pageSize}&dx=1`;
    const text = await httpGet(url, { Referer: 'https://fund.eastmoney.com/' });
    
    // 解析返回数据：var rankData = {datas:["...","..."],allRecords:19856,...}
    const datasMatch = text.match(/datas:\[([\s\S]*?)\]/);
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
    const url = `https://api.fund.eastmoney.com/f10/lsjz?fundCode=${code}&pageIndex=1&pageSize=${pageSize}&callback=jQuery112409`;
    const text = await httpGet(url, {
      'Referer': `https://fund.eastmoney.com/${code}.html`,
      'Accept': '*/*',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'Accept-Encoding': 'gzip, deflate',
      'Connection': 'keep-alive',
      'X-Requested-With': 'XMLHttpRequest',
    });
    console.log(`fetchFundHistory for ${code}: response length = ${text.length}, first 200: ${text.substring(0, 200)}`);
    
    // 解析JSONP响应：jQuery112409({...})
    const jsonpMatch = text.match(/jQuery112409\(([\s\S]*)\)/);
    if (!jsonpMatch) {
      console.log(`fetchFundHistory for ${code}: no JSONP match, trying direct JSON parse`);
      const data = JSON.parse(text);
      const list = data.Data?.LSJZList || [];
      console.log(`fetchFundHistory for ${code}: got ${list.length} records`);
      return list;
    }
    
    const data = JSON.parse(jsonpMatch[1]);
    const list = data.Data?.LSJZList || [];
    console.log(`fetchFundHistory for ${code}: got ${list.length} records`);
    return list;
  } catch (err) {
    console.error(`fetchFundHistory error for ${code}:`, err);
    return [];
  }
}

// ===== 从基金主页面提取累计净值 =====
async function fetchAccumulatedNavFromMain(code: string): Promise<number> {
  try {
    const url = `https://fund.eastmoney.com/${code}.html`;
    const text = await httpGet(url, { Referer: 'https://fund.eastmoney.com/' });
    
    // 提取累计净值：使用更宽松的正则表达式，允许换行符和空格
    // 匹配：累计净值</a>...<span class="...">5.7696
    const match = text.match(/累计净值[\s\S]*?<span[^>]*>([\d.]+)<\/span>/);
    if (match) {
      const value = parseFloat(match[1]);
      if (value > 0) {
        return value;
      }
    }
    
    return 0;
  } catch (err) {
    console.error(`fetchAccumulatedNavFromMain error for ${code}:`, err);
    return 0;
  }
}

// ===== 东方财富接口：基金详情(pingzhongdata) =====
async function fetchPingzhongData(code: string): Promise<any> {
  try {
    const url = `https://fund.eastmoney.com/pingzhongdata/${code}.js`;
    const text = await httpGet(url, { Referer: `https://fund.eastmoney.com/${code}.html` });
    
    // 提取变量的辅助函数
    const extractVar = (varName: string): any => {
      const regex = new RegExp(`var\\s+${varName}\\s*=\\s*([\\s\\S]*?);`, 'm');
      const m = text.match(regex);
      if (!m) return null;
      const val = m[1].trim();
      try { return eval(val); } catch { return val; }
    };
    
    // 获取基金经理信息
    const managerData = extractVar('Data_currentFundManager');
    let managerInfo = null;
    if (managerData && Array.isArray(managerData) && managerData.length > 0) {
      const mgr = managerData[0];
      managerInfo = {
        name: mgr.name || mgr.mgrname || '--',
        workTime: mgr.workTime || mgr.fempdate || '',
        fundScale: mgr.fundScale || 0,
        fundCount: mgr.fundCount || 0,
        totalScale: mgr.totalScale || 0,
        investmentStyle: mgr.investmentStyle || '--',
      };
    }
    
    // 获取资产配置
    const assetDataRaw = extractVar('Data_assetAllocation');
    let assetAllocation = { stock: 0, bond: 0, cash: 0, other: 0 };
    if (assetDataRaw) {
      try {
        const assetObj = typeof assetDataRaw === 'string' ? JSON.parse(assetDataRaw) : assetDataRaw;
        if (assetObj.series && Array.isArray(assetObj.series)) {
          const stockSeries = assetObj.series.find((s: any) => s.name === '股票占净比');
          const bondSeries = assetObj.series.find((s: any) => s.name === '债券占净比');
          const cashSeries = assetObj.series.find((s: any) => s.name === '现金占净比');
          
          if (stockSeries?.data?.length > 0) assetAllocation.stock = stockSeries.data[stockSeries.data.length - 1];
          if (bondSeries?.data?.length > 0) assetAllocation.bond = bondSeries.data[bondSeries.data.length - 1];
          if (cashSeries?.data?.length > 0) assetAllocation.cash = cashSeries.data[cashSeries.data.length - 1];
        }
      } catch {}
    }
    
    // 获取股票持仓代码
    const stockCodesRaw = extractVar('stockCodes') || [];
    const stockCodes = Array.isArray(stockCodesRaw) ? stockCodesRaw : [];
    
    // 获取基金基本信息
    const fundName = extractVar('fS_name');
    const fundCode = extractVar('fS_code');
    
    // 获取基金规模、成立日期、基金公司等信息
    // 尝试多种可能的变量名
    let fundScale = extractVar('fund_scale') || extractVar('Data_fundScale') || 0;
    let establishDate = extractVar('Data_establishDate') || extractVar('fund_establishDate') || '';
    let company = extractVar('Data_company') || extractVar('fund_company') || '';
    
    // 如果 pingzhongdata 中没有这些信息，尝试从其他 API 获取
    if (!company || !establishDate || fundScale === 0) {
      try {
        // 尝试从基金档案页面获取基本信息
        const fundInfoUrl = `https://fund.eastmoney.com/${code}.html`;
        const fundInfoText = await httpGet(fundInfoUrl, { Referer: 'https://fund.eastmoney.com/' });
        
        // 提取基金公司名称
        if (!company) {
          const companyMatch = fundInfoText.match(/基金公司[：:]\s*([^<\n]+)/);
          if (companyMatch) {
            company = companyMatch[1].trim();
          }
        }
        
        // 提取成立日期
        if (!establishDate) {
          const dateMatch = fundInfoText.match(/成立日期[：:]\s*([^<\n]+)/);
          if (dateMatch) {
            establishDate = dateMatch[1].trim();
          }
        }
        
        // 提取基金规模
        if (fundScale === 0) {
          const scaleMatch = fundInfoText.match(/基金规模[：:]\s*([\d.]+)\s*亿元/);
          if (scaleMatch) {
            fundScale = parseFloat(scaleMatch[1]) * 100000000; // 转换为元
          }
        }
      } catch (err) {
        console.error(`Failed to fetch fund info from ${fundInfoUrl}:`, err);
      }
    }
    
    // 如果还是没有获取到，尝试从 f10 页面获取
    if (!company || !establishDate || fundScale === 0) {
      try {
        const f10Url = `https://fundf10.eastmoney.com/jbgk_${code}.html`;
        const f10Text = await httpGet(f10Url, { Referer: 'https://fund.eastmoney.com/' });
        
        // 提取基金公司名称（从基金管理人链接）
        if (!company) {
          const companyMatch = f10Text.match(/基金管理人<\/th><td><a[^>]*>([^<]+)<\/a>/);
          if (companyMatch) {
            company = companyMatch[1].trim();
          }
        }
        
        // 提取成立日期
        if (!establishDate) {
          const dateMatch = f10Text.match(/成立日期\/规模<\/th><td>(\d{4}年\d{2}月\d{2}日)/);
          if (dateMatch) {
            // 转换格式：2008年06月19日 -> 2008-06-19
            const parts = dateMatch[1].match(/(\d{4})年(\d{2})月(\d{2})日/);
            if (parts) {
              establishDate = `${parts[1]}-${parts[2]}-${parts[3]}`;
            }
          }
        }
        
        // 提取基金规模
        if (fundScale === 0) {
          const scaleMatch = f10Text.match(/净资产规模<\/th><td>([\d.]+)亿元/);
          if (scaleMatch) {
            fundScale = parseFloat(scaleMatch[1]) * 100000000; // 转换为元
          }
        }
      } catch (err) {
        console.error(`Failed to fetch fund info from ${f10Url}:`, err);
      }
    }
    
    // 获取股票持仓详情（包含名称和占比）
    const stockCodesNewRaw = extractVar('stockCodesNew') || [];
    const stockCodesNew = Array.isArray(stockCodesNewRaw) ? stockCodesNewRaw : [];
    
    // 尝试提取股票持仓的详细信息
    const stockHoldingsRaw = extractVar('Data_stockHoldings') || extractVar('fundStocks') || [];
    let stockHoldings: any[] = [];
    if (Array.isArray(stockHoldingsRaw) && stockHoldingsRaw.length > 0) {
      stockHoldings = stockHoldingsRaw;
    } else if (stockCodes.length > 0) {
      // 如果只有代码，构造基本结构
      stockHoldings = stockCodes.map((code: string, idx: number) => ({
        stockCode: code,
        stockName: `股票${idx + 1}`,
        ratio: 0,
      }));
    }
    
    // 获取业绩数据
    const result = {
      name: fundName,
      code: fundCode,
      manager: managerInfo,
      company: company,
      establishDate: establishDate,
      scale: parseFloat(fundScale) || 0,
      netWorth: extractVar('Data_netWorthTrend'),
      performance: {
        month1: parseFloat(extractVar('syl_1y') || 0),
        month3: parseFloat(extractVar('syl_3y') || 0),
        month6: parseFloat(extractVar('syl_6y') || 0),
        year1: parseFloat(extractVar('syl_1n') || 0),
        year2: 0,
        year3: 0,
        year5: 0,
        thisYear: 0,
        sinceEstablish: 0,
      },
      stockCodes: stockCodes,
      stockCodesNew: stockCodesNew,
      stockHoldings: stockHoldings,
      assetAllocation: assetAllocation,
      ranking: null,
    };
    
    return result;
  } catch (err) {
    console.error(`fetchPingzhongData error for ${code}:`, err);
    return null;
  }
}

// ===== 计算风险指标 =====
function calcRiskMetrics(history: { date: string; value: number }[]): { maxDrawdown: number; volatility: number; sharpeRatio: number; alpha: number; beta: number; informationRatio: number } {
  if (history.length < 2) return { maxDrawdown: 0, volatility: 0, sharpeRatio: 0, alpha: 0, beta: 0, informationRatio: 0 };
  
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
    beta: 0,
    informationRatio: 0,
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

// ===== 基金列表接口（直接调用天天基金API，带缓存） =====
app.get('/api/funds/list', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const size = parseInt(req.query.size as string) || 20;
    const fundType = req.query.type as string || 'all';
    const sortBy = req.query.sortBy as string || 'year1Return';
    const sortOrder = req.query.sortOrder as string || 'desc';

    // 缓存键
    const cacheKey = `funds_list_${page}_${size}_${fundType}_${sortBy}_${sortOrder}`;
    const cached = getCached<{ funds: any[]; total: number }>(cacheKey);
    if (cached) {
      return res.json({ ...cached, source: 'cache' });
    }

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
      id: f.code,
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
        beta: 0,
        informationRatio: 0,
      },
      source: '1234567',
    }));

    const result = { funds, total, source: '1234567' };
    setCache(cacheKey, result);
    res.json(result);
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

    const nav = estimate?.nav || (history[0] ? parseFloat(history[0].DWJZ) : 0);
    let accumulatedNav = history[0] ? parseFloat(history[0].LJJZ) || 0 : 0;
    const dailyChange = estimate?.estimatedChange || 0;

    // 如果历史净值数据为空，尝试从基金主页面获取累计净值
    if (history.length === 0 && accumulatedNav === 0) {
      accumulatedNav = await fetchAccumulatedNavFromMain(code);
    }

    // 使用历史净值数据，如果为空则使用pingzhongdata中的净值走势
    let navHistory: { date: string; value: number }[] = [];
    if (history.length > 0) {
      navHistory = history.slice(0, 500).reverse().map((h: any) => ({
        date: h.FSRQ,
        value: parseFloat(h.DWJZ) || 0,
      }));
    } else if (pingzhong?.netWorth && Array.isArray(pingzhong.netWorth)) {
      // 使用pingzhongdata中的净值走势作为备选
      navHistory = pingzhong.netWorth.slice(-500).map((item: any) => ({
        date: new Date(item.x).toISOString().split('T')[0],
        value: parseFloat(item.y) || 0,
      }));
    }
    
    const riskMetrics = calcRiskMetrics(navHistory);

    const performance = pingzhong?.performance || {
      month1: calcReturn(history, 22),
      month3: calcReturn(history, 66),
      month6: calcReturn(history, 132),
      year1: calcReturn(history, 250),
      year2: calcReturn(history, 500),
      year3: 0, year5: 0, thisYear: 0, sinceEstablish: 0,
    };

    // 解析资产配置（可能是字符串或对象）
    let assetAllocation = { stock: 0, bond: 0, cash: 0, other: 0 };
    if (pingzhong?.assetAllocation) {
      if (typeof pingzhong.assetAllocation === 'string') {
        try {
          const parsed = JSON.parse(pingzhong.assetAllocation);
          if (parsed.stock !== undefined) assetAllocation = parsed;
        } catch {}
      } else if (typeof pingzhong.assetAllocation === 'object') {
        assetAllocation = pingzhong.assetAllocation;
      }
    }

    const managerInfo = pingzhong?.manager || {};
    const managerDetail = {
      name: managerInfo.name || '--',
      tenure: managerInfo.workTime ? Math.round((Date.now() - new Date(managerInfo.workTime).getTime()) / (365 * 24 * 60 * 60 * 1000) * 10) / 10 : 0,
      tenureReturn: parseFloat(managerInfo.fundScale) || 0,
      managedFunds: managerInfo.fundCount || 0,
      totalScale: managerInfo.totalScale || 0,
      style: managerInfo.investmentStyle || '--',
    };

    // 解析重仓股（可能是代码数组或对象数组）
    const stockCodes = pingzhong?.stockCodes || [];
    const topHoldings = Array.isArray(stockCodes) ? stockCodes.map((code: string, idx: number) => ({
      stockCode: code,
      stockName: `股票${idx + 1}`,
      ratio: 0,
      change: '不变',
    })) : [];

    const detail = {
      id: code,
      code,
      name: estimate?.name || pingzhong?.name || `基金${code}`,
      type: '混合型',
      riskLevel: 3,
      manager: managerDetail.name,
      company: pingzhong?.company || '--',
      establishDate: pingzhong?.establishDate || '--',
      scale: (pingzhong?.scale || 0) / 100000000,
      nav: Math.round(nav * 10000) / 10000,
      accumulatedNav: Math.round(accumulatedNav * 10000) / 10000,
      dailyChange: Math.round(dailyChange * 100) / 100,
      yearlyReturn: performance.year1 || 0,
      performance,
      ranking: { month1: 0, month3: 0, year1: 0, sameTypeCount: 0 },
      riskMetrics,
      assetAllocation,
      industryAllocation: [],
      topHoldings,
      managerDetail,
      fees: { managementFee: 0, custodyFee: 0, purchaseFee: 0, redemptionFee: 0 },
      source: 'eastmoney',
    };

    res.json(detail);
  } catch (err) {
    console.error('Fund detail error:', err);
    res.json({
      id: code, code,
      name: `基金${code}`,
      type: '混合型',
      riskLevel: 3,
      manager: '--',
      company: '--',
      establishDate: '--',
      scale: 0,
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
  
  // 1. 尝试东方财富历史净值API
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
  } catch (err) {
    console.error(`fetchFundHistory failed for ${code}:`, err);
  }
  
  // 2. 备选：使用pingzhongdata的净值走势数据
  try {
    const pingzhong = await fetchPingzhongData(code);
    if (pingzhong?.netWorth && Array.isArray(pingzhong.netWorth) && pingzhong.netWorth.length > 0) {
      // Data_netWorthTrend格式: [{x: timestamp, y: navValue}, ...]
      const netWorthData = pingzhong.netWorth;
      
      // 根据days筛选数据
      const now = Date.now();
      const cutoffTime = now - days * 24 * 60 * 60 * 1000;
      
      const filteredData = netWorthData
        .filter((item: any) => {
          const timestamp = typeof item.x === 'number' ? item.x : new Date(item.x).getTime();
          return timestamp >= cutoffTime;
        })
        .map((item: any) => {
          const timestamp = typeof item.x === 'number' ? item.x : new Date(item.x).getTime();
          const dateObj = new Date(timestamp);
          // 使用本地时间格式，避免UTC时区问题
          const date = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
          const value = parseFloat(item.y) || 0;
          return { date, value, accumulatedNav: value, dailyChange: 0 };
        });
      
      if (filteredData.length > 0) {
        res.json({ data: filteredData, source: 'pingzhongdata' });
        return;
      }
    }
  } catch (err) {
    console.error(`fetchPingzhongData fallback failed for ${code}:`, err);
  }
  
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
    
    // 尝试从 pingzhongdata.js 获取数据（更可靠）
    try {
      const pingzhongUrl = `https://fund.eastmoney.com/pingzhongdata/${etfCode}.js`;
      const pingzhongText = await httpGet(pingzhongUrl, { Referer: `https://fund.eastmoney.com/${etfCode}.html` });
      
      // 提取 Data_netWorthTrend 变量
      const netWorthMatch = pingzhongText.match(/var\s+Data_netWorthTrend\s*=\s*(\[[\s\S]*?\]);/);
      if (netWorthMatch) {
        const netWorthData = JSON.parse(netWorthMatch[1]);
        
        // 计算截止日期（days天前）
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        const cutoffTimestamp = cutoffDate.getTime();
        
        // 转换数据格式：{x: timestamp, y: value} -> {date, value}
        const history = netWorthData
          .filter((item: any) => item.x >= cutoffTimestamp)
          .map((item: any) => ({
            date: new Date(item.x).toISOString().split('T')[0],
            value: item.y,
          }));
        
        if (history.length > 0) {
          res.json({ success: true, data: history, source: 'pingzhongdata' });
          return;
        }
      }
    } catch (err) {
      console.log(`Failed to fetch benchmark from pingzhongdata for ${code}, trying fallback`);
    }
    
    // 备选方案：使用 lsjz API
    const url = `https://api.fund.eastmoney.com/f10/lsjz?fundCode=${etfCode}&pageIndex=1&pageSize=${days}&callback=jQuery112409`;
    const text = await httpGet(url, { Referer: `https://fund.eastmoney.com/${etfCode}.html` });
    
    // 解析JSONP响应
    const jsonpMatch = text.match(/jQuery112409\(([\s\S]*)\)/);
    if (!jsonpMatch) {
      res.json({ success: false, data: [], source: 'parse_error' });
      return;
    }
    
    const data = JSON.parse(jsonpMatch[1]);
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
app.post('/api/analysis/portfolio', async (req, res) => {
  const { fundIds } = req.body;
  
  if (!fundIds || !Array.isArray(fundIds) || fundIds.length === 0) {
    return res.json({
      industryDistribution: [],
      holdingsOverlap: { overlappedStocks: [], overlapRate: 0 },
      styleExposure: { marketCap: '--', style: '--', score: 0 },
      portfolioRisk: { estimatedMaxDrawdown: 0, estimatedVolatility: 0, diversificationScore: 0 },
      source: 'error',
    });
  }

  try {
    // 获取所有基金的详细信息
    const fundDetails = await Promise.all(
      fundIds.map(async (code: string) => {
        const pingzhong = await fetchPingzhongData(code);
        return { code, pingzhong };
      })
    );

    // 1. 行业分布分析
    const industryMap = new Map<string, number>();
    fundDetails.forEach(({ pingzhong }) => {
      if (pingzhong?.assetAllocation) {
        const stockRatio = pingzhong.assetAllocation.stock || 0;
        // 简化处理：将股票配置按比例分配
        if (stockRatio > 0) {
          industryMap.set('股票', (industryMap.get('股票') || 0) + stockRatio / fundIds.length);
        }
        const bondRatio = pingzhong.assetAllocation.bond || 0;
        if (bondRatio > 0) {
          industryMap.set('债券', (industryMap.get('债券') || 0) + bondRatio / fundIds.length);
        }
        const cashRatio = pingzhong.assetAllocation.cash || 0;
        if (cashRatio > 0) {
          industryMap.set('现金', (industryMap.get('现金') || 0) + cashRatio / fundIds.length);
        }
      }
    });

    const industryDistribution = Array.from(industryMap.entries()).map(([industry, ratio]) => ({
      industry,
      ratio: Math.round(ratio * 100) / 100,
    }));

    // 2. 重仓股重叠分析
    const stockHoldings = new Map<string, { funds: string[]; totalRatio: number }>();
    fundDetails.forEach(({ code, pingzhong }) => {
      if (pingzhong?.stockCodes && Array.isArray(pingzhong.stockCodes)) {
        pingzhong.stockCodes.forEach((stockCode: string) => {
          if (!stockHoldings.has(stockCode)) {
            stockHoldings.set(stockCode, { funds: [], totalRatio: 0 });
          }
          const holding = stockHoldings.get(stockCode)!;
          holding.funds.push(code);
          holding.totalRatio += 1; // 简化：每只股票计为1份
        });
      }
    });

    const overlappedStocks = Array.from(stockHoldings.entries())
      .filter(([_, data]) => data.funds.length > 1)
      .map(([stockCode, data]) => ({
        stockCode,
        stockName: `股票${stockCode}`,
        funds: data.funds,
        totalRatio: Math.round((data.totalRatio / fundIds.length) * 100) / 100,
      }))
      .sort((a, b) => b.totalRatio - a.totalRatio);

    const overlapRate = overlappedStocks.length > 0
      ? Math.round((overlappedStocks.length / stockHoldings.size) * 10000) / 100
      : 0;

    // 3. 风格暴露分析
    let totalStock = 0;
    let totalBond = 0;
    fundDetails.forEach(({ pingzhong }) => {
      if (pingzhong?.assetAllocation) {
        totalStock += pingzhong.assetAllocation.stock || 0;
        totalBond += pingzhong.assetAllocation.bond || 0;
      }
    });

    const avgStock = totalStock / fundIds.length;
    const avgBond = totalBond / fundIds.length;

    let marketCap: 'large' | 'mid' | 'small' | 'mixed' = 'mixed';
    let style: 'value' | 'growth' | 'balanced' = 'balanced';
    let score = 0;

    // 根据股票和债券比例判断风格
    if (avgStock > 70) {
      style = 'growth';
      score = 80;
    } else if (avgStock < 30) {
      style = 'value';
      score = 40;
    } else {
      style = 'balanced';
      score = 60;
    }

    // 根据规模判断市值风格
    if (avgStock > 60) {
      marketCap = 'large';
    } else if (avgStock > 40) {
      marketCap = 'mid';
    } else {
      marketCap = 'small';
    }

    // 4. 组合风险分析 - 使用 pingzhongdata 的净值走势
    const allNavHistories = await Promise.all(
      fundDetails.map(async ({ code, pingzhong }) => {
        // 优先使用 pingzhongdata 的净值走势
        if (pingzhong?.netWorth && Array.isArray(pingzhong.netWorth)) {
          return pingzhong.netWorth.slice(-100).map((item: any) => parseFloat(item.y) || 0);
        }
        // 备选：尝试从历史净值获取
        const history = await fetchFundHistory(code, 100);
        if (history.length > 0) {
          return history.map((h: any) => parseFloat(h.DWJZ) || 0);
        }
        return [];
      })
    );

    // 计算组合平均净值走势
    const validHistories = allNavHistories.filter(h => h.length > 0);
    let maxDrawdown = 0;
    let volatility = 0;
    
    if (validHistories.length > 0) {
      const maxLen = Math.max(...validHistories.map(h => h.length));
      const portfolioNav: number[] = [];
      for (let i = 0; i < maxLen; i++) {
        let sum = 0;
        let count = 0;
        validHistories.forEach(nav => {
          if (i < nav.length) {
            sum += nav[i];
            count++;
          }
        });
        portfolioNav.push(count > 0 ? sum / count : 0);
      }

      // 计算最大回撤
      let peak = portfolioNav[0] || 0;
      for (const value of portfolioNav) {
        if (value > peak) peak = value;
        const drawdown = (value - peak) / peak;
        if (drawdown < maxDrawdown) maxDrawdown = drawdown;
      }

      // 计算波动率
      const returns: number[] = [];
      for (let i = 1; i < portfolioNav.length; i++) {
        if (portfolioNav[i - 1] > 0) {
          returns.push((portfolioNav[i] - portfolioNav[i - 1]) / portfolioNav[i - 1]);
        }
      }

      const avgReturn = returns.length > 0 ? returns.reduce((a, b) => a + b, 0) / returns.length : 0;
      const variance = returns.length > 0
        ? returns.reduce((sum, r) => sum + (r - avgReturn) ** 2, 0) / returns.length
        : 0;
      volatility = Math.sqrt(variance) * Math.sqrt(252) * 100;
    }

    // 分散度评分：基于基金数量和重叠率
    const diversificationScore = Math.min(100, Math.round(
      (100 - overlapRate) * (fundIds.length / 5) * 0.5
    ));

    res.json({
      industryDistribution,
      holdingsOverlap: {
        overlappedStocks: overlappedStocks.slice(0, 10),
        overlapRate,
      },
      styleExposure: {
        marketCap,
        style,
        score: Math.round(score * 100) / 100,
      },
      portfolioRisk: {
        estimatedMaxDrawdown: Math.round(maxDrawdown * 10000) / 100,
        estimatedVolatility: Math.round(volatility * 100) / 100,
        diversificationScore,
      },
      source: 'calculated',
    });
  } catch (err) {
    console.error('Portfolio analysis error:', err);
    res.json({
      industryDistribution: [],
      holdingsOverlap: { overlappedStocks: [], overlapRate: 0 },
      styleExposure: { marketCap: '--', style: '--', score: 0 },
      portfolioRisk: { estimatedMaxDrawdown: 0, estimatedVolatility: 0, diversificationScore: 0 },
      source: 'error',
    });
  }
});

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
  console.log('Data sources: fundgz.1234567.com.cn, api.fund.eastmoney.com, push2.eastmoney.com (HTTP)');
});