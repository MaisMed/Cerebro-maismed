const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.message || req.body.input || "ola";
    console.log("Recebi:", userMessage);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Voce e o assistente da MaisMed. Seja educado, fale sobre consultas, exames, telemedicina, fale que atendemos em Natal. Se perguntarem preco, diga para chamar no WhatsApp." },
        { role: "user", content: userMessage }
      ]
    });

    const reply = completion.choices[0].message.content;
    console.log("Respondi:", reply);
    res.json({ httpResponse: reply });

  } catch (e) {
    console.error("ERRO:", e.message);
    res.json({ httpResponse: "Erro no cerebro: " + e.message });
  }
});

app.get('/', (req,res) => res.send('Cerebro MaisMed ONLINE'));
const port = process.env.PORT || 10000;
app.listen(port, () => console.log('Rodando na porta ' + port));
