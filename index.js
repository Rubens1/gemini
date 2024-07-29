const express = require('express');
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const cors = require('cors');

const genAI = new GoogleGenerativeAI("CHAVE_GEMINI");
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

const mainGoogle = async (texto) => {
  try {
    const userMessage = { role: "user", parts: [{ text: texto }] };
    const modelResponse = { role: "model", parts: [{ text: "Olá, certo!" }] };
    
    const chat = model.startChat({
      history: [userMessage, modelResponse],
      generationConfig: {
        maxOutputTokens: 100,
      },
    });

    const result = await chat.sendMessage(texto);
    const response = await result.response;
    const text = response.text();

    return text;
    
  } catch (error) {
    console.error("Erro ao iniciar a conversa com a AI:", error);
    throw error;
  }
};

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post('/check-ai', async (req, res) => {
  try {
    const responseFromAI = await mainGoogle(req.body.texto);

    if (responseFromAI) {
      console.log(responseFromAI);
      res.status(200).json({ success: true, message: responseFromAI });
    } else {
      console.error('Falha ao receber resposta da AI.');
      res.status(500).json({ success: false, error: 'Falha ao receber resposta da AI.' });
    }
  } catch (error) {
    console.error('Error ao verificar AI:', error);
    res.status(500).json({ success: false, error: 'Error ao verificar AI.', detailedError: error });
  }
});


app.listen(PORT, () => {
  console.log(`Servidor escutando na porta ${PORT}`);
});
