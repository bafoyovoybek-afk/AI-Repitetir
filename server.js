// AI-Repetitor backend server
// Bu server frontend (index.html) o'rniga Anthropic API bilan gaplashadi,
// shunda API kalitingiz brauzerda emas, faqat serverda saqlanadi.

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors()); // Kerak bo'lsa domeningizga cheklang, pastdagi izohga qarang
app.use(express.json());

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = 'claude-sonnet-4-6';

if (!ANTHROPIC_API_KEY) {
  console.error('XATOLIK: ANTHROPIC_API_KEY muhit o\'zgaruvchisi topilmadi!');
  console.error('Uni server ishga tushirishdan oldin o\'rnating (.env fayl yoki hosting sozlamalarida).');
}

app.post('/api/chat', async (req, res) => {
  try {
    const { system, input } = req.body;
    if (!input || typeof input !== 'string') {
      return res.status(400).json({ error: { message: "'input' maydoni kerak" } });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 4096,
        system: system || '',
        messages: [{ role: 'user', content: input }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Anthropic API xatosi:', data);
      return res.status(response.status).json({ error: data.error || { message: 'Anthropic API xatosi' } });
    }

    const textBlock = (data.content || []).find(c => c.type === 'text');
    return res.json({ text: textBlock ? textBlock.text : '' });

  } catch (err) {
    console.error('Server xatosi:', err);
    return res.status(500).json({ error: { message: err.message || 'Ichki server xatosi' } });
  }
});

// Frontend fayllarini xizmat qilish (index.html shu papkada bo'lsa)
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server ${PORT}-portda ishga tushdi`);
});
