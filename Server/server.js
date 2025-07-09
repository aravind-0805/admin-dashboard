const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const { MongoClient, ObjectId } = require('mongodb');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const client = new MongoClient(process.env.MONGO_URI);
let db;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

client.connect().then(() => {
  db = client.db('dashboardDB');
  console.log('Connected to MongoDB');
});

app.get('/api/entries', async (req, res) => {
  const entries = await db.collection('entries').find().toArray();
  res.json(entries);
});

app.post('/api/entries', async (req, res) => {
  const entry = req.body;
  await db.collection('entries').insertOne(entry);
  res.json({ message: 'Entry added' });
});

app.put('/api/entries/:id', async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  await db.collection('entries').updateOne({ _id: new ObjectId(id) }, { $set: updatedData });
  res.json({ message: 'Entry updated' });
});

app.delete('/api/entries/:id', async (req, res) => {
  const { id } = req.params;
  await db.collection('entries').deleteOne({ _id: new ObjectId(id) });
  res.json({ message: 'Entry deleted' });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
