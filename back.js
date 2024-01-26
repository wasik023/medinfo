const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
const url = 'mongodb://localhost:27017';
const database = 'SEdb';
const client = new MongoClient(url);

app.use(bodyParser.urlencoded({ extended: true }));

async function searchData(medicineName) {
  try {
    let result = await client.connect();
    let db = result.db(database);
    let collection = db.collection('medinfo');
    let medicine = await collection.findOne({ name: { $regex: new RegExp(medicineName, 'i') } });
    if (medicine) {
      let response = await collection.find({ formula: medicine.formula }).toArray();
      return response;
    } else {
      return 'Medicine not found.';
    }
  } finally {
    await client.close();
  }
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/search', async (req, res) => {
  const medicineName = req.body.name;
  const result = await searchData(medicineName);
  res.json(result );

});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
