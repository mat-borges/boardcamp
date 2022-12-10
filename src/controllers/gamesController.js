import { connection } from '../db/db.js';

export async function getGames(req, res) {
	const { name } = req.query;
	try {
		if (name) {
			const filter = `${name}%`;
			const filteredGames = await connection.query('SELECT * FROM games WHERE name ILIKE $1;', [filter]);
			res.send(filteredGames.rows);
		} else {
			const games = await connection.query('SELECT * FROM games;');
			res.send(games.rows);
		}
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
}

export async function newGame(req, res) {
	const { game } = res.locals;
	try {
		await connection.query(
			'INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)',
			[game.name, game.image, game.stockTotal, game.categoryId, game.pricePerDay]
		);
		res.sendStatus(201);
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
}
