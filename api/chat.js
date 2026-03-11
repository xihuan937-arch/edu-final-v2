module.exports = async function handler(req, res) {
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

if (req.method === 'OPTIONS') return res.status(200).end();
if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

const key = process.env.DEEPSEEK_KEY;
if (!key) return res.status(500).json({ error: '未检测到 Key，请在 Vercel 配置 DEEPSEEK_KEY' });

const messages = req.body?.messages;
if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: '参数错误' });

try {
const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), 30000);

} catch (e) {
if (e.name === 'AbortError') return res.status(504).json({ error: '生成超时' });
return res.status(500).json({ error: '服务器错误：' + e.message });
}
};
