import express from 'express';
import connect from '../config/connector.js';
import lodash from 'lodash';
let client;
let collection;

const app = express.Router();
app.use(express.json());

(async () => {
	client = await connect();
	collection = await client.db('raffle').collection('items');
})();

app.get('/:id', async (req, res) => {
	const id = req.params.id;
	const item = await collection.findOne({ id: id });
	const users = item.users;
	const usersAsArray = Object.values(users);
	const winner = lodash.shuffle(usersAsArray)[0].email;
	await collection.findOneAndUpdate(
		{ id: id },
		{ $set: { [`winner`]: winner } },
		{ returnDocument: 'after' }
	);
	res.send(winner);
});

export default app;
