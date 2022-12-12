import { connection } from '../db/db.js';

export async function getRentals(req, res) {
	const customerId = Number(req.query.customerId);
	const gameId = Number(req.query.gameId);

	try {
		let rentals;
		if (customerId && gameId) {
			rentals = await connection.query('SELECT * FROM rentals WHERE "customerId"=$1 AND "gameId"=$2;', [
				customerId,
				gameId,
			]);
		} else if (customerId) {
			rentals = await connection.query('SELECT * FROM rentals WHERE "customerId"=$1;', [customerId]);
		} else if (gameId) {
			rentals = await connection.query('SELECT * FROM rentals WHERE "gameId"=$1;', [gameId]);
		} else {
			rentals = await connection.query('SELECT * FROM rentals;');
		}
		res.send(rentals.rows);
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
}

export async function newRental(req, res) {
	const { customerId, gameId, daysRented } = res.locals.rental;
	res.sendStatus(501);
}

export async function returnRental(req, res) {
	res.sendStatus(501);
}

export async function deleteRental(req, res) {
	res.sendStatus(501);
}
