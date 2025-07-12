import express from 'express';
import connect from '../config/connector.js';

const app = express();

app.get('/', async (req, res) => {
	const connector = await connect();
	if (connector.status === 400) {
		console.log(connector.error);
		res.send('400 Could not connect to mongodb');
		return;
	}

	res.send({ status: 200 });
});



export default app;
