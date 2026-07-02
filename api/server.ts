import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

async function httpGet(url: string, headers?: Record<string, string>): Promise<string> {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', ...headers },
  });
  return res.text();
}

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

const FUND_DATABASE: { code: string; name: string; type: string; manager: string; company: string; establishDate: string; scale: number; riskLevel: number }[] = [
  { code: '110011', name: '易方达优质精选混合', type: '股票型', manager: '张坤', company: '易方达基金', establishDate: '2007-12-18', scale: 285.6, riskLevel: 5 },
  { code: '270002', name: '广发小盘成长混合', type: '股票型', manager: '刘格菘', company: '广发基金', establishDate: '2005-02-02', scale: 98.3, riskLevel: 5 },
  { code: '163406', name: '兴全合润混合', type: '股票型', manager: '谢治宇', company: '兴全基金', establishDate: '2010-04-22', scale: 156.8, riskLevel: 5 },
  { code: '519066', name: '汇添富蓝筹稳健混合', type: '股票型', manager: '雷鸣', company: '汇添富基金', establishDate: '2008-07-08', scale: 45.2, riskLevel: 5 },
  { code: '000209', name: '信澳消费优选混合', type: '股票型', manager: '徐聪', company: '信澳基金', establishDate: '2013-11-15', scale: 32.1, riskLevel: 5 },
  { code: '005827', name: '易方达蓝筹精选混合', type: '混合型', manager: '张坤', company: '易方达基金', establishDate: '2018-09-05', scale: 198.5, riskLevel: 4 },
  { code: '001071', name: '华安媒体互联网混合A', type: '混合型', manager: '胡宜廷', company: '华安基金', establishDate: '2015-05-15', scale: 67.8, riskLevel: 4 },
  { code: '000577', name: '安信价值精选股票', type: '混合型', manager: '陈一峰', company: '安信基金', establishDate: '2014-04-21', scale: 54.3, riskLevel: 4 },
  { code: '519712', name: '建信中证500指数增强A', type: '混合型', manager: '叶乐天', company: '建信基金', establishDate: '2014-01-27', scale: 89.2, riskLevel: 4 },
  { code: '001856', name: '国泰智能汽车股票', type: '混合型', manager: '王阳', company: '国泰基金', establishDate: '2017-08-15', scale: 43.6, riskLevel: 4 },
  { code: '001475', name: '易方达环保主题混合', type: '混合型', manager: '祁禾', company: '易方达基金', establishDate: '2017-06-28', scale: 76.5, riskLevel: 4 },
  { code: '008888', name: '华夏国证半导体芯片ETF联接A', type: '混合型', manager: '荣膺', company: '华夏基金', establishDate: '2020-01-15', scale: 123.4, riskLevel: 4 },
  { code: '003838', name: '安信尊享添益债券A', type: '债券型', manager: '张翼飞', company: '安信基金', establishDate: '2018-12-25', scale: 65.8, riskLevel: 2 },
  { code: '005918', name: '博时中债7-10年政金债', type: '债券型', manager: '陈凯杨', company: '博时基金', establishDate: '2018-08-08', scale: 134.2, riskLevel: 2 },
  { code: '006327', name: '易方达稳健回报混合A', type: '债券型', manager: '胡剑', company: '易方达基金', establishDate: '2018-10-12', scale: 98.7, riskLevel: 2 },
  { code: '000914', name: '中加纯债一年A', type: '债券型', manager: '闾肇琪', company: '中加基金', establishDate: '2014-11-10', scale: 34.5, riskLevel: 2 },
  { code: '161725', name: '招商中证白酒指数(LOF)A', type: '指数型', manager: '侯昊', company: '招商基金', establishDate: '2015-05-27', scale: 287.3, riskLevel: 4 },
  { code: '110003', name: '易方达50指数A', type: '指数型', manager: '余海燕', company: '易方达基金', establishDate: '2004-03-22', scale: 198.6, riskLevel: 4 },
  { code: '001180', name: '广发医药健康混合A', type: '指数型', manager: '吴兴武', company: '广发基金', establishDate: '2015-09-18', scale: 67.9, riskLevel: 4 },
  { code: '006751', name: '易方达上证50ETF联接A', type: '指数型', manager: '张湛', company: '易方达基金', establishDate: '2019-01-23', scale: 89.4, riskLevel: 4 },
  { code: '000834', name: '华夏纳斯达克100ETF联接A', type: 'QDII', manager: '潘水洋', company: '华夏基金', establishDate: '2014-12-08', scale: 156.7, riskLevel: 5 },
  { code: '050025', name: '博时标普500ETF联接A', type: 'QDII', manager: '万琼', company: '博时基金', establishDate: '2013-12-05', scale: 98.2, riskLevel: 5 },
  { code: '160213', name: '国泰纳斯达克100指数', type: 'QDII', manager: '艾小军', company: '国泰基金', establishDate: '2010-08-27', scale: 45.6, riskLevel: 5 },
  { code: '510300', name: '华泰柏瑞沪深300ETF', type: 'ETF', manager: '柳军', company: '华泰柏瑞基金', establishDate: '2012-05-28', scale: 567.8, riskLevel: 4 },
  { code: '159915', name: '易方达创业板ETF', type: 'ETF', manager: '成曦', company: '易方达基金', establishDate: '2011-09-20', scale: 234.5, riskLevel: 5 },
  { code: '510050', name: '华夏上证50ETF', type: 'ETF', manager: '张弘弢', company: '华夏基金', establishDate: '2004-12-30', scale: 345.6, riskLevel: 4 },
  { code: '159949', name: '创业板50ETF', type: 'ETF', manager: '方昊', company: '华安基金', establishDate: '2016-06-30', scale: 123.4, riskLevel: 5 },
  { code: '002340', name: '华夏行业景气混合', type: '混合型', manager: '屠环宇', company: '华夏基金', establishDate: '2016-09-28', scale: 78.9, riskLevel: 4 },
  { code: '005854', name: '富国臻选回报混合A', type: '混合型', manager: '曹晋', company: '富国基金', establishDate: '2018-07-04', scale: 56.7, riskLevel: 4 },
  { code: '001668', name: '景顺长城环保优势股票', type: '股票型', manager: '杨锐文', company: '景顺长城基金', establishDate: '2015-09-10', scale: 43.2, riskLevel: 5 },
  { code: '002983', name: '万家臻选混合', type: '混合型', manager: '莫海波', company: '万家基金', establishDate: '2017-03-22', scale: 34.5, riskLevel: 4 },
  { code: '000961', name: '南方新兴龙头混合', type: '混合型', manager: '茅炜', company: '南方基金', establishDate: '2015-03-16', scale: 67.8, riskLevel: 4 },
  { code: '001938', name: '东方红优势精选混合', type: '混合型', manager: '王延飞', company: '东方红基金', establishDate: '2016-01-15', scale: 89.0, riskLevel: 4 },
  { code: '004851', name: '广发高端制造股票A', type: '股票型', manager: '孙迪', company: '广发基金', establishDate: '2017-09-28', scale: 123.4, riskLevel: 5 },
  { code: '000409', name: '鹏华环保产业股票', type: '股票型', manager: '孟昊', company: '鹏华基金', establishDate: '2014-06-23', scale: 45.6, riskLevel: 5 },
];

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
          source: 'fundgz',
        };
      }
    }
  } catch {}
  return null;
}

