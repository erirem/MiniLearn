const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash"});

// Farklı modüller için prompt'lar
const prompts = {
  ai: `Yapay zeka öğrenmeye yeni başlamış biri için detaylı bir eğitim modül oluştur. Bu modülü, kısa sayfalara ayır kart yapmak için. Kart başlığından itibaren kar içeriğinin sonuna "<>" içine yaz`, 

  math: `Matematiği öğrenmeye yeni başlamış biri için detaylı bir eğitim modül oluştur. Bu modülü, kısa sayfalara ayır kart yapmak için.`,

  history: `Türk tarihini öğrenmeye yeni başlamış biri için detaylı bir eğitim modül oluştur. Bu modülü, kısa sayfalara ayır kart yapmak için.`
};

// Modül üretme fonksiyonu
const generateModule = async (req, res) => {
  const { moduleType } = req.body; // Modül tipini frontend'den alıyoruz

  const prompt = prompts[moduleType]; // Modül tipine göre prompt seçiyoruz

  if (!prompt) {
    return res.status(400).json({ error: 'Invalid module type.' }); // Geçersiz modül tipi
  }

  try {
    const result = await model.generateContent(prompt);
    const deneme = { content: result.response.text() }
    console.log(deneme.content)   

    res.json({content: result.response.text()});
  } catch (error) {
    console.error('Error generating module:', error.message);
    res.status(500).json({ error: 'Failed to generate module' });
  }
};

module.exports = { generateModule };
