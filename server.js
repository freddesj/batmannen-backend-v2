const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const jobbPath = path.join(__dirname, 'jobb.json');
const fartygPath = path.join(__dirname, 'fartyg.json');

function readJson(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8') || '[]';
    return JSON.parse(content);
  } catch {
    return [];
  }
}

function saveJson(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch {
    return false;
  }
}

app.get('/fartyg', (req, res) => {
  const data = readJson(fartygPath);
  res.json(data);
});

app.post('/fartyg', (req, res) => {
  const fartyg = readJson(fartygPath);
  const newShip = { ...req.body, id: Date.now().toString() };
  fartyg.push(newShip);
  const success = saveJson(fartygPath, fartyg);
  if (success) res.json(newShip);
  else res.status(500).json({ error: 'Kunde inte spara fartyg' });
});

app.get('/jobb', (req, res) => {
  const data = readJson(jobbPath);
  res.json(data);
});

app.post('/jobb', (req, res) => {
  const jobb = readJson(jobbPath);
  const newJob = { ...req.body, _id: Date.now().toString() };
  jobb.push(newJob);
  const success = saveJson(jobbPath, jobb);
  if (success) res.json(newJob);
  else res.status(500).json({ error: 'Kunde inte spara jobb' });
});

app.patch('/jobb/:id', (req, res) => {
  const jobb = readJson(jobbPath);
  const index = jobb.findIndex(j => j._id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Jobb hittades inte' });
  jobb[index] = { ...jobb[index], ...req.body };
  const success = saveJson(jobbPath, jobb);
  if (success) res.json(jobb[index]);
  else res.status(500).json({ error: 'Kunde inte spara ändringar' });
});

app.delete('/jobb/:id', (req, res) => {
  let jobb = readJson(jobbPath);
  const initialLength = jobb.length;
  jobb = jobb.filter(j => j._id !== req.params.id);
  if (jobb.length === initialLength) return res.status(404).json({ error: 'Jobb hittades inte' });
  const success = saveJson(jobbPath, jobb);
  if (success) res.json({ message: 'Jobb borttaget' });
  else res.status(500).json({ error: 'Kunde inte ta bort jobbet' });
});

app.listen(PORT, () => {
  console.log(`✅ Backend igång på port ${PORT}`);
});