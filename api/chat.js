// Node 18 内置 fetch，无需任何依赖
// ⚠️ 把 YOUR_KEY_HERE 替换成你的 DeepSeek API Key

const DEEPSEEK_KEY = 'sk-4bd3837a6afe4d6aab671116523fb81c';

module.exports = async function handler(req, res) {
  // 跨域头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: '方法不允许' });

  // 取 Key（优先环境变量，其次代码内置）
  const key = process.env.DEEPSEEK_KEY || sk-4bd3837a6afe4d6aab671116523fb81c;
  if (!key || key === 'sk-4bd3837a6afe4d6aab671116523fb81c') {
    return res.status(500).json({ error: '请配置 DeepSeek API Key' });
  }

  // Vercel 自动解析 JSON body
  const messages = req.body?.messages;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: '参数错误' });
  }

  try {
    // 30秒超时
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30000);

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + key
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        max_tokens: 800,
        temperature: 0.7,
        messages
      }),
      signal: controller.signal
    });

    clearTimeout(timer);

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || '请求失败，状态码：' + response.status
      });
    }

    return res.status(200).json({
      text: data.choices?.[0]?.message?.content || ''
    });

  } catch (e) {
    if (e.name === 'AbortError') {
      return res.status(504).json({ error: '⏱ 生成超时，请重试' });
    }
    return res.status(500).json({ error: '服务器错误：' + e.message });
  }
};
