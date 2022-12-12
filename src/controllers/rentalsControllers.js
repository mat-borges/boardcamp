import { connection } from '../db/db.js';
import dayjs from 'dayjs';

export async function getRentals(req, res) {
	const customerId = Number(req.query.customerId);
	const gameId = Number(req.query.gameId);

	try {
		let rentals;
		const query = `SELECT rentals.*,
					json_build_object('id',customers.id,'name',customers.name) AS customer,
				 	json_build_object('id',games.id,'name', games.name,'categoryId', games."categoryId", 'categoryName', categories.name) AS game
					FROM rentals
						JOIN customers ON rentals."customerId"=customers.id
						JOIN games ON rentals."gameId"=games.id
						JOIN categories ON games."categoryId" = categories.id`;
		if (customerId && gameId) {
			rentals = await connection.query(
				`${query} WHERE rentals."customerId" = $1 AND rentals."gameId" = $2;`,
				[customerId, gameId]
			);
		} else if (customerId) {
			rentals = await connection.query(`${query} WHERE "customerId"=$1;`, [customerId]);
		} else if (gameId) {
			rentals = await connection.query(`${query} WHERE "gameId"=$1;`, [gameId]);
		} else {
			rentals = await connection.query(`${query};`);
		}
		res.send(rentals.rows);
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
}

export async function newRental(req, res) {
	const { customerId, gameId, daysRented } = res.locals.rental;
	const today = dayjs().format('YYYY-MM-DD');

	try {
		const pricePerDay = await connection.query(`SELECT "pricePerDay" FROM games WHERE id=$1`, [gameId]);
		const originalPrice = pricePerDay.rows[0].pricePerDay;

		await connection.query(
			`INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7);`,
			[customerId, gameId, today, daysRented, null, originalPrice, null]
		);
		res.sendStatus(201);
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
}

export async function returnRental(req, res) {
	res.sendStatus(501);
}

export async function deleteRental(req, res) {
	res.sendStatus(501);
}
