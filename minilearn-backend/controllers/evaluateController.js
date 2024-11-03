const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();
const { db } = require('../firebaseAdmin');

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash"
});

// Farklı modüller için prompt'lar
function createPrompt(quizType, allAnswers) {
  return `
    Öğrenci, ${quizType} konusundaki quiz sorularına şu cevapları verdi:
    ${allAnswers.map((ans, index) => `Soru ${index + 1}: ${ans.question}\nCevap: ${ans.selectedOption}\nDoğru Cevap: ${ans.correctAnswer}\n`).join('\n')}
    Bu bilgilere dayanarak, öğrencinin ${quizType} konusundaki bilgi seviyesini değerlendir çözdüğü soru sayısını ve score'unu dikkate alarak bir sonraki quizi için görmesi uygun olan zorluk seviyesini öner. Sadece zorluk seviyesini belirt şu şekilde :
    "seviye": "Öğrencinin seviyesi yeni seviyesi",
  `;
}

// Modül üretme fonksiyonu
const evaluate = async (req, res) => {
  const { answers, quizType, userEmail, userName } = req.body;
  console.log("QUİZİN YAPAY ZEKA TARAFINDAN DEĞERLENDİRİLİYOR...")

  try {
    // 1. Yeni cevapları database'e userEmail ve quizType'a göre ekle
    const userRef = db.collection('userEvaluations').doc(userEmail).collection('quizzes').doc(quizType);
    
    // Mevcut quiz verilerini al
    const quizDoc = await userRef.get();
    let allAnswers = [];

    if (quizDoc.exists) {
      const quizData = quizDoc.data();
      allAnswers = quizData.answers || [];
    }

    // Yeni cevapları mevcut cevapların sonuna ekle
    allAnswers = allAnswers.concat(answers);

    // Database'i güncelle
    await userRef.set({
      userName,
      quizType,
      answers: allAnswers,
      timestamp: new Date() // Zaman damgası
    });

    // 2. Tüm cevaplarla prompt oluştur
    const prompt = createPrompt(quizType, allAnswers);

    // 3. AI modeli çalıştır ve sonuçları al
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const match = text.match(/seviye:\s*"?(\w+)"?/);
    const analysis = match ? match[1] : "Başlangıç Seviyesi"
    console.log("ANALİZ SONUCU : " , analysis)
    
    // 4. AI tarafından üretilen analizi database'e ekle
    await userRef.update({
      analysis
    });

    console.log("Database'e eklendi.");
    res.json({ content: analysis });

  } catch (error) {
    console.error('Error generating module:', error.message);
    res.status(500).json({ error: 'Failed to generate module' });
  }
};

module.exports = { evaluate };
