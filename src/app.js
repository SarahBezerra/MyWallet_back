import express from 'express'
import cors from 'cors'
import { MongoClient, ObjectId } from 'mongodb';

const app = express();
app.use(express.json());
app.use(cors());

app.post('/login', (req, res) => {
})

app.post('/cadastro', (req, res) => {
})

app.listen(5000);