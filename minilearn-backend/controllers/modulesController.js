const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const schema = {
  "type": "array",
  "items": { // "modules" yerine "items" kullanıyoruz
    "type": "object",
    "properties": {
      "title": {"type": "string"},
      "content": {"type": "string"}
    },
    "required": ["title", "content"] 
  }
};

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: schema,
  },
});

// Farklı modüller için prompt'lar
const prompts = {
  ai: `Yapay zeka hakkında detaylı bir modül oluştur. Bu modülü, kullanıcıların önyüzde kısa kısa okuyarak öğrenebileceği şekilde küçük bölümlere ayır. Her bölümde bir konu başlığı ve en fazla 100 kelimelik bir açıklama olmalı. Aşağıdaki konuları kapsamalı:

Yapay zekanın tanımı
Yapay zeka türleri (örneğin, makine öğrenmesi, derin öğrenme, doğal dil işleme, bilgisayar görüşü)
Yapay zeka uygulamaları (örneğin, sağlık, otomotiv, finans, eğitim)
Yapay zekanın etik hususları (örneğin, işsizlik, önyargı, gizlilik, güvenlik, sorumluluk)`, 

  math: `Write a detailed module about calculus, including:
  * A definition of calculus
  * Differentiation and Integration concepts
  * Applications of calculus in real life
  * A short quiz with 5 questions`,

  history: `Write a detailed module about the history of ancient Egypt, including:
  * Key events in Egyptian history
  * Famous pharaohs
  * Importance of the pyramids
  * A quiz with 5 multiple-choice questions`
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
    console.log("Generated Content:", result.response.text());

    res.json({ content: result.response.text() });
  } catch (error) {
    console.error('Error generating module:', error.message);
    res.status(500).json({ error: 'Failed to generate module' });
  }
};

module.exports = { generateModule };
