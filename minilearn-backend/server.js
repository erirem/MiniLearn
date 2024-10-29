const express = require('express');
const cors = require('cors'); // Import CORS

const app = express();
app.use(cors()); // Enable CORS to allow frontend access
app.use(express.json());

app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend bağlantısı başarılı!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get('/api/quiz', async (req, res) => {
  try {
    const response = await axios.post(
      'https://gemini-api-url.com/generate-quiz',
      {
        prompt: 'Matematik ile ilgili 5 quiz sorusu oluştur', // Dinamik prompt
      },
      {
        headers: { 'Authorization': `Bearer ${GEMINI_API_KEY}` }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Gemini API Hatası:', error);
    res.status(500).json({ error: 'Quiz oluşturulamadı' });
  }
});