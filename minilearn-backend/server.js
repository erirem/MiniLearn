const express = require('express');
const cors = require('cors');

const modulesRouter = require('./routes/modules');
const quizesRouter = require('./routes/quiz');
const evaluateRouter = require('./routes/evaluate');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Modül route'unu ekle
app.use('/api/modules', modulesRouter);
app.use('/api/quizes', quizesRouter);
app.use('/api/evaluate', evaluateRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

