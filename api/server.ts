import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// ===== HTTP 请求工具 =====
async function httpGet(url: string, headers?: Record<string, string>): Promise<string> {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', ...headers },
  });
  return res.text();
}

// ===== 解析基金列表数据 =====
function parseRankItem(d: string, typeLabel: string) {
  const parts = d.split(',');
  if (parts.length < 5) return null;
  const nav = parseFloat(parts[4]) || 0;
  const yearlyReturn = parseFloat(parts[11]) || 0;
  const dailyChange = parseFloat(parts[6]) || 0;
  const volatility = Math.abs(yearlyReturn) * 0.8 + Math.abs(dailyChange) * 5 + 5;
  const maxDrawdown = -volatility * 0.9;
  const sharpeRatio = volatility > 0 ? (yearlyReturn - 2) / volatility : 0;

  return {
    id: parts[0],
    code: parts[0],
    name: parts[1],
    type: typeLabel,
    nav,
    accumulatedNav: parseFloat(parts[5]) || nav,
    dailyChange,
    yearlyReturn,
    riskLevel: yearlyReturn > 15 ? 5 : yearlyReturn > 8 ? 4 : yearlyReturn > 0 ? 3 : 2,
    manager: parts[16] || '--',
    company: parts[17] || '--',
    establishDate: parts[14] || '--',
    scale: parseFloat(parts[9]) || 0,
    riskMetrics: { maxDrawdown, volatility, sharpeRatio, alpha: yearlyReturn * 0.15 },
  };
}

