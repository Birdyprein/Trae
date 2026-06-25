import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.API_PORT || 3001;

// 通用 fetch 封装
async function httpGet(url: string, headers: Record<string, string> = {}): Promise<string> {
  const resp = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      ...headers,
    },
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  return resp.text();
}

// 全部基金代码缓存
let allFundsCache: Array<{ code: string; name: string; type: string; pinyin: string }> | null = null;
let cacheTime = 0;
const CACHE_TTL = 6 * 60 * 60 * 1000; // 6小时缓存

async function getAllFunds(): Promise<typeof allFundsCache> {
  const now = Date.now();
  if (allFundsCache && now - cacheTime < CACHE_TTL) return allFundsCache;

  const url = 'http://fund.eastmoney.com/js/fundcode_search.js';
  const text = await httpGet(url, { Referer: 'https://fund.eastmoney.com/' });
  const jsonStr = text.replace(/^var\s+r\s*=\s*/, '').replace(/;\s*$/, '');
  const arr = JSON.parse(jsonStr);
  // 格式: [代码, 拼音首字母, 名称, 类型, 拼音全拼]
  allFundsCache = arr.map((item: string[]) => ({
    code: item[0],
    name: item[2],
    type: item[3].split('-')[0], // 取大类
    pinyin: item[4],
  }));
  cacheTime = now;
  return allFundsCache;
}

// 类型映射
const TYPE_MAP: Record<string, string> = {
  '股票型': 'gp',
  '混合型': 'hh',
  '债券型': 'zq',
  '指数型': 'zs',
  '货币型': 'hb',
  'QDII': 'qdii',
  'FOF': 'fof',
};
const TYPE_LABELS: Record<string, string> = {
  gp: '股票型',
  hh: '混合型',
  zq: '债券型',
  zs: '指数型',
  hb: '货币型',
  qdii: 'QDII',
  fof: 'FOF',
};

// ============ 基金搜索 ============
// 数据来源: 天天基金 (东方财富)
app.get('/api/funds/search', async (req, res) => {
  try {
    const keyword = (req.query.keyword as string) || '';
    const url = `https://fundsuggest.eastmoney.com/FundSearch/api/FundSearchAPI.ashx?m=9&key=${encodeURIComponent(keyword)}`;
    const text = await httpGet(url, { Referer: 'https://fund.eastmoney.com/' });
    const jsonStr = text.replace(/^var\s+datas\s*=\s*/, '').replace(/;\s*$/, '');
    const data = JSON.parse(jsonStr);
    const funds = (data.Datas || []).map((d: any) => ({
      code: d.CODE,
      name: d.NAME,
      type: d.FundType || '混合型',
    }));
    res.json({ success: true, data: funds });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ============ 基金列表（服务端分页） ============
// 数据来源: 天天基金排行
app.get('/api/funds/list', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 50;
    const type = (req.query.type as string) || 'all';
    const sortField = (req.query.sort as string) || '1nzf';
    const sortDir = (req.query.dir as string) || 'desc';

    const st = sortDir === 'desc' ? 'desc' : 'asc';

    if (type === 'all') {
      // 全类型：从多个类型中获取并合并
      const types = ['gp', 'hh', 'zq', 'zs'];
      const labels = ['股票型', '混合型', '债券型', '指数型'];
      const allFunds: any[] = [];
      const perTypeCount = 500;

      for (let i = 0; i < types.length; i++) {
        const url = `https://fund.eastmoney.com/data/rankhandler.aspx?op=ph&dt=kf&ft=${types[i]}&rs=&gs=0&sc=${sortField}&st=${st}&sd=2024-01-01&ed=2025-12-31&qdii=&tabSubtype=,,,,,&pi=1&pn=${perTypeCount}&dx=1`;
        const text = await httpGet(url, { Referer: 'https://fund.eastmoney.com/' });
        const jsonStr = text
          .replace(/^var\s+rankData\s*=\s*/, '')
          .replace(/;\s*$/, '')
          .replace(/([{,]\s*)([a-zA-Z_]\w*)(\s*:)/g, '$1"$2"$3');
        const data = JSON.parse(jsonStr);
        const funds = (data.datas || []).map((d: string) => parseRankItem(d, labels[i]));
        allFunds.push(...funds);
      }

      // 全类型合并后排序
      allFunds.sort((a, b) => {
        const diff = b.yearlyReturn - a.yearlyReturn;
        return sortDir === 'desc' ? diff : -diff;
      });

      const total = allFunds.length;
      const start = (page - 1) * pageSize;
      const paged = allFunds.slice(start, start + pageSize);

      res.json({ success: true, data: paged, total, page, pageSize });
    } else {
      // 单类型
      const typeCode = TYPE_MAP[type] || type;
      const label = TYPE_LABELS[typeCode] || type;
      const url = `https://fund.eastmoney.com/data/rankhandler.aspx?op=ph&dt=kf&ft=${typeCode}&rs=&gs=0&sc=${sortField}&st=${st}&sd=2024-01-01&ed=2025-12-31&qdii=&tabSubtype=,,,,,&pi=${page}&pn=${pageSize}&dx=1`;
      const text = await httpGet(url, { Referer: 'https://fund.eastmoney.com/' });
      const jsonStr = text
        .replace(/^var\s+rankData\s*=\s*/, '')
        .replace(/;\s*$/, '')
        .replace(/([{,]\s*)([a-zA-Z_]\w*)(\s*:)/g, '$1"$2"$3');
      const data = JSON.parse(jsonStr);
      const funds = (data.datas || []).map((d: string) => parseRankItem(d, label));
      const total = parseInt(data.allNum) || funds.length;

      res.json({ success: true, data: funds, total, page, pageSize });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

function parseRankItem(d: string, typeLabel: string) {
  const parts = d.split(',');
  return {
    code: parts[0],
    name: parts[1],
    type: typeLabel,
    nav: parseFloat(parts[4]) || 0,
    accumulatedNav: parseFloat(parts[5]) || 0,
    dailyChange: parseFloat(parts[6]) || 0,
    month1: parseFloat(parts[8]) || 0,
    month3: parseFloat(parts[9]) || 0,
    month6: parseFloat(parts[10]) || 0,
    yearlyReturn: parseFloat(parts[11]) || 0,
    year2: parseFloat(parts[12]) || 0,
    year3: parseFloat(parts[13]) || 0,
  };
}

// ============ 全部基金统计 ============
app.get('/api/funds/stats', async (_req, res) => {
  try {
    const allFunds = await getAllFunds();
    const typeCount: Record<string, number> = {};
    for (const f of allFunds || []) {
      typeCount[f.type] = (typeCount[f.type] || 0) + 1;
    }
    res.json({
      success: true,
      data: {
        total: allFunds?.length || 0,
        byType: typeCount,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ============ 全部基金搜索（模糊搜索） ============
app.get('/api/funds/search-all', async (req, res) => {
  try {
    const keyword = ((req.query.keyword as string) || '').toLowerCase();
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;
    const allFunds = await getAllFunds();

    let filtered = allFunds || [];
    if (keyword) {
      filtered = filtered.filter(
        (f) =>
          f.name.toLowerCase().includes(keyword) ||
          f.code.includes(keyword) ||
          f.pinyin.toLowerCase().includes(keyword)
      );
    }

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const paged = filtered.slice(start, start + pageSize);

    res.json({ success: true, data: paged, total, page, pageSize });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ============ 基金详情 ============
// 数据来源: 天天基金实时估值
app.get('/api/funds/:code/detail', async (req, res) => {
  try {
    const { code } = req.params;
    const url = `https://fundgz.1234567.com.cn/js/${code}.js`;
    const text = await httpGet(url, { Referer: 'https://fund.eastmoney.com/' });
    const jsonStr = text.replace(/^jsonpgz\(/, '').replace(/\);?\s*$/, '');
    const data = JSON.parse(jsonStr);
    res.json({
      success: true,
      data: {
        code: data.fundcode,
        name: data.name,
        type: data.jzrq ? '混合型' : '未知',
        nav: parseFloat(data.dwjz) || 0,
        accumulatedNav: 0,
        dailyChange: parseFloat(data.gszzl) || 0,
        estimatedNav: parseFloat(data.gsz) || 0,
        estimatedTime: data.gztime || '',
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ============ 基金净值历史 ============
// 数据来源: 天天基金
app.get('/api/funds/:code/nav', async (req, res) => {
  try {
    const { code } = req.params;
    const pageSize = parseInt(req.query.pageSize as string) || 60;
    const url = `https://api.fund.eastmoney.com/f10/lsjz?fundCode=${code}&pageIndex=1&pageSize=${pageSize}`;
    const text = await httpGet(url, {
      Referer: 'https://fundf10.eastmoney.com/',
    });
    const data = JSON.parse(text);
    const list = (data.Data?.LSJZList || []).map((d: any) => ({
      date: d.FSRQ,
      value: parseFloat(d.DWJZ) || 0,
      accumulatedValue: parseFloat(d.LJJZ) || 0,
      dailyChange: d.JZZZL || '0',
    }));
    res.json({ success: true, data: list.reverse() });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ============ 市场指数 ============
// 数据来源: 新浪财经
app.get('/api/market/indices', async (_req, res) => {
  try {
    const url = 'https://hq.sinajs.cn/list=sh000001,rt_hkHSI,int_nasdaq';
    const text = await httpGet(url, { Referer: 'https://finance.sina.com.cn/' });
    const lines = text.trim().split('\n');
    const result: any[] = [];

    for (const line of lines) {
      const match = line.match(/"(.*)"/);
      if (!match) continue;
      const parts = match[1].split(',');
      if (parts.length < 4) continue;

      if (line.includes('sh000001')) {
        // 上证: 名称,当前价,昨收,今开,最高,最低,...
        const current = parseFloat(parts[1]) || 0;
        const prevClose = parseFloat(parts[2]) || 0;
        const change = current - prevClose;
        const changePercent = prevClose ? (change / prevClose) * 100 : 0;
        result.push({
          name: '上证指数',
          code: '000001.SH',
          value: current,
          change: Math.round(change * 100) / 100,
          changePercent: Math.round(changePercent * 100) / 100,
        });
      } else if (line.includes('rt_hkHSI')) {
        // 恒生: 代码,名称,当前价,昨收,今开,最低,最高,涨跌额,涨跌幅,...
        const current = parseFloat(parts[2]) || 0;
        const change = parseFloat(parts[7]) || 0;
        const changePercent = parseFloat(parts[8]) || 0;
        result.push({
          name: '恒生指数',
          code: 'HSI',
          value: current,
          change,
          changePercent,
        });
      } else if (line.includes('int_nasdaq')) {
        // 纳斯达克: 名称,当前价,涨跌额,涨跌幅,...
        const current = parseFloat(parts[1]) || 0;
        const change = parseFloat(parts[2]) || 0;
        const changePercent = parseFloat(parts[3]) || 0;
        result.push({
          name: '纳斯达克',
          code: 'NDX',
          value: current,
          change,
          changePercent,
        });
      }
    }

    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});