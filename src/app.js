import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt';
import joi from 'joi'
import { v4 as uuid } from 'uuid'
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


app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await db.collection("userData").findOne({ email: email })

        if(!user){
            return res.sendStatus(401)
        }

        if(bcrypt.compareSync(password, user.password)){
            const token = uuid();
            return res.send(token).status(200)
        }

        res.sendStatus(401)

    } catch(error) {
        console.log(error)
        res.sendStatus(500)
    }
})

app.post('/cadastro', async (req, res) => {
    const registrationSchema = joi.object({
        name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().required()
    })

    const validation = registrationSchema.validate(req.body)

    if(validation.error || await db.collection("userData").findOne({ email: req.body.email })){
        return res.status(422).send("Algum dado informado está incorreto")
    }

    const encryptedPassword = bcrypt.hashSync(req.body.password, 10)

    try {
        await db.collection("userData").insertOne({ ...req.body, password: encryptedPassword })
        res.sendStatus(201)

    } catch(error) {
        console.log(error)
        res.sendStatus(500)
    }
})

app.listen(5000);