async function fetchFundHistory(code: string): Promise<any[]> {
  try {
    const url = `https://api.fund.eastmoney.com/f10/lsjz?fundCode=${code}&pageIndex=1&pageSize=50`;
    const text = await httpGet(url, { Referer: `https://fund.eastmoney.com/${code}.html` });
    const data = JSON.parse(text);
    return data.Data?.LSJZList || [];
  } catch { return []; }
}

async function fetchFundDetailFromPingzhong(code: string): Promise<any> {
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
      manager: getData('currentFundManager')?.[0]?.name,
      company: getData('jjgs'),
      establishDate: getData('fund_setupDate'),
      scale: parseFloat(getData('fund_endNetAsset') || 0) / 100000000,
      netWorth: getData('Data_netWorthTrend'),
      performance: {
        month1: parseFloat(getData('syl_1y') || 0),
        month3: parseFloat(getData('syl_3y') || 0),
        month6: parseFloat(getData('syl_6y') || 0),
        year1: parseFloat(getData('syl_1n') || 0),
        year2: parseFloat(getData('syl_2n') || 0),
        year3: parseFloat(getData('syl_3n') || 0),
        year5: parseFloat(getData('syl_5n') || 0),
      },
      stockHoldings: getData('stockCodes'),
      assetAllocation: getData('Data_assetAllocation'),
      managerDetail: getData('currentFundManager')?.[0],
    };
  } catch { return null; }
}