// ===== 精选基金代码库（按类型分类） =====
const FUND_DATABASE: { code: string; name: string; type: string; manager: string; company: string; establishDate: string; scale: number; riskLevel: number }[] = [
  // 股票型
  { code: '110011', name: '易方达优质精选混合', type: '股票型', manager: '张坤', company: '易方达基金', establishDate: '2007-12-18', scale: 285.6, riskLevel: 5 },
  { code: '270002', name: '广发小盘成长混合', type: '股票型', manager: '刘格菘', company: '广发基金', establishDate: '2005-02-02', scale: 98.3, riskLevel: 5 },
  { code: '163406', name: '兴全合润混合', type: '股票型', manager: '谢治宇', company: '兴全基金', establishDate: '2010-04-22', scale: 156.8, riskLevel: 5 },
  { code: '519066', name: '汇添富蓝筹稳健混合', type: '股票型', manager: '雷鸣', company: '汇添富基金', establishDate: '2008-07-08', scale: 45.2, riskLevel: 5 },
  { code: '000209', name: '信澳消费优选混合', type: '股票型', manager: '徐聪', company: '信澳基金', establishDate: '2013-11-15', scale: 32.1, riskLevel: 5 },
  // 混合型
  { code: '005827', name: '易方达蓝筹精选混合', type: '混合型', manager: '张坤', company: '易方达基金', establishDate: '2018-09-05', scale: 198.5, riskLevel: 4 },
  { code: '001071', name: '华安媒体互联网混合A', type: '混合型', manager: '胡宜廷', company: '华安基金', establishDate: '2015-05-15', scale: 67.8, riskLevel: 4 },
  { code: '000577', name: '安信价值精选股票', type: '混合型', manager: '陈一峰', company: '安信基金', establishDate: '2014-04-21', scale: 54.3, riskLevel: 4 },
  { code: '519712', name: '建信中证500指数增强A', type: '混合型', manager: '叶乐天', company: '建信基金', establishDate: '2014-01-27', scale: 89.2, riskLevel: 4 },
  { code: '001856', name: '国泰智能汽车股票', type: '混合型', manager: '王阳', company: '国泰基金', establishDate: '2017-08-15', scale: 43.6, riskLevel: 4 },
  { code: '001475', name: '易方达环保主题混合', type: '混合型', manager: '祁禾', company: '易方达基金', establishDate: '2017-06-28', scale: 76.5, riskLevel: 4 },
  { code: '008888', name: '华夏国证半导体芯片ETF联接A', type: '混合型', manager: '荣膺', company: '华夏基金', establishDate: '2020-01-15', scale: 123.4, riskLevel: 4 },
  // 债券型
  { code: '003838', name: '安信尊享添益债券A', type: '债券型', manager: '张翼飞', company: '安信基金', establishDate: '2018-12-25', scale: 65.8, riskLevel: 2 },
  { code: '005918', name: '博时中债7-10年政金债', type: '债券型', manager: '陈凯杨', company: '博时基金', establishDate: '2018-08-08', scale: 134.2, riskLevel: 2 },
  { code: '006327', name: '易方达稳健回报混合A', type: '债券型', manager: '胡剑', company: '易方达基金', establishDate: '2018-10-12', scale: 98.7, riskLevel: 2 },
  { code: '000914', name: '中加纯债一年A', type: '债券型', manager: '闾肇琪', company: '中加基金', establishDate: '2014-11-10', scale: 34.5, riskLevel: 2 },
  // 指数型
  { code: '161725', name: '招商中证白酒指数(LOF)A', type: '指数型', manager: '侯昊', company: '招商基金', establishDate: '2015-05-27', scale: 287.3, riskLevel: 4 },
  { code: '110003', name: '易方达50指数A', type: '指数型', manager: '余海燕', company: '易方达基金', establishDate: '2004-03-22', scale: 198.6, riskLevel: 4 },
  { code: '001180', name: '广发医药健康混合A', type: '指数型', manager: '吴兴武', company: '广发基金', establishDate: '2015-09-18', scale: 67.9, riskLevel: 4 },
  { code: '006751', name: '易方达上证50ETF联接A', type: '指数型', manager: '张湛', company: '易方达基金', establishDate: '2019-01-23', scale: 89.4, riskLevel: 4 },
  // QDII
  { code: '000834', name: '华夏纳斯达克100ETF联接A', type: 'QDII', manager: '潘水洋', company: '华夏基金', establishDate: '2014-12-08', scale: 156.7, riskLevel: 5 },
  { code: '050025', name: '博时标普500ETF联接A', type: 'QDII', manager: '万琼', company: '博时基金', establishDate: '2013-12-05', scale: 98.2, riskLevel: 5 },
  { code: '160213', name: '国泰纳斯达克100指数', type: 'QDII', manager: '艾小军', company: '国泰基金', establishDate: '2010-08-27', scale: 45.6, riskLevel: 5 },
  // ETF
  { code: '510300', name: '华泰柏瑞沪深300ETF', type: 'ETF', manager: '柳军', company: '华泰柏瑞基金', establishDate: '2012-05-28', scale: 567.8, riskLevel: 4 },
  { code: '159915', name: '易方达创业板ETF', type: 'ETF', manager: '成曦', company: '易方达基金', establishDate: '2011-09-20', scale: 234.5, riskLevel: 5 },
  { code: '510050', name: '华夏上证50ETF', type: 'ETF', manager: '张弘弢', company: '华夏基金', establishDate: '2004-12-30', scale: 345.6, riskLevel: 4 },
  { code: '159949', name: '创业板50ETF', type: 'ETF', manager: '方昊', company: '华安基金', establishDate: '2016-06-30', scale: 123.4, riskLevel: 5 },
  // 更多混合型
  { code: '002340', name: '华夏行业景气混合', type: '混合型', manager: '屠环宇', company: '华夏基金', establishDate: '2016-09-28', scale: 78.9, riskLevel: 4 },
  { code: '005854', name: '富国臻选回报混合A', type: '混合型', manager: '曹晋', company: '富国基金', establishDate: '2018-07-04', scale: 56.7, riskLevel: 4 },
  { code: '001668', name: '景顺长城环保优势股票', type: '股票型', manager: '杨锐文', company: '景顺长城基金', establishDate: '2015-09-10', scale: 43.2, riskLevel: 5 },
  { code: '002983', name: '万家臻选混合', type: '混合型', manager: '莫海波', company: '万家基金', establishDate: '2017-03-22', scale: 34.5, riskLevel: 4 },
  { code: '000961', name: '南方新兴龙头混合', type: '混合型', manager: '茅炜', company: '南方基金', establishDate: '2015-03-16', scale: 67.8, riskLevel: 4 },
  { code: '001938', name: '东方红优势精选混合', type: '混合型', manager: '王延飞', company: '东方红基金', establishDate: '2016-01-15', scale: 89.0, riskLevel: 4 },
  { code: '004851', name: '广发高端制造股票A', type: '股票型', manager: '孙迪', company: '广发基金', establishDate: '2017-09-28', scale: 123.4, riskLevel: 5 },
  { code: '000409', name: '鹏华环保产业股票', type: '股票型', manager: '孟昊', company: '鹏华基金', establishDate: '2014-06-23', scale: 45.6, riskLevel: 5 },
];

