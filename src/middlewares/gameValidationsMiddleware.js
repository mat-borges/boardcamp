import { cleanStringData } from '../server.js';
import { connection } from '../db/db.js';
import { gameSchema } from '../models/gameSchema.js';

export function validateGameSchema(req, res, next) {
	const { name, image, stockTotal, categoryId, pricePerDay } = req.body;
	if (!name || !stockTotal || !pricePerDay) {
		return res.status(400).send({
			message:
				'nome não pode estar vazio; stockTotal e pricePerDay devem ser um número inteiro maior que 0',
		});
	}

	const game = {
		name: cleanStringData(name),
		image: cleanStringData(image),
		stockTotal: Number(cleanStringData(stockTotal)),
		categoryId: Number(cleanStringData(categoryId)),
		pricePerDay: Number(cleanStringData(pricePerDay)),
	};
	const { error } = gameSchema.validate(game, { abortEarly: false });
	if (error) {
		const errors = error.details.map((detail) => detail.message);
		return res.status(422).send({ message: errors });
	} else {
		res.locals.game = game;
		next();
	}
}

export async function checkCategory(req, res, next) {
	const { game } = res.locals;
	try {
		const categoryExists = await connection.query('SELECT * FROM categories WHERE id=$1', [
			game.categoryId,
		]);

		if (!categoryExists.rows[0]) {
			return res.status(400).send({ message: 'Essa categoria não existe' });
		} else {
			next();
		}
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
}

export async function checkGame(req, res, next) {
	const { game } = res.locals;
	try {
		const gameExists = await connection.query(`SELECT * FROM games WHERE name=$1;`, [game.name]);
		if (gameExists.rows[0]) {
			return res.sendStatus(409);
		} else {
			next();
		}
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
}
