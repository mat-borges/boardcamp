import { connection } from '../db/db.js';

export async function getCategories(req, res) {
	const limit = parseInt(req.query.limit);
	const offset = parseInt(req.query.offset);

	function queryStrings() {
		if (limit && offset) {
			return {
				string: `SELECT * FROM categories ORDER BY id LIMIT $1 OFFSET $2;`,
				params: [limit, offset],
			};
		} else if (limit) {
			return {
				string: `SELECT * FROM categories ORDER BY id LIMIT $1 ;`,
				params: [limit],
			};
		} else if (offset) {
			return {
				string: `SELECT * FROM categories ORDER BY id OFFSET $1 ;`,
				params: [offset],
			};
		} else {
			return { string: 'SELECT * FROM categories ORDER BY id;', params: [] };
		}
	}

	try {
		const categories = await connection.query(`${queryStrings().string}`, queryStrings().params);
		res.send(categories.rows);
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
}

export async function newCategory(req, res) {
	const { name } = req.body;

	if (!name) return res.sendStatus(400);

	try {
		const category = await connection.query('SELECT * FROM categories WHERE name=$1;', [name]);
		const categoryExists = category.rows.length !== 0;

		if (categoryExists) return res.sendStatus(409);

		await connection.query('INSERT INTO categories (name) VALUES ($1);', [name]);
		res.sendStatus(201);
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
}
