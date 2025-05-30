const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/fartyg', (req, res) => {
  const ships = [
    { name: 'Marburg', agent: 'Unifeeder' },
    { name: 'Gotland', agent: 'Wallenius' }
  ];
  res.json(ships);
});

app.get('/jobb', (req, res) => {
  const filePath = path.join(__dirname, 'jobb.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Kunde inte läsa jobb.json' });
    try {
      const jobb = JSON.parse(data || '[]');
      res.json(jobb);
    } catch {
      res.status(500).json({ error: 'Fel vid tolkning av JSON' });
    }
  });
});

app.post('/jobb', (req, res) => {
  const filePath = path.join(__dirname, 'jobb.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    const existing = err ? [] : JSON.parse(data || '[]');
    const newJob = { ...req.body, _id: Date.now().toString() };
    existing.push(newJob);
    fs.writeFile(filePath, JSON.stringify(existing, null, 2), err => {
      if (err) return res.status(500).json({ error: 'Kunde inte spara jobbet' });
      res.json(newJob);
    });
  });
});

app.patch('/jobb/:id', (req, res) => {
  const filePath = path.join(__dirname, 'jobb.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Kunde inte läsa jobb.json' });

    let jobb = JSON.parse(data || '[]');
    const index = jobb.findIndex(j => j._id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Jobb hittades inte' });

    jobb[index] = { ...jobb[index], ...req.body };
    fs.writeFile(filePath, JSON.stringify(jobb, null, 2), err => {
      if (err) return res.status(500).json({ error: 'Kunde inte spara ändringar' });
      res.json(jobb[index]);
    });
  });
});

app.listen(PORT, () => {
  console.log(`✅ Backend igång på port ${PORT}`);
});
