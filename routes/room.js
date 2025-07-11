import express from 'express';
import connect from '../config/connector.js';
import { nanoid } from 'nanoid';
let client;
let collection;

const app = express();
app.use(express.json());

(async () => {
	client = await connect();
	collection = client.db('raffle').collection('rooms');
})();

app.get('/:code', async (req, res) => {
	const code = req.params.code;
	const document = await collection.findOne({ code: code });
	res.send(document);
});
app.post('/', async (req, res) => {
	const title = req.body.title;
	const isCompany = req.body.company;
	async function getCode(codeType) {
		while (true) {
			let code = nanoid(8);
			let used = await collection.findOne({ [codeType]: code });
			if (!used) {
				return code;
			}
		}
	}
	const code = await getCode('code');
	const hostCode = await getCode('hostCode');

	let connectionString = {
		title: title,
		code: code,
		hostCode: hostCode,
	};
	if (isCompany) {
		connectionString.isCompany = true;
		const ext = req.body.ext;
		if (ext) {
			connectionString.ext = ext;
		}
	} else {
		connectionString.isCompany = true;
	}
	await collection.insertOne(connectionString);
	res.send(await collection.findOne({ code: code }));
});
app.put('/:code', async (req, res) => {
	const title = req.body.title;
	const code = req.params.code;
	res.send(
		await collection.findOneAndUpdate(
			{ code: code },
			{ $set: { title: title } },
			{ returnDocument: 'after' }
		)
	);
});
app.delete('/:code', async (req, res) => {
	const code = req.params.code;
	res.send(
		await collection.findOneAndDelete(
			{ code: code },
			{ returnDocument: 'after' }
		)
	);
});
export default app;
