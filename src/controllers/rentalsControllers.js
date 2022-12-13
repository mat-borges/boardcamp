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
		const game = await connection.query(
			`SELECT "pricePerDay", "stockTotal"
				FROM games
				WHERE id=$1`,
			[gameId]
		);
		const stockTotal = game.rows[0].stockTotal;
		const gameRentals = await connection.query(`SELECT * FROM rentals WHERE "gameId"=$1`, [gameId]);
		const rentedGames = gameRentals.rows.filter((game) => game.returnDate === null).length;

		if (rentedGames < stockTotal) {
			const originalPrice = game.rows[0].pricePerDay * daysRented;

			await connection.query(
				`INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7);`,
				[customerId, gameId, today, daysRented, null, originalPrice, null]
			);
			res.sendStatus(201);
		} else {
			return res.sendStatus(400);
		}
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
}

export async function returnRental(req, res) {
	const { id } = req.params;
	const returnDate = dayjs().format('YYYY-MM-DD');
	try {
		const getRental = await connection.query(`SELECT * FROM rentals WHERE id=$1;`, [id]);

		if (getRental.rows[0].returnDate !== null) return res.sendStatus(400);

		// variables
		const { originalPrice, daysRented } = getRental.rows[0];
		const rentDate = dayjs(getRental.rows[0].rentDate).valueOf();
		// calculations
		const daysDelay = (dayjs(returnDate.valueOf()) - rentDate) / 1000 / 3600 / 24 - daysRented;
		const delayFee = Math.floor(daysDelay <= 0 ? 0 : daysDelay) * originalPrice;

		await connection.query(`UPDATE rentals SET "returnDate"=$1, "delayFee"=$2 WHERE id=$3;`, [
			returnDate,
			delayFee,
			id,
		]);

		res.sendStatus(200);
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
}

export async function deleteRental(req, res) {
	const { id } = req.params;
	try {
		const rental = await connection.query(`SELECT * FROM rentals WHERE id=$1;`, [id]);

		if (rental.rows[0].returnDate !== null) return res.sendStatus(400);

		await connection.query(`DELETE FROM rentals WHERE id=$1;`, [id]);
		res.sendStatus(200);
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
}
