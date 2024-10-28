const express = require('express');
const cors = require('cors'); // Import CORS

const app = express();
app.use(cors()); // Enable CORS to allow frontend access
app.use(express.json());

app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend bağlantısı başarılı!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
