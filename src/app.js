import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt';
import joi from 'joi'
import { MongoClient, ObjectId } from 'mongodb';

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;
mongoClient.connect(() => {
    db = mongoClient.db("mywallet")
});


app.post('/login', (req, res) => {
})

app.post('/cadastro', async (req, res) => {
    const registrationSchema = joi.object({
        name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().required()
    })

    const encryptedPassword = bcrypt.hashSync(req.body.password, 10)

    const registrationData = { ...req.body, password: encryptedPassword }

    const validation = registrationSchema.validate(registrationData)
    if(validation.error){
        return res.status(422).send("Confira se os dados foram informados corretamente")
    }

    try {
        await db.collection("userData").insertOne(registrationData)
        res.sendStatus(201)

    } catch(error) {
        console.log(error)
        res.sendStatus(500)
    }
})

app.listen(5000);