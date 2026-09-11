const express = require('express');
const app = express();
app.use(express.json());
const PROMPT_MAISMED = `Voce e o assistente da MaisMed. Telemedicina 24h/7 dias SEM limite. Nao e plano de saude nem seguro de vida. Beneficios funeral R$5000 e morte acidental R$30000 com carencia 90 dias. Consulta imediata apos pagamento. Planos: Individual R$49,90 Link https://app.maismeds.com.br/create-sale/individual/9acda4e3-9d15-41c9-81c3-5b89a1d6c734 Familiar R$89,90 ate 4 pessoas extra R$25,90 Link https://app.maismeds.com.br/create-sale/familiar/256d045b-af78-4ab9-b3df-2cb96bf810d8 Empresarial ate 50 func R$35 51-100 R$28,90 acima 100 R$25,90 Contato Alan (84)99963-2794 Se nao souber diga: Nesse momento ainda nao tenho essa informacao, mais irei transferir vc para um de nossos consultores, so um instante por gentileza!`;
const LINKS = { individual: "https://app.maismeds.com.br/create-sale/individual/9acda4e3-9d15-41c9-81c3-5b89a1d6c734", familiar: "https://app.maismeds.com.br/create-sale/familiar/256d045b-af78-4ab9-b3df-2cb96bf810d8", empresarial_contato: "Alan Michael - (84)99963-2794" };
app.get('/', (req, res) => { res.send('Cerebro MaisMed no ar! Use POST /webhook'); });
app.post('/webhook', async (req, res) => {
  const mensagemCliente = req.body.message || req.body.text || req.body.body || JSON.stringify(req.body);
  let resposta = gerarRespostaInteligente(mensagemCliente);
  const precisaTransferir = resposta.includes('transferir vc para um de nossos consultores');
  return res.json({ reply: resposta, transfer_to_human: precisaTransferir, status: "ok" });
});
function gerarRespostaInteligente(msg) {
  const lower = msg.toLowerCase();
  if (lower.includes('valor') || lower.includes('preco') || lower.includes('plano') || lower.includes('quanto custa')) {
    return `Claro! Na MaisMed voce nao paga por consulta, paga so a mensalidade e usa a vontade, 24h por dia\n\n- Individual: R$49,90/mes\n- Familiar: R$89,90/mes ate 4 pessoas (extra R$25,90 cada)\n- Empresarial: a partir de R$25,90 por funcionario\n\nClinico geral 24h libera na hora apos pagamento. Auxilio funeral ate R$5.000 e R$30.000 por morte acidental tem 90 dias de carencia.\n\nQual te interessa?\nIndividual: ${LINKS.individual}\nFamiliar: ${LINKS.familiar}\nEmpresarial: falar com Alan ${LINKS.empresarial_contato}`;
  }
  if (lower.includes('empresarial') || lower.includes('empresa')) {
    return `Para plano empresarial:\nAte 50 funcionarios: R$35,00 cada\n51 a 100: R$28,90 cada\nAcima de 100: R$25,90 cada\n\nFala com Alan Michael: ${LINKS.empresarial_contato}`;
  }
  return `Ola! Sou assistente da MaisMed. Temos telemedicina 24h sem limite por R$49,90/mes. Como posso ajudar?`;
}
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Cerebro rodando porta ${PORT}`));
