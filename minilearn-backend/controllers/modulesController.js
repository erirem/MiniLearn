const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash"});

// Farklı modüller için prompt'lar
function createPrompt(konu, zorluk) {
  return `{
    "konu": "${konu}",
    "zorluk": "${zorluk}",
    "talimat": "Bu konu ve zorluk seviyesine uygun eğitici bir modül oluştur. İçerik, belirtilen zorluk seviyesindeki kullanıcılar için anlaşılır ve kolay olmalı. Yalnızca aşağıdaki yapıyı kesin olarak takip eden bir JSON nesnesiyle yanıt ver:
    {
      "title": "Modül başlığı",
      "description": "Kapsanacak konuların kısa bir özeti",
      "sections": [
        {
          "id": number,
          "title": "Bölüm başlığı",
          "content": "Ana içerik metni (kısa tut, yaklaşık 150 kelime)",
          "keyPoints": ["Anahtar kavram 1", "Anahtar kavram 2"]
        }
      ]
    }
    
    Gereksinimler:
    1. Yalnızca geçerli bir JSON ile yanıt ver
    2. JSON dışında hiçbir metin ekleme
    3. Her bölümün içeriğini kısa ve odaklanmış tut
    4. Belirtilen zorluk seviyesine uygun basit bir dil kullan
    5. Her bölüm için 2-3 anahtar nokta ekle
    6. Konuyu düzgün kapsamak için 4-5 bölüm oluştur
  }`
}

// Modül üretme fonksiyonu
const generateModule = async (req, res) => {
  
  const { moduleType } = req.body; // Modül tipini frontend'den alıyoruz

  const prompt = createPrompt(moduleType, 'Başlangıç seviyesi')// Modül tipine göre prompt seçiyoruz

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
