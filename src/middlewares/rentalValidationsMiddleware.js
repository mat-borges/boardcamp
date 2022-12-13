import { cleanStringData } from '../server.js';
import { connection } from '../db/db.js';
import { newRentalsSchema } from '../models/rentalSchemas.js';

export function rentalSchemaValidation(req, res, next) {
	const { customerId, gameId, daysRented } = req.body;

	const rental = {
		customerId: Number(cleanStringData(customerId)),
		gameId: Number(cleanStringData(gameId)),
		daysRented: Number(cleanStringData(daysRented)),
	};

	const { error } = newRentalsSchema.validate(rental, { abortEarly: false });

	if (error) {
		const errors = error.details.map((detail) => detail.message);
		res.status(400).send({ message: errors });
	} else {
		res.locals.rental = rental;
		next();
	}
}

export async function gameCustomerExists(req, res, next) {
	const { customerId, gameId } = res.locals.rental;

	try {
		const customerExists = await connection.query(`SELECT * FROM customers WHERE id=$1;`, [customerId]);
		const gameExists = await connection.query(`SELECT * FROM games WHERE id=$1;`, [gameId]);

		if (!customerExists.rows[0] || !gameExists.rows[0]) {
			return res.sendStatus(400);
		} else {
			next();
		}
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
}

export async function rentalExists(req, res, next) {
	const { id } = req.params;
	try {
		const rentalExists = await connection.query(`SELECT * FROM rentals WHERE id=$1`, [id]);
		if (!rentalExists.rows[0]) {
			return res.sendStatus(404);
		} else {
			next();
		}
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
}