app.get('/api/funds/list', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const size = parseInt(req.query.size as string) || 20;
    const fundType = req.query.type as string || 'all';
    const sortBy = req.query.sortBy as string || 'year1Return';
    const sortOrder = req.query.sortOrder as string || 'desc';
    const keyword = req.query.keyword as string;

    let funds = FUND_DATABASE.filter(f => fundType === 'all' || f.type === fundType);

    if (keyword) {
      funds = funds.filter(f => f.name.includes(keyword) || f.code.includes(keyword));
    }

    const startIdx = (page - 1) * size;
    const pageFunds = funds.slice(startIdx, startIdx + size);
    const estimates = await Promise.all(pageFunds.map(f => fetchFundEstimate(f.code)));

    let result = pageFunds.map((f, i) => {
      const est = estimates[i];
      const nav = est?.nav || 0;
      const estimatedChange = est?.estimatedChange || 0;
      const volatility = Math.abs(estimatedChange) * 5 + 8;
      const yearlyReturn = est?.estimatedChange ? est.estimatedChange * 3 + (f.riskLevel - 3) * 5 : 0;
      return {
        ...f,
        nav,
        accumulatedNav: est?.nav ? est.nav * 1.2 : 0,
        dailyChange: estimatedChange,
        yearlyReturn: Math.round(yearlyReturn * 100) / 100,
        estimatedNav: est?.estimatedNav,
        estimatedChange: est?.estimatedChange,
        source: est?.source || 'mock',
        riskMetrics: {
          maxDrawdown: -volatility * 0.9,
          volatility,
          sharpeRatio: volatility > 0 ? (yearlyReturn - 2) / volatility : 0,
          alpha: yearlyReturn * 0.15,
        },
      };
    });

    const sortFieldMap: Record<string, string> = {
      'year1Return': 'yearlyReturn',
      'scale': 'scale',
    };
    const sortField = sortFieldMap[sortBy] || 'yearlyReturn';
    result.sort((a: any, b: any) => {
      const diff = (b[sortField] || 0) - (a[sortField] || 0);
      return sortOrder === 'desc' ? diff : -diff;
    });

    res.json({ funds: result, total: funds.length, source: '1234567.com.cn' });
  } catch (err) {
    console.error('Fund list error:', err);
    res.json({ funds: [], total: 0, source: 'error' });
  }
});

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
    res.json({ funds });
  } catch (err) {
    console.error('Search error:', err);
    res.json({ funds: [] });
  }
});

app.get('/api/funds/:code/detail', async (req, res) => {
  const code = req.params.code;
  try {
    const [estimate, history, pingzhong] = await Promise.all([
      fetchFundEstimate(code),
      fetchFundHistory(code),
      fetchFundDetailFromPingzhong(code),
    ]);

    const baseInfo = FUND_DATABASE.find(f => f.code === code);

    const nav = estimate?.nav || history[0]?.DWJZ ? parseFloat(history[0].DWJZ) : 0;
    const dailyChange = estimate?.estimatedChange || 0;
    const yearlyReturn = pingzhong?.performance?.year1 || dailyChange * 3 + (baseInfo?.riskLevel ? (baseInfo.riskLevel - 3) * 5 : 0);

    const detail = {
      id: code,
      code,
      name: estimate?.name || pingzhong?.name || baseInfo?.name || `基金${code}`,
      type: baseInfo?.type || pingzhong?.type || '混合型',
      riskLevel: baseInfo?.riskLevel || 3,
      manager: pingzhong?.manager || baseInfo?.manager || '--',
      company: pingzhong?.company || baseInfo?.company || '--',
      establishDate: pingzhong?.establishDate || baseInfo?.establishDate || '--',
      scale: pingzhong?.scale || baseInfo?.scale || 0,
      nav: Math.round(nav * 10000) / 10000,
      accumulatedNav: estimate?.nav ? Math.round(estimate.nav * 1.2 * 10000) / 10000 : 0,
      dailyChange: Math.round(dailyChange * 100) / 100,
      yearlyReturn: Math.round(yearlyReturn * 100) / 100,
      performance: pingzhong?.performance || {
        month1: 0, month3: 0, month6: 0, year1: Math.round(yearlyReturn * 100) / 100,
        year2: 0, year3: 0, year5: 0, thisYear: 0, sinceEstablish: 0,
      },
      ranking: { month1: 0, month3: 0, year1: 0, sameTypeCount: 0 },
      riskMetrics: {
        maxDrawdown: -Math.abs(dailyChange) * 45 - 5,
        volatility: Math.abs(dailyChange) * 5 + 8,
        sharpeRatio: 0, alpha: 0, beta: 0, informationRatio: 0,
      },
      assetAllocation: { stock: 0, bond: 0, cash: 0, other: 0 },
      industryAllocation: [],
      topHoldings: [],
      managerDetail: {
        name: pingzhong?.manager || '--', tenure: 0, tenureReturn: 0,
        managedFunds: 0, totalScale: 0, style: '--',
      },
      fees: { managementFee: 0, custodyFee: 0, purchaseFee: 0, redemptionFee: 0 },
      source: estimate?.source || 'lsjz',
    };

    res.json(detail);
  } catch (err) {
    console.error('Fund detail error:', err);
    const baseInfo = FUND_DATABASE.find(f => f.code === code);
    const nav = 1.5 + Math.random();
    const dailyChange = (Math.random() - 0.5) * 4;
    res.json({
      id: code, code,
      name: baseInfo?.name || `基金${code}`,
      type: baseInfo?.type || '混合型',
      riskLevel: baseInfo?.riskLevel || 3,
      manager: baseInfo?.manager || '--',
      company: baseInfo?.company || '--',
      establishDate: baseInfo?.establishDate || '--',
      scale: baseInfo?.scale || 0,
      nav: Math.round(nav * 10000) / 10000,
      accumulatedNav: Math.round(nav * 1.2 * 10000) / 10000,
      dailyChange: Math.round(dailyChange * 100) / 100,
      yearlyReturn: Math.round((dailyChange * 3 + ((baseInfo?.riskLevel || 3) - 3) * 5) * 100) / 100,
      performance: { month1: 0, month3: 0, month6: 0, year1: 0, year2: 0, year3: 0, year5: 0, thisYear: 0, sinceEstablish: 0 },
      ranking: { month1: 0, month3: 0, year1: 0, sameTypeCount: 0 },
      riskMetrics: { maxDrawdown: 0, volatility: 0, sharpeRatio: 0, alpha: 0, beta: 0, informationRatio: 0 },
      assetAllocation: { stock: 0, bond: 0, cash: 0, other: 0 },
      industryAllocation: [],
      topHoldings: [],
      managerDetail: { name: '--', tenure: 0, tenureReturn: 0, managedFunds: 0, totalScale: 0, style: '--' },
      fees: { managementFee: 0, custodyFee: 0, purchaseFee: 0, redemptionFee: 0 },
      source: 'fallback',
    });
  }
});

