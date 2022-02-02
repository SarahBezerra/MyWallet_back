import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt';
import joi from 'joi'
import { MongoClient, ObjectId } from 'mongodb';

const app = express();
app.use(express.json());
app.use(cors());

app.post('/login', (req, res) => {
})

app.post('/cadastro', (req, res) => {
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

    console.log(registrationData)
    res.sendStatus(201)
})

app.listen(5000);