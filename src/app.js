import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
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
        password: joi.string().required(),
        confirm_password: joi.ref('password')
    })

    const registrationData = req.body
    const validation = registrationSchema.validate(registrationData)
    if(validation.error){
        return res.sendStatus(422)
    }

    res.sendStatus(201)
})

app.listen(5000);