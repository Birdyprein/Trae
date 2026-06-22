import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.API_PORT || 3001;

// ============ 基金搜索 ============
// 数据来源: 东方财富基金搜索
app.get('/api/funds/search', async (req, res) => {
  try {
    const keyword = (req.query.keyword as string) || '';
    const url = `https://fundsuggest.eastmoney.com/FundSearch/api/FundSearchAPI.ashx?m=9&key=${encodeURIComponent(keyword)}`;
    const resp = await fetch(url, {
      headers: { Referer: 'https://fund.eastmoney.com/' },
    });
    const text = await resp.text();
    // 东方财富返回 JSONP 格式: var datas = [...]; 或直接 JSON
    const jsonStr = text.replace(/^var\s+datas\s*=\s*/, '').replace(/;$/, '');
    const data = JSON.parse(jsonStr);
    const funds = (data.Datas || []).map((d: any) => ({
      code: d.CODE,
      name: d.NAME,
      type: d.FundType || typeMap[d.TYPE] || '混合型',
    }));
    res.json({ success: true, data: funds });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const typeMap: Record<string, string> = {
  '股票型': '股票型', '混合型': '混合型', '债券型': '债券型',
  '货币型': '货币型', '指数型': '指数型', 'QDII': '混合型',
  'ETF': '指数型', 'LOF': '混合型', 'FOF': '混合型',
};

// ============ 基金列表（热门基金） ============
// 数据来源: 东方财富基金排行
app.get('/api/funds/list', async (_req, res) => {
  try {
    const types = ['gp', 'hh', 'zq', 'zs'];
    const labels = ['股票型', '混合型', '债券型', '指数型'];
    const allFunds: any[] = [];

    for (let i = 0; i < types.length; i++) {
      const url = `https://fund.eastmoney.com/data/rankhandler.aspx?op=ph&dt=kf&ft=${types[i]}&rs=&gs=0&sc=1nzf&st=desc&sd=2024-01-01&ed=2025-12-31&qdii=&tabSubtype=,,,,,&pi=1&pn=6&dx=1`;
      const resp = await fetch(url, {
        headers: { Referer: 'https://fund.eastmoney.com/' },
      });
      const text = await resp.text();
      const jsonStr = text.replace(/^var\s+rankJson\s*=\s*/, '').replace(/;$/, '');
      const data = JSON.parse(jsonStr);
      const funds = (data.Datas || []).map((d: string) => {
        const parts = d.split(',');
        return {
          code: parts[0],
          name: parts[1],
          type: labels[i],
          nav: parseFloat(parts[3]) || 0,
          accumulatedNav: parseFloat(parts[4]) || 0,
          dailyChange: parseFloat(parts[5]) || 0,
          yearlyReturn: parseFloat(parts[12]) || 0,
        };
      });
      allFunds.push(...funds);
    }

    res.json({ success: true, data: allFunds });
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
    const resp = await fetch(url, {
      headers: { Referer: 'https://fund.eastmoney.com/' },
    });
    const text = await resp.text();
    // JSONP: jsonpgz({...});
    const jsonStr = text.replace(/^jsonpgz\(/, '').replace(/\);$/, '');
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
// 数据来源: 东方财富基金净值
app.get('/api/funds/:code/nav', async (req, res) => {
  try {
    const { code } = req.params;
    const pageSize = parseInt(req.query.pageSize as string) || 60;
    const url = `https://api.fund.eastmoney.com/f10/lsjz?fundCode=${code}&pageIndex=1&pageSize=${pageSize}`;
    const resp = await fetch(url, {
      headers: {
        Referer: 'https://fundf10.eastmoney.com/',
        'User-Agent': 'Mozilla/5.0',
      },
    });
    const data: any = await resp.json();
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
// 数据来源: 东方财富行情
app.get('/api/market/indices', async (_req, res) => {
  try {
    const url = 'https://push2.eastmoney.com/api/qt/ulist.np/get?fltt=2&fields=f2,f3,f4,f12,f14&secids=1.000001,100.HSI,100.NDX';
    const resp = await fetch(url, {
      headers: { Referer: 'https://quote.eastmoney.com/' },
    });
    const data: any = await resp.json();
    const indices = (data.data?.diff || []).map((d: any) => ({
      code: d.f12,
      name: d.f14,
      value: d.f2 || 0,
      change: d.f3 || 0,
      changePercent: d.f4 || 0,
    }));
    res.json({ success: true, data: indices });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});