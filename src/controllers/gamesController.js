import { connection } from '../db/db.js';

export async function getGames(req, res) {
	const { name } = req.query;
	const limit = parseInt(req.query.limit);
	const offset = parseInt(req.query.offset);

	function queryStrings() {
		let filter;
		if (name) {
			filter = `${name}%`;
		}
		if (name && limit && offset) {
			return {
				string: `SELECT * FROM games WHERE name ILIKE $1 LIMIT $2 OFFSET $3;`,
				params: [filter, limit, offset],
			};
		} else if (name && limit) {
			return {
				string: `SELECT * FROM games WHERE name ILIKE $1 LIMIT $2;`,
				params: [filter, limit],
			};
		} else if (name && offset) {
			return {
				string: `SELECT * FROM games WHERE name ILIKE $1 OFFSET $2;`,
				params: [filter, offset],
			};
		} else if (name) {
			return {
				string: `SELECT * FROM games WHERE name ILIKE $1;`,
				params: [filter],
			};
		} else if (limit && offset) {
			return {
				string: `SELECT * FROM games ORDER BY id LIMIT $1 OFFSET $2;`,
				params: [limit, offset],
			};
		} else if (limit) {
			return {
				string: `SELECT * FROM games ORDER BY id LIMIT $1 ;`,
				params: [limit],
			};
		} else if (offset) {
			return {
				string: `SELECT * FROM games ORDER BY id OFFSET $1 ;`,
				params: [offset],
			};
		} else {
			return { string: `SELECT * FROM games ORDER BY id;`, params: [] };
		}
	}

	try {
		const games = await connection.query(`${queryStrings().string}`, queryStrings().params);
		const rentals = await connection.query('SELECT * FROM rentals;');

		let countRentals = [];
		for (let game of games.rows) {
			let rentalsCount = 0;
			for (let rental of rentals.rows) {
				if (game.id === rental.gameId) {
					rentalsCount++;
				}
			}
			countRentals.push({ ...game, rentalsCount });
		}
		res.send(countRentals);
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
