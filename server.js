const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const filePath = path.join(__dirname, 'jobb.json');

// Helper: Läs JSON-fil säkert
function readJobsFile() {
  try {
    const content = fs.readFileSync(filePath, 'utf8') || '[]';
    return JSON.parse(content);
  } catch (err) {
    console.error("⚠️ Kunde inte läsa jobb.json:", err);
    return [];
  }
}

// Helper: Spara JSON-fil
function saveJobsFile(jobs) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(jobs, null, 2));
    return true;
  } catch (err) {
    console.error("❌ Kunde inte spara till jobb.json:", err);
    return false;
  }
}

app.get('/fartyg', (req, res) => {
  const ships = [
    { name: 'Marburg', agent: 'Unifeeder' },
    { name: 'Gotland', agent: 'Wallenius' }
  ];
  res.json(ships);
});

app.get('/jobb', (req, res) => {
  const jobs = readJobsFile();
  res.json(jobs);
});

app.post('/jobb', (req, res) => {
  const jobs = readJobsFile();
  const newJob = { ...req.body, _id: Date.now().toString() };
  jobs.push(newJob);
  const success = saveJobsFile(jobs);
  if (success) {
    console.log("🆕 Nytt jobb sparat:", newJob);
    res.json(newJob);
  } else {
    res.status(500).json({ error: "Kunde inte spara jobbet" });
  }
});

app.patch('/jobb/:id', (req, res) => {
  const jobs = readJobsFile();
  const index = jobs.findIndex(j => j._id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Jobb hittades inte' });

  jobs[index] = { ...jobs[index], ...req.body };
  const success = saveJobsFile(jobs);
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