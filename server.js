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

// Helper: Läs JSON-fil säkert
function readJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8') || '[]';
    return JSON.parse(content);
  } catch (err) {
    console.error("⚠️ Kunde inte läsa", filePath, err);
    return [];
  }
}

// Helper: Spara JSON-fil
function saveJsonFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.error("❌ Kunde inte spara till", filePath, err);
    return false;
  }
}

app.get('/fartyg', (req, res) => {
  const ships = readJsonFile(fartygPath);
  res.json(ships);
});

app.post('/fartyg', (req, res) => {
  const ships = readJsonFile(fartygPath);
  const newShip = { ...req.body, id: Date.now().toString() };
  ships.push(newShip);
  const success = saveJsonFile(fartygPath, ships);
  if (success) {
    console.log("🆕 Nytt fartyg tillagt:", newShip);
    res.json(newShip);
  } else {
    res.status(500).json({ error: "Kunde inte spara fartyget" });
  }
});

app.get('/jobb', (req, res) => {
  const jobs = readJsonFile(jobbPath);
  res.json(jobs);
});

app.post('/jobb', (req, res) => {
  const jobs = readJsonFile(jobbPath);
  const newJob = { ...req.body, _id: Date.now().toString() };
  jobs.push(newJob);
  const success = saveJsonFile(jobbPath, jobs);
  if (success) {
    console.log("🆕 Nytt jobb sparat:", newJob);
    res.json(newJob);
  } else {
    res.status(500).json({ error: "Kunde inte spara jobbet" });
  }
});

app.patch('/jobb/:id', (req, res) => {
  const jobs = readJsonFile(jobbPath);
  const index = jobs.findIndex(j => j._id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Jobb hittades inte' });

  jobs[index] = { ...jobs[index], ...req.body };
  const success = saveJsonFile(jobbPath, jobs);
  if (success) {
    console.log("✏️ Jobb uppdaterat:", jobs[index]);
    res.json(jobs[index]);
  } else {
    res.status(500).json({ error: "Kunde inte spara ändringar" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend igång på port ${PORT}`);
});