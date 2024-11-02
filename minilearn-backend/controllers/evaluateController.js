const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();
const { db } = require('../firebaseAdmin');


const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash"});

// Farklı modüller için prompt'lar
function createPrompt(quizType, answers) {
  return `
    Öğrenci, ${quizType} konusundaki quiz sorularına şu cevapları verdi:
    ${answers.map((ans, index) => `Soru ${index + 1}: ${ans.question}\nCevap: ${ans.selectedOption}\nDoğru Cevap: ${ans.correctAnswer}\n`).join('\n')}
    Bu bilgilere dayanarak, öğrencinin ${quizType} konusundaki bilgi seviyesini değerlendir ve uygun zorluk seviyesini öner bir sonraki quizi için. Sadece zorluk seviyesini belirt şu şekilde :
    "seviye": "Öğrencinin seviyesi",
  `
}

// Modül üretme fonksiyonu
const evaluate = async (req, res) => {
    
  const { answers, quizType, score, userEmail, userName} = req.body;
  
  const prompt = createPrompt(quizType, answers)// Modül tipine göre prompt seçiyoruz

  if (!prompt) {
    return res.status(400).json({ error: 'Invalid module type.' }); // Geçersiz modül tipi
  }

  try {
    const result = await model.generateContent(prompt);
    const analysis = { content: result.response.text() }
    console.log(analysis.content)   

    await db.collection('userEvaluations').doc(userEmail).set({
        userName,
        quizType,
        answers,
        analysis,
        score,
        timestamp: new Date() // Zaman damgası
      });
      console.log("Database'e eklendi.")

    res.json({content: analysis});
  } catch (error) {
    console.error('Error generating module:', error.message);
    res.status(500).json({ error: 'Failed to generate module' });
  }
};

module.exports = { evaluate };