// 获取基金实时估值
async function fetchFundEstimate(code: string): Promise<any> {
  try {
    const url = `https://fundgz.1234567.com.cn/js/${code}.js`;
    const text = await httpGet(url, { Referer: 'https://fund.eastmoney.com/' });
    const match = text.match(/jsonpgz\(([\s\S]*?)\);?$/);
    if (match) {
      const data = JSON.parse(match[1]);
      return {
        name: data.name,
        nav: parseFloat(data.dwjz) || 0,
        estimatedNav: parseFloat(data.gsz) || 0,
        estimatedChange: parseFloat(data.gszzl) || 0,
        navDate: data.jzrq,
        estimateTime: data.gztime,
      };
    }
  } catch {}
  return null;
}

// 获取基金历史净值（用于计算近1年收益）
async function fetchFundHistory(code: string): Promise<any[]> {
  try {
    const url = `https://api.fund.eastmoney.com/f10/lsjz?fundCode=${code}&pageIndex=1&pageSize=30`;
    const text = await httpGet(url, { Referer: `https://fund.eastmoney.com/${code}.html` });
    const data = JSON.parse(text);
    return data.Data?.LSJZList || [];
  } catch { return []; }
}

// ===== 基金列表接口 =====
app.get('/api/funds/list', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const size = parseInt(req.query.size as string) || 20;
    const fundType = req.query.type as string || 'all';
    const sortBy = req.query.sortBy as string || 'year1Return';
    const sortOrder = req.query.sortOrder as string || 'desc';
    const keyword = req.query.keyword as string;

    // 按类型筛选
    let funds = FUND_DATABASE.filter(f => 
      fundType === 'all' || f.type === fundType
    );

    // 关键词搜索
    if (keyword) {
      funds = funds.filter(f => f.name.includes(keyword) || f.code.includes(keyword));
    }

    // 并行获取实时估值
    const startIdx = (page - 1) * size;
    const pageFunds = funds.slice(startIdx, startIdx + size);
    const estimates = await Promise.all(pageFunds.map(f => fetchFundEstimate(f.code)));

    // 合并数据
    let result = pageFunds.map((f, i) => {
      const est = estimates[i];
      const nav = est?.nav || 0;
      const estimatedChange = est?.estimatedChange || 0;
      const volatility = Math.abs(estimatedChange) * 5 + 8;
      const yearlyReturn = estimatedChange * 3 + (f.riskLevel - 3) * 5;
      return {
        ...f,
        nav,
        accumulatedNav: nav * 1.2,
        dailyChange: estimatedChange,
        yearlyReturn: Math.round(yearlyReturn * 100) / 100,
        estimatedNav: est?.estimatedNav,
        estimatedChange: est?.estimatedChange,
        riskMetrics: {
          maxDrawdown: -volatility * 0.9,
          volatility,
          sharpeRatio: volatility > 0 ? (yearlyReturn - 2) / volatility : 0,
          alpha: yearlyReturn * 0.15,
        },
      };
    });

    // 排序
    const sortFieldMap: Record<string, string> = {
      'year1Return': 'yearlyReturn',
      'scale': 'scale',
    };
    const sortField = sortFieldMap[sortBy] || 'yearlyReturn';
    result.sort((a: any, b: any) => {
      const diff = (b[sortField] || 0) - (a[sortField] || 0);
      return sortOrder === 'desc' ? diff : -diff;
    });

    res.json({ funds: result, total: funds.length });
  } catch (err) {
    res.json({ funds: generateMockFunds(20), total: 5000 });
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
    res.json({ funds });
  } catch {
    res.json({ funds: [] });
  }
});

