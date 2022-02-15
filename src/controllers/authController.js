import db from "../db.js"
import { v4 as uuid } from "uuid"
import bcrypt from 'bcrypt';

export async function signIn(req, res) {
    const { email, password } = req.body;

    try {
        const user = await db.collection("userData").findOne({ email: email })

        if(!user){
            return res.status(401).send("Email ou senha incorretos")
        }

        if(bcrypt.compareSync(password, user.password)){
            const token = uuid();

            await db.collection("sessions").deleteOne({ userId: user._id })
            await db.collection("sessions").insertOne({ userId: user._id, token })
            return res.send(token).status(200)
        }

        res.status(401).send("Email ou senha incorretos")

    } catch(error) {
        res.sendStatus(error)
    }
}


export async function signUp(req, res) {

    const datasSignUp = req.body;

    if(await db.collection("userData").findOne({ email: datasSignUp.email })){
        return res.status(422).send("Por favor, revise os dados inseridos")
    }

    const encryptedPassword = bcrypt.hashSync(datasSignUp.password, 10)

    try {
        await db.collection("userData").insertOne({ ...datasSignUp, password: encryptedPassword })
        res.sendStatus(201)

    } catch(error) {
        res.sendStatus(500)
    }
}
