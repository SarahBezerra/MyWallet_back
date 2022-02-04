import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt';
import joi from 'joi'
import { v4 as uuid } from 'uuid'
import { MongoClient, ObjectId } from 'mongodb';
import dayjs from 'dayjs';

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

            await db.collection("sessions").insertOne({ userId: user._id, token })
            return res.send(token).status(200)
        }

        res.status(401).send("Email ou senha incorretos")

    } catch(error) {
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
        res.sendStatus(500)
    }
})

app.get('/extrato', async (req, res) => {

    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');

    if(!token) return res.sendStatus(401);

    const session = await db.collection("sessions").findOne({ token });
    if (!session) {
        return res.sendStatus(401);
    }

    const user = await db.collection("userData").findOne({ 
		_id: session.userId
	})

    if(user) {
        try {
            const registries = await db.collection("registries").find({ userId: user._id }).toArray();

            let saldo = 0;
            registries.map(registry => (registry.type === "entrada") ? saldo += parseFloat(registry.value) : saldo -= parseFloat(registry.value))

            if(registries){
                const infos = {registries, name: user.name, saldo}
                return res.send(infos)
            }
    
            res.send("Não há registros de entrada ou saída")
        }
        catch(error) {
            res.send(error)
         }

    } else {
        res.sendStatus(401);
    }
})

app.post('/registrar/:tipo_de_registro', async (req, res) => {

    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');

    if(!token) return res.sendStatus(401);

    const session = await db.collection("sessions").findOne({ token });
    if (!session) {
        return res.sendStatus(401);
    }

    const { userId } = session;

    const valueRecordSchema = joi.object({
        value: joi.string().pattern(/^[0-9]+.[0-9]{2}$/).required(),
        description: joi.string().pattern(/^[A-Za-z0-9]{2,20}$/).required(),
        type: joi.string().valid('saida', 'entrada').required()
    })

    const validation = valueRecordSchema.validate(req.body, { abortEarly: false })

    if(validation.error){
        return res.status(422).send(validation.error.details.map(error => error.message))
    }

    await db.collection("registries").insertOne({ ...req.body, userId, date: dayjs().format('DD/MM') })
    res.sendStatus(201)

})

app.listen(5000);