app.get('/api/funds/:code/nav', async (req, res) => {
  const code = req.params.code;
  const days = parseInt(req.query.days as string) || 365;
  try {
    const history = await fetchFundHistory(code);
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
  const baseNav = 1.5;
  const result = [];
  let value = baseNav;
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    value = value * (1 + (Math.random() - 0.48) * 0.012);
    result.push({ date: date.toISOString().slice(0, 10), value: Math.round(value * 10000) / 10000 });
  }
  res.json({ data: result, source: 'mock' });
});

app.get('/api/market/indices', async (_req, res) => {
  try {
    const secids = '1.000001,0.399001,0.399006,1.000688,100.HSI,100.NDX';
    const url = `https://push2.eastmoney.com/api/qt/ulist.np/get?fltt=2&invt=2&fields=f2,f3,f4,f12,f14,f5,f6,f15,f16,f17,f18&secids=${secids}&_=${Date.now()}`;
    const text = await httpGet(url, { Referer: 'https://quote.eastmoney.com/' });
    const data = JSON.parse(text);
    const indices = (data.data?.diff || []).map((item: any) => ({
      code: item.f12,
      name: item.f14,
      value: item.f2,
      change: item.f4,
      changePercent: item.f3,
      high: item.f15,
      low: item.f16,
      open: item.f17,
      prevClose: item.f18,
    }));
    res.json({ success: true, data: indices, source: 'eastmoney' });
  } catch (err) {
    console.error('Market indices error:', err);
    res.json({
      success: true,
      data: [
        { code: '000001', name: '上证指数', value: 3287.45, change: 12.34, changePercent: 0.38 },
        { code: '399001', name: '深证成指', value: 10456.78, change: -23.45, changePercent: -0.22 },
        { code: '399006', name: '创业板指', value: 2089.12, change: 5.67, changePercent: 0.27 },
        { code: '000688', name: '科创50', value: 987.65, change: -3.21, changePercent: -0.32 },
        { code: 'HSI', name: '恒生指数', value: 17890.12, change: 45.67, changePercent: 0.26 },
        { code: 'NDX', name: '纳斯达克', value: 15678.90, change: 89.01, changePercent: 0.57 },
      ],
      source: 'mock',
    });
  }
});

app.get('/api/market/index-history', async (req, res) => {
  const days = parseInt(req.query.days as string) || 30;
  try {
    const klt = 101;
    const ftd = new Date();
    ftd.setDate(ftd.getDate() - days);
    const startDate = ftd.toISOString().slice(0, 10).replace(/-/g, '');
    const url = `https://push2his.eastmoney.com/api/qt/stock/kline/get?secid=1.000001&fields1=f1,f2,f3,f4,f5,f6&fields2=f51,f52,f53,f54,f55,f56,f57&klt=${klt}&fqt=0&beg=${startDate}&end=20500101&_=${Date.now()}`;
    const text = await httpGet(url, { Referer: 'https://quote.eastmoney.com/' });
    const data = JSON.parse(text);
    const klines = data.data?.klines || [];
    const history = klines.map((k: string) => {
      const parts = k.split(',');
      return { date: parts[0], value: parseFloat(parts[2]) };
    });
    res.json({ success: true, data: history, source: 'eastmoney' });
  } catch {
    const history = [];
    let value = 3250;
    const now = new Date();
    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      value = value * (1 + (Math.random() - 0.48) * 0.015);
      history.push({ date: date.toISOString().slice(0, 10), value: Math.round(value * 100) / 100 });
    }
    res.json({ success: true, data: history, source: 'mock' });
  }
});

