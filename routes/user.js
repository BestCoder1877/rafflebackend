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

function emailToFieldName(email) {
	return email.replace(/\./g, '_dot_').replace(/@/g, '_at_');
}

app.post('/:id', async (req, res) => {
	const id = req.params.id;
	const item = await collection.findOne({ id: id });
	const email = req.body.email;
	const ext = req.body.ext;
	const value = { email };
	if (ext) {
		value.ext = ext;
	}
	res.send(
		await collection.findOneAndUpdate(
			{ id: id },
			{ $set: { [`users.${emailToFieldName(email)}`]: value } },
			{ returnDocument: 'after' },
		),
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
			{ $set: { [`users.${emailToFieldName(oldEmail)}`]: setVar } },
			{ returnDocument: 'after' },
		),
	);
});

app.delete('/:id/:email', async (req, res) => {
	const id = req.params.id;
	const email = req.params.email;

	console.log('Deleting user:', email);
	console.log('Converted key:', emailToFieldName(email));

	res.send(
		await collection.findOneAndUpdate(
			{ id: id },
			{ $unset: { [`users.${emailToFieldName(email)}`]: '' } },
			{ returnDocument: 'after' },
		),
	);
});

export default app;
