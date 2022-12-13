import { connection } from '../db/db.js';

export async function getGames(req, res) {
	const { name } = req.query;
	const limit = parseInt(req.query.limit);
	const offset = parseInt(req.query.offset);

	function queryStrings() {
		switch (name || limit || offset) {
			case name && limit && offset:
				return {
					string: `SELECT * FROM games WHERE name ILIKE $1 LIMIT $2 OFFSET $3;`,
					params: [name, limit, offset],
				};
			case name && limit:
				return {
					string: `SELECT * FROM games WHERE name ILIKE $1 LIMIT $2;`,
					params: [name, limit],
				};
			case name && offset:
				return {
					string: `SELECT * FROM games WHERE name ILIKE $1 OFFSET $2;`,
					params: [name, offset],
				};
			case name:
				return {
					string: `SELECT * FROM games WHERE name ILIKE $1;`,
					params: [name],
				};
			case limit && offset:
				return {
					string: `SELECT * FROM games ORDER BY id LIMIT $1 OFFSET $2;`,
					params: [limit, offset],
				};
			case limit:
				return {
					string: `SELECT * FROM games ORDER BY id LIMIT $1 ;`,
					params: [limit],
				};
			case offset:
				return {
					string: `SELECT * FROM games ORDER BY id OFFSET $1 ;`,
					params: [offset],
				};
			default:
				return { string: `SELECT * FROM games ORDER BY id;`, params: [] };
		}
	}

	try {
		const games = await connection.query(`${queryStrings().string}`, queryStrings().params);

		res.send(games.rows);
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
}

export async function newGame(req, res) {
	const { game } = res.locals;
	try {
		await connection.query(
			'INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5);',
			[game.name, game.image, game.stockTotal, game.categoryId, game.pricePerDay]
		);
		res.sendStatus(201);
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
}