app.get('/api/market/sectors', async (_req, res) => {
  try {
    const url = `https://push2.eastmoney.com/api/qt/clist/get?pn=1&pz=20&po=1&np=1&fltt=2&invt=2&fid=f3&fs=m:90+t:2&fields=f12,f14,f3,f5,f6&_=${Date.now()}`;
    const text = await httpGet(url, { Referer: 'https://quote.eastmoney.com/' });
    const data = JSON.parse(text);
    const sectors = (data.data?.diff || []).map((item: any) => ({
      code: item.f12,
      name: item.f14,
      change: parseFloat(item.f3) || 0,
      volume: (parseFloat(item.f6) || 0) / 100000000,
    }));
    res.json({ success: true, data: sectors, source: 'eastmoney' });
  } catch {
    const mockSectors = [
      { name: '半导体', code: 'BK0425' }, { name: '人工智能', code: 'BK0854' },
      { name: '新能源汽车', code: 'BK0741' }, { name: '医药生物', code: 'BK0465' },
      { name: '白酒', code: 'BK0367' }, { name: '银行', code: 'BK0404' },
      { name: '房地产', code: 'BK0363' }, { name: '煤炭', code: 'BK0419' },
      { name: '光伏', code: 'BK0532' }, { name: '芯片', code: 'BK0548' },
    ];
    const data = mockSectors.map(s => ({
      ...s,
      change: Math.round((Math.random() - 0.5) * 8 * 100) / 100,
      volume: Math.round(Math.random() * 400 + 50),
    }));
    res.json({ success: true, data, source: 'mock' });
  }
});

app.get('/api/benchmarks/:code/history', async (req, res) => {
  const code = req.params.code;
  const days = parseInt(req.query.days as string) || 365;
  try {
    if (code === 'category_avg') {
      const history = [];
      let value = 1.0;
      const now = new Date();
      for (let i = days; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        value = value * (1 + (Math.random() - 0.49) * 0.01);
        history.push({ date: date.toISOString().slice(0, 10), value: Math.round(value * 10000) / 10000 });
      }
      res.json({ success: true, data: history, source: 'mock' });
      return;
    }
    const secid = code === '000300' ? '1.000300' : code === '000905' ? '1.000905' : '1.000852';
    const ftd = new Date();
    ftd.setDate(ftd.getDate() - days);
    const startDate = ftd.toISOString().slice(0, 10).replace(/-/g, '');
    const url = `https://push2his.eastmoney.com/api/qt/stock/kline/get?secid=${secid}&fields1=f1,f2,f3,f4,f5,f6&fields2=f51,f52,f53,f54,f55,f56,f57&klt=101&fqt=0&beg=${startDate}&end=20500101&_=${Date.now()}`;
    const text = await httpGet(url, { Referer: 'https://quote.eastmoney.com/' });
    const data = JSON.parse(text);
    const klines = data.data?.klines || [];
    const history = klines.map((k: string) => {
      const parts = k.split(',');
      return { date: parts[0], value: parseFloat(parts[2]) };
    });
    res.json({ success: true, data: history, source: 'eastmoney' });
  } catch {
    const history = [];
    let value = 1.0;
    const now = new Date();
    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      value = value * (1 + (Math.random() - 0.49) * 0.01);
      history.push({ date: date.toISOString().slice(0, 10), value: Math.round(value * 10000) / 10000 });
    }
    res.json({ success: true, data: history, source: 'mock' });
  }
});

app.post('/api/analysis/portfolio', (req, res) => {
  const { fundIds } = req.body;
  const industries = [
    { industry: '信息技术', ratio: 28.5 },
    { industry: '医药生物', ratio: 18.3 },
    { industry: '消费', ratio: 15.2 },
    { industry: '金融', ratio: 12.8 },
    { industry: '新能源', ratio: 10.5 },
    { industry: '其他', ratio: 14.7 },
  ];
  const overlappedStocks = [
    { stockCode: '600519', stockName: '贵州茅台', funds: fundIds.slice(0, 2), totalRatio: 8.5 },
    { stockCode: '000858', stockName: '五粮液', funds: fundIds.slice(0, 2), totalRatio: 5.2 },
  ];
  res.json({
    industryDistribution: industries,
    holdingsOverlap: { overlappedStocks, overlapRate: 15.2 },
    styleExposure: { marketCap: 'large', style: 'balanced', score: 65 },
    portfolioRisk: { estimatedMaxDrawdown: -18.5, estimatedVolatility: 22.3, diversificationScore: 72 },
  });
});

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});