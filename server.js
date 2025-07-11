import express from 'express';
import dotenv from 'dotenv';
import index from './routes/index.js';
import room from './routes/room.js';
import item from './routes/item.js';
import user from './routes/user.js';
import shuffle from './routes/shuffle.js';

dotenv.config();
const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/', index);
app.use('/room', room);
app.use('/item', item);
app.use('/user', user);
app.use('/shuffle',shuffle)

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});