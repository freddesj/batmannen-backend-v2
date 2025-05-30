const express = require('express');
const app = express();
const port = 8080;

// Middleware (om du vill hantera JSON t.ex.)
app.use(express.json());

// Enkel test-rutt
app.get('/', (req, res) => {
  res.send('🚀 Båtmännen-backend är igång!');
});

// Starta servern – OBS: 0.0.0.0 krävs för Fly.io
app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Servern körs på http://0.0.0.0:${port}`);
});

