import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.DB_URI;
console.log(`the mongo uri is ${uri}`);
const client = new MongoClient(uri);
export default async function connect() {
	try {
		const connection = await client.connect();
		return connection;
	} catch (e) {
		console.error('MongoDB connection error in connector.js:', e); // Keep this log for visibility
		throw e;
	}
}
