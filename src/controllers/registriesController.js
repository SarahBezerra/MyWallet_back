import { ObjectId } from "bson";
import db from "../db.js"
import dayjs from 'dayjs';

export async function getStatement(req, res) {

    const { user } = res.locals;

    try {
        const registries = await db.collection("registries").find({ userId: user._id }).toArray();

        if(registries){
            let saldo = 0;
            registries.map(registry => (registry.type === "entrada") ? saldo += parseFloat(registry.value) : saldo -= parseFloat(registry.value))
            
            const infos = {
                registries, 
                name: user.name, 
                saldo: parseFloat(saldo).toFixed(2)}
                
            return res.send(infos)
        }

        res.send("Não há registros de entrada ou saída")
    }
    catch(error) {
        res.send(error)
     }
}


export async function postRegistry(req, res) {

    const { user } = res.locals;
    const { registryType } = req.params;

    const y = await db.collection("registries").insertOne({ ...req.body, userId: user._id, date: dayjs().format('DD/MM'), type: registryType })

    res.sendStatus(201)
}


export async function deleteRegistry(req, res) {
    
    const { _id } = req.params;

    try {
        await db.collection("registries").deleteOne({ _id: new ObjectId(_id) })
        res.sendStatus(200)
    }
    catch(error) {
        res.sendStatus(500)
    }

}