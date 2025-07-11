import { nanoid } from 'nanoid';
async function getCode(codeType,collection) {
	while (true) {
		let code = nanoid(8);
		let used = await collection.findOne({ [codeType]: code });
		if (!used) {
			return code;
		}
	}
}
export default getCode