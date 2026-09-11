const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/chat', async (req, res) => {
  try {
    // Aceita mensagem em PT ou EN
    const userMessage = req.body.mensagem || req.body.message || req.body.input || "ola";
    console.log("Recebi:", userMessage, req.body);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Voce e o atendente da MaisMed em Natal. Seja simpatico, curto, fale de consultas, exames e telemedicina. Se perguntar preco, diga para falar com atendente humano." },
        { role: "user", content: userMessage }
      ]
    });

    const reply = completion.choices[0].message.content;
    console.log("Resposta:", reply);

    // Retorna no formato que o AtendeZape entende
    res.json({
      httpResponse: reply,
      resposta: reply,
      reply: reply
    });

  } catch (e) {
    console.error("ERRO OPENAI:", e.message);
    res.json({ httpResponse: "Erro: " + e.message + " - Verifique se tem credito na OpenAI" });
  }
});

app.get('/', (req,res) => res.send('Cerebro MaisMed ONLINE - use POST /chat'));
const port = process.env.PORT || 10000;
app.listen(port, () => console.log('Rodando ' + port));
