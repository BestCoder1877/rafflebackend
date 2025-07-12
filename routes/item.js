import express from 'express';
import connect from '../config/connector.js';
import generateId from '../config/generateId.js';
let client;
let collection;
let roomsCollection;

const app = express();
app.use(express.json());

(async () => {
	client = await connect();
	collection = client.db('raffle').collection('items');
	roomsCollection = client.db('raffle').collection('rooms');
})();

app.get('/:id', async (req, res) => {
	const id = req.params.id;
	const document = await collection.findOne({ id: id });
	res.send(document);
});

app.get('/code/:code', async (req, res) => {
	const code=req.params.code
	const document = await collection.find({code:code}).toArray();
	res.send(document);
});
app.delete('/:id', async (req, res) => {
	const id = req.params.id;
	res.send(
		await collection.findOneAndDelete({ id: id }, { returnDocument: 'after' })
	);
});
app.post('/', async (req, res) => {
	const title = req.body.title;
	const code = req.body.code;
	const description = req.body.description;
	const users = {};
	const id = await generateId('id', collection);
	let connectionString = {
		title: title,
		description: description,
		code: code,
		users: users,
		id: id,
	};
	await collection.insertOne(connectionString);
	res.send(await collection.findOne({ id: id }));
});
app.put('/:id', async (req, res) => {
	const title = req.body.title;
	const description = req.body.title;
	const id = req.params.id;
	const setVar = {};
	if (title) {
		setVar.title = title;
	}
	if (description) {
		setVar.description = description;
	}
	res.send(
		await collection.findOneAndUpdate(
			{ id: id },
			{ $set: setVar },
			{ returnDocument: 'after' }
		)
	);
});

export default app;
