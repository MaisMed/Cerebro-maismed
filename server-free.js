const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.mensagem || req.body.message || req.body.input || "ola";
    console.log("Recebi:", userMessage);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + process.env.OPENAI_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Voce e atendente da MaisMed em Natal. Seja curto, simpatico, fale de consultas, exames e telemedicina. Preco: fale para chamar humano." },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();
    console.log("OpenAI respondeu:", JSON.stringify(data).slice(0, 200));

    if (data.error) {
      throw new Error(data.error.message);
    }

    const reply = data.choices[0].message.content;
    res.json({ httpResponse: reply, resposta: reply });

  } catch (e) {
    console.error("ERRO:", e.message);
    res.json({ httpResponse: "Desculpe, erro no cerebro: " + e.message });
  }
});

app.get('/', (req,res) => res.send('Cerebro MaisMed ONLINE'));
const port = process.env.PORT || 10000;
app.listen(port, () => console.log('Rodando porta ' + port));
