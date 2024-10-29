const express = require('express');
const cors = require('cors');
const modulesRouter = require('./routes/modules'); // Route dosyasını import et

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Modül route'unu ekle
app.use('/api/modules', modulesRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
