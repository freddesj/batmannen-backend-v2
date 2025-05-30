const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = "mongodb://fsjolander:kaffefittan@ac-khionpv-shard-00-00.vwn71go.mongodb.net:27017,ac-khionpv-shard-00-01.vwn71go.mongodb.net:27017,ac-khionpv-shard-00-02.vwn71go.mongodb.net:27017/?ssl=true&replicaSet=atlas-dq36k8-shard-0&authSource=admin&retryWrites=true&w=majority&appName=batmannen";

app.use(cors());
app.use(express.json());

let db, jobbCollection, fartygCollection;

MongoClient.connect(MONGO_URI, { useUnifiedTopology: true, tls: true, tlsInsecure: true })
  .then(client => {
    db = client.db("batmannen");
    jobbCollection = db.collection("jobb");
    fartygCollection = db.collection("fartyg");
    console.log("✅ Ansluten till MongoDB Atlas");
  })
  .catch(err => console.error("❌ MongoDB-anslutning misslyckades:", err));

// JOBB
app.get("/jobb", async (req, res) => {
  const jobb = await jobbCollection.find().toArray();
  res.json(jobb);
});

app.post("/jobb", async (req, res) => {
  const result = await jobbCollection.insertOne(req.body);
  res.json({ ...req.body, _id: result.insertedId });
});

app.patch("/jobb/:id", async (req, res) => {
  const id = req.params.id;
  await jobbCollection.updateOne({ _id: new ObjectId(id) }, { $set: req.body });
  const updated = await jobbCollection.findOne({ _id: new ObjectId(id) });
  res.json(updated);
});

app.delete("/jobb/:id", async (req, res) => {
  const id = req.params.id;
  const result = await jobbCollection.deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount === 1) {
    res.json({ message: "Jobb borttaget" });
  } else {
    res.status(404).json({ error: "Jobb hittades inte" });
  }
});

// FARTYG
app.get("/fartyg", async (req, res) => {
  const fartyg = await fartygCollection.find().toArray();
  res.json(fartyg);
});

app.post("/fartyg", async (req, res) => {
  const result = await fartygCollection.insertOne(req.body);
  res.json({ ...req.body, _id: result.insertedId });
});

app.listen(8080, '0.0.0.0', () => {
  console.log(`🚀 Servern körs på port ${PORT}`);
});
