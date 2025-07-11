import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.DB_URI;

const client = new MongoClient(uri);
export default async function connect() {
	try {
		const connection=await client.connect();
        return connection
	} catch (e) {
		return { status: 400,error:e};
	}
}
