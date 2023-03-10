import mongoose from "mongoose";
import { MongoClient } from 'mongodb';
import DBClient from "./DBClient.js";

class Contenedor extends DBClient {

    constructor(collection) {
        super();
        this.collection = collection;
        this.options = {};
    }

    async connect() {
        try {
            const uri = `mongodb+srv://${ process.env.MONGO_USER || '' }:${ process.env.MONGO_PASS || '' }@${ process.env.MONGO_DB }.7aqz8cq.mongodb.net/?retryWrites=true&w=majority`;
            const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
            await client.connect();
            const database = client.db(process.env.MONGO_DB);
            const collection = database.collection(this.collection);
            return collection;
        } catch (error) {
            return null;
        }
    }

    async disconnect(){
        mongoose.disconnect();
    }

    async getProducts() {
        let products = [];
        try {
            const collection = await this.connect();
            products = await collection.find({}).toArray();
            await this.disconnect();   
        } catch (error) {
            throw new Error('Error al obtener todos los productos');
        }
        return products;
    }

    async save(newRegister) {
        try {
            const collection = await this.connect();
            newRegister.timestamp = this._getTimestamp();
            await collection.insertOne(newRegister);
            await this.disconnect();
            return newRegister;
        } catch (error) {
            throw new Error('Error al guardar el registro');
        }
    }

    _getTimestamp() {
        return new Date().getTime();
    }

}

export default Contenedor;