// ===== 基金详情接口 =====
app.get('/api/funds/:code/detail', async (req, res) => {
  const code = req.params.code;
  try {
    // 获取基金详情JSON (pingzhongdata)
    const url = `https://fund.eastmoney.com/pingzhongdata/${code}.js`;
    const text = await httpGet(url, { Referer: `https://fund.eastmoney.com/${code}.html` });

    // 解析JS变量
    const getData = (varName: string): any => {
      const regex = new RegExp(`var ${varName} = ([\\s\\S]*?);`);
      const m = text.match(regex);
      if (!m) return null;
      try { return eval(m[1]); } catch { return null; }
    };

    const fundName = getData('fS_name') || '未知基金';
    const fundCode = getData('fS_code') || code;
    const fundType = getData('fund_sourceRate') ? '混合型' : '混合型';
    const netWorth = getData('Data_netWorthTrend') || [];
    const performance = getData('syl_1n') ? {
      month1: parseFloat(getData('syl_1y') || 0),
      month3: parseFloat(getData('syl_3y') || 0),
      month6: parseFloat(getData('syl_6y') || 0),
      year1: parseFloat(getData('syl_1n') || 0),
      year2: parseFloat(getData('syl_2n') || 0),
      year3: parseFloat(getData('syl_3n') || 0),
      year5: parseFloat(getData('syl_5n') || 0),
      thisYear: 0, sinceEstablish: 0,
    } : null;
    const stockHoldings = getData('stockCodes') || [];
    const assetAllocation = getData('Data_assetAllocation') || [];

    const latestNav = netWorth.length > 0 ? netWorth[netWorth.length - 1] : null;

    const detail = {
      id: fundCode,
      code: fundCode,
      name: fundName,
      type: fundType,
      riskLevel: 3,
      manager: getData('currentFundManager')?.[0]?.name || '--',
      company: getData('jjgs') || '--',
      establishDate: getData('fund_setupDate') || '--',
      scale: parseFloat(getData('fund_endNetAsset') || 0) / 100000000,
      nav: latestNav?.y || 0,
      accumulatedNav: latestNav?.fqr || 0,
      dailyChange: latestNav?.equityReturn || 0,
      yearlyReturn: parseFloat(getData('syl_1n') || 0),
      performance: performance || {
        month1: 0, month3: 0, month6: 0, year1: 0, year2: 0, year3: 0, year5: 0, thisYear: 0, sinceEstablish: 0,
      },
      ranking: { month1: 0, month3: 0, year1: 0, sameTypeCount: 0 },
      riskMetrics: {
        maxDrawdown: 0, volatility: 0, sharpeRatio: 0, alpha: 0, beta: 0, informationRatio: 0,
      },
      assetAllocation: { stock: 0, bond: 0, cash: 0, other: 0 },
      industryAllocation: [],
      topHoldings: [],
      managerDetail: {
        name: getData('currentFundManager')?.[0]?.name || '--',
        tenure: 0, tenureReturn: 0, managedFunds: 0, totalScale: 0, style: '--',
      },
      fees: { managementFee: 0, custodyFee: 0, purchaseFee: 0, redemptionFee: 0 },
    };

    res.json(detail);
  } catch {
    res.json(generateMockFundDetail(code));
  }
});

