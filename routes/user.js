import express from 'express';
import connect from '../config/connector.js';
let client;
let collection;

const app = express();
app.use(express.json());

(async () => {
	client = await connect();
	collection = client.db('raffle').collection('items');
})();

app.post('/:id', async (req, res) => {
	const id = req.params.id;
	const item = await collection.findOne({ id: id });
	const email = req.body.email;
	const ext = req.body.ext;
	const users = item.users;
	const value = { email };
	if (ext) {
		value.ext = ext;
	}
	res.send(
		await collection.findOneAndUpdate(
			{ id: id },
			{ $set: { [`users.${email.replace(/\./g, '_dot_')}`]: value } },
			{ returnDocument: 'after' }
		)
	);
});
app.put('/:id/:oldEmail', async (req, res) => {
	const email = req.body.email;
	const oldEmail = req.params.oldEmail;
	const ext = req.body.ext;
	const id = req.params.id;
	const setVar = {};
	if (email) {
		setVar.email = email;
	}
	if (ext) {
		setVar.ext = ext;
	}
	res.send(
		await collection.findOneAndUpdate(
			{ id: id },
			{ $set: { [`users.${oldEmail.replace(/\./g, '_dot_')}`]: setVar } },
			{ returnDocument: 'after' }
		)
	);
});
app.delete('/:id/:email', async (req, res) => {
	const id = req.params.id;
	const email = req.params.email;
	res.send(
		await collection.findOneAndUpdate(
			{ id: id },
			{ $unset: { [`users.${email.replace(/\./g, '_dot_')}`]: '' } },
			{ returnDocument: 'after' }
		)
	);
});
export default app;
