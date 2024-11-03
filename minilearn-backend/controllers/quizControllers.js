const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const { db } = require('../firebaseAdmin');

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash"});

  async function fetchDifficulty(userEmail, quizType) {
    try {
      console.log("FETCHING DIFFICULTY...")
      const userRef = db.collection('userEvaluations').doc(userEmail).collection('quizzes').doc(quizType);
      const quizDoc = await userRef.get();
      
      if (quizDoc.exists) {
        console.log("QUIZDOC EXIST AND EXTRACTING DIFFICULTY...")
        const quizData = quizDoc.data();
        const analysis = quizData.analysis || 'Başlangıç Seviyesi';
        return analysis;
      }
      console.log("QUIZDOC CAN'T FIND...")
      return 'başlangıç seviyesi'; // Return default if document does not exist
    } catch (error) {
      console.error('Error fetching difficulty from database:', error);
      return 'başlangıç seviyesi'; // Return default on error
    }
  }
  

// Farklı modüller için prompt'lar
function createPrompt(konu, zorluk) {
  return `{
    "konu": "${konu}",
    "zorluk": "${zorluk}",
    "talimat": "Bu konu ve zorluk seviyesine uygun kısa bir quiz oluştur. Quiz, belirtilen zorluk seviyesindeki kullanıcılar için anlaşılır ve kolay olmalı. Yalnızca aşağıdaki yapıyı kesin olarak takip eden bir JSON nesnesiyle yanıt ver:
    {
        \"title\": \"Quiz başlığı\",
        \"description\": \"Quizin kapsayacağı konuların kısa bir özeti\",
        \"questions\": [
        {
            \"id\": number,
            \"question\": \"Soru metni (kısa ve net olmalı)\",
            \"options\": [\"Şık 1\", \"Şık 2\", \"Şık 3\", \"Şık 4\"],
            \"answer\": \"Doğru şık\"
        }
        ]
    }

    Gereksinimler:
    1. Yalnızca geçerli bir JSON ile yanıt ver
    2. JSON dışında hiçbir metin ekleme
    3. Her soruyu kısa ve anlaşılır tut
    4. Belirtilen zorluk seviyesine uygun basit bir dil kullan
    5. Her soru için 4 şık ekle ve bir doğru cevap belirt
    6. Konuyu düzgün kapsamak için 4-5 soru oluştur
  }`
}

// Modül üretme fonksiyonu
const generateQuiz = async (req, res) => {
  console.log("QUİZ OLUŞTURULUYOR ...")

  const { quizType, userEmail } = req.body; // Modül tipini frontend'den alıyoruz
  
  const zorluk = await fetchDifficulty(userEmail, quizType);

  console.log("ZORLUK : " , zorluk)
  console.log("KONU : " , quizType)
  
  const prompt = createPrompt(quizType, zorluk)// Modül tipine göre prompt seçiyoruz

  if (!prompt) {
    return res.status(400).json({ error: 'Invalid module type.' }); // Geçersiz modül tipi
  }

  try {
    const result = await model.generateContent(prompt); 
    
    res.json({content: result.response.text()});
  } catch (error) {
    console.error('Error generating module:', error.message);
    res.status(500).json({ error: 'Failed to generate module' });
  }
};

module.exports = { generateQuiz };