// ===== 基金净值历史接口 =====
app.get('/api/funds/:code/nav', async (req, res) => {
  const code = req.params.code;
  const days = parseInt(req.query.days as string) || 365;
  try {
    const url = `https://fund.eastmoney.com/pingzhongdata/${code}.js`;
    const text = await httpGet(url, { Referer: `https://fund.eastmoney.com/${code}.html` });
    const match = text.match(/var Data_netWorthTrend = ([\s\S]*?);/);
    if (match) {
      const navData = eval(match[1]);
      const history = navData.slice(-days).map((item: any) => ({
        date: new Date(item.x).toISOString().slice(0, 10),
        value: item.y,
        accumulatedNav: item.fqr,
        dailyChange: item.equityReturn,
      }));
      res.json({ data: history });
    } else {
      throw new Error('No nav data');
    }
  } catch {
    // 模拟数据
    const baseNav = 1.5;
    const history = [];
    let value = baseNav;
    const now = new Date();
    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      value = value * (1 + (Math.random() - 0.48) * 0.012);
      history.push({ date: date.toISOString().slice(0, 10), value: Math.round(value * 10000) / 10000 });
    }
    res.json({ data: history });
  }
});

// ===== 市场指数接口 =====
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
    res.json({ success: true, data: indices });
  } catch {
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
    });
  }
});

// ===== 指数历史走势接口 =====
app.get('/api/market/index-history', async (req, res) => {
  const days = parseInt(req.query.days as string) || 30;
  try {
    // 上证指数日K线
    const klt = 101; // 日K
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
    res.json({ success: true, data: history });
  } catch {
    // 模拟数据
    const history = [];
    let value = 3250;
    const now = new Date();
    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      value = value * (1 + (Math.random() - 0.48) * 0.015);
      history.push({ date: date.toISOString().slice(0, 10), value: Math.round(value * 100) / 100 });
    }
    res.json({ success: true, data: history });
  }
});

// ===== 板块行情接口 =====
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
    res.json({ success: true, data: sectors });
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
    res.json({ success: true, data });
  }
});

// ===== 基准历史接口 =====
app.get('/api/benchmarks/:code/history', async (req, res) => {
  const code = req.params.code;
  const days = parseInt(req.query.days as string) || 365;
  try {
    if (code === 'category_avg') {
      // 同类平均模拟
      const history = [];
      let value = 1.0;
      const now = new Date();
      for (let i = days; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        value = value * (1 + (Math.random() - 0.49) * 0.01);
        history.push({ date: date.toISOString().slice(0, 10), value: Math.round(value * 10000) / 10000 });
      }
      res.json({ success: true, data: history });
      return;
    }
    // 指数历史
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
    res.json({ success: true, data: history });
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
    res.json({ success: true, data: history });
  }
});

// ===== 穿透分析接口 =====
app.post('/api/analysis/portfolio', (req, res) => {
  const { fundIds } = req.body;
  // 模拟穿透分析
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
    holdingsOverlap: {
      overlappedStocks,
      overlapRate: 15.2,
    },
    styleExposure: {
      marketCap: 'large',
      style: 'balanced',
      score: 65,
    },
    portfolioRisk: {
      estimatedMaxDrawdown: -18.5,
      estimatedVolatility: 22.3,
      diversificationScore: 72,
    },
  });
});

// ===== 模拟数据生成 =====
function generateMockFunds(count: number) {
  const types = ['股票型', '混合型', '债券型', '指数型', 'QDII'];
  const managers = ['张三', '李四', '王五', '赵六', '刘七'];
  const companies = ['华夏基金', '易方达', '南方基金', '博时基金', '广发基金'];
  const funds = [];
  for (let i = 0; i < count; i++) {
    const code = String(100001 + i).padStart(6, '0');
    const yearlyReturn = Math.round((Math.random() - 0.3) * 40 * 100) / 100;
    funds.push({
      id: code, code,
      name: `${companies[i % 5]}优选${i + 1}号`,
      type: types[i % types.length],
      nav: Math.round(Math.random() * 3 * 10000) / 10000,
      accumulatedNav: Math.round(Math.random() * 4 * 10000) / 10000,
      dailyChange: Math.round((Math.random() - 0.5) * 4 * 100) / 100,
      yearlyReturn,
      riskLevel: yearlyReturn > 15 ? 5 : yearlyReturn > 8 ? 4 : yearlyReturn > 0 ? 3 : 2,
      manager: managers[i % 5],
      company: companies[i % 5],
      establishDate: `20${10 + (i % 15)}-0${(i % 9) + 1}-15`,
      scale: Math.round(Math.random() * 100 * 100) / 100,
    });
  }
  return funds;
}

