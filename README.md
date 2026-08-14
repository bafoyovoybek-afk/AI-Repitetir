# AI-Repetitor — Backend bilan ishga tushirish

Bu papkada saytingizni **to'liq mustaqil holda** (Claude.ai tashqarisida) ishlatish uchun kerak bo'lgan hamma narsa bor.

## Tuzilishi
```
backend/
  server.js          ← Anthropic API bilan gaplashadigan server
  package.json       ← kerakli kutubxonalar
  .env.example        ← API kalitini yozish namunasi
  public/
    index.html        ← saytingiz (frontend)
```

## 1-qadam: API kalit oling
1. https://console.anthropic.com ga kiring
2. "API Keys" bo'limidan yangi kalit yarating
3. Kalitni nusxalab oling (sk-ant- bilan boshlanadi)

## 2-qadam: Kompyuteringizda sinab ko'rish

```bash
cd backend
npm install
cp .env.example .env
# .env faylni oching va ANTHROPIC_API_KEY qatoriga o'z kalitingizni qo'ying
npm start
```

So'ng brauzerda `http://localhost:3000` manzilini oching — sayt ochiladi va AI-chat ishlaydi.

## 3-qadam: Internetga joylashtirish (deploy)

Serverni bepul joylashtirish uchun quyidagilardan birini tanlang:

### Railway.app (eng oson)
1. https://railway.app ga GitHub orqali kiring
2. "New Project" → "Deploy from GitHub repo" (avval bu papkani GitHub'ga yuklang)
3. "Variables" bo'limida `ANTHROPIC_API_KEY` ni qo'shing
4. Railway avtomatik joylashtiradi va sizga havola beradi

### Render.com
1. https://render.com da "New Web Service" yarating
2. GitHub repo'ni ulang
3. Build command: `npm install`, Start command: `npm start`
4. "Environment" bo'limida `ANTHROPIC_API_KEY` ni qo'shing

### O'zingizning VPS/serveringiz
```bash
npm install -g pm2
cd backend
npm install
ANTHROPIC_API_KEY=sk-ant-... pm2 start server.js --name ai-repetitor
```

## Muhim eslatmalar
- **API kalitingizni hech qachon** `index.html` yoki GitHub'ga ochiq holda joylamang — u faqat serverdagi `.env` faylida yoki hosting sozlamalarida bo'lishi kerak.
- Agar frontend va backend turli domenlarda bo'lsa (masalan sayt `mysite.com`da, server `api.mysite.com`da), `index.html` faylidagi `BACKEND_URL` qatorini to'liq manzilga o'zgartiring:
  ```js
  const BACKEND_URL = 'https://api.mysite.com/api/chat';
  ```
- `server.js` ichidagi `cors()` — hozircha barcha domenlarga ruxsat beradi. Xavfsizlik uchun productionda uni faqat o'z domeningizga cheklashingiz mumkin:
  ```js
  app.use(cors({ origin: 'https://mysite.com' }));
  ```