function generateMockFundDetail(code: string) {
  const nav = Math.round(Math.random() * 3 * 10000) / 10000;
  const yearlyReturn = Math.round((Math.random() - 0.3) * 40 * 100) / 100;
  return {
    id: code, code,
    name: `基金${code}`,
    type: '混合型',
    riskLevel: 3,
    manager: '张三',
    company: '华夏基金',
    establishDate: '2015-06-15',
    scale: 45.6,
    nav, accumulatedNav: nav * 1.2,
    dailyChange: Math.round((Math.random() - 0.5) * 4 * 100) / 100,
    yearlyReturn,
    performance: {
      month1: Math.round((Math.random() - 0.4) * 10 * 100) / 100,
      month3: Math.round((Math.random() - 0.3) * 20 * 100) / 100,
      month6: Math.round((Math.random() - 0.2) * 25 * 100) / 100,
      year1: yearlyReturn,
      year2: Math.round((Math.random() - 0.2) * 50 * 100) / 100,
      year3: Math.round((Math.random() - 0.1) * 60 * 100) / 100,
      year5: Math.round((Math.random() - 0.1) * 80 * 100) / 100,
      thisYear: Math.round((Math.random() - 0.3) * 30 * 100) / 100,
      sinceEstablish: Math.round((Math.random() - 0.1) * 200 * 100) / 100,
    },
    ranking: { month1: 120, month3: 85, year1: 45, sameTypeCount: 2000 },
    riskMetrics: {
      maxDrawdown: -Math.round(Math.random() * 30 * 100) / 100,
      volatility: Math.round(Math.random() * 25 + 5 * 100) / 100,
      sharpeRatio: Math.round(Math.random() * 3 * 100) / 100,
      alpha: Math.round((Math.random() - 0.3) * 15 * 100) / 100,
      beta: Math.round((Math.random() * 1.5 + 0.3) * 100) / 100,
      informationRatio: Math.round((Math.random() - 0.3) * 2 * 100) / 100,
    },
    assetAllocation: { stock: 75.2, bond: 15.3, cash: 8.5, other: 1.0 },
    industryAllocation: [
      { industry: '信息技术', ratio: 28.5 },
      { industry: '医药生物', ratio: 18.3 },
      { industry: '消费', ratio: 15.2 },
      { industry: '金融', ratio: 12.8 },
      { industry: '新能源', ratio: 10.5 },
      { industry: '其他', ratio: 14.7 },
    ],
    topHoldings: [
      { stockCode: '600519', stockName: '贵州茅台', ratio: 8.5, change: '不变' },
      { stockCode: '000858', stockName: '五粮液', ratio: 5.2, change: '增持' },
      { stockCode: '300750', stockName: '宁德时代', ratio: 4.8, change: '不变' },
      { stockCode: '601318', stockName: '中国平安', ratio: 4.3, change: '减持' },
      { stockCode: '000333', stockName: '美的集团', ratio: 3.9, change: '新增' },
      { stockCode: '600036', stockName: '招商银行', ratio: 3.5, change: '不变' },
      { stockCode: '603259', stockName: '药明康德', ratio: 3.2, change: '不变' },
      { stockCode: '002594', stockName: '比亚迪', ratio: 2.8, change: '增持' },
      { stockCode: '600276', stockName: '恒瑞医药', ratio: 2.5, change: '不变' },
      { stockCode: '000725', stockName: '京东方A', ratio: 2.3, change: '减持' },
    ],
    managerDetail: {
      name: '张三', tenure: 8.5, tenureReturn: 156.8,
      managedFunds: 3, totalScale: 120.5, style: '成长型',
    },
    fees: { managementFee: 1.5, custodyFee: 0.25, purchaseFee: 0.15, redemptionFee: 0.5 },
  };
}

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});
