import { cleanStringData } from '../server.js';
import { connection } from '../db/db.js';
import { customerSchema } from '../models/customerSchema.js';

export async function validateCustomerSchema(req, res, next) {
	const { name, phone, cpf, birthday } = req.body;
	const customer = {
		name: cleanStringData(name),
		phone: cleanStringData(phone),
		cpf: cleanStringData(cpf),
		birthday: cleanStringData(birthday),
	};

	const { error } = customerSchema.validate(customer, { abortEarly: false });
	if (error) {
		const errors = error.details.map((detail) => detail.message);
		return res.status(400).send({ message: errors });
	}

	try {
		const cpfExists = await connection.query('SELECT * FROM customers WHERE cpf=$1', [customer.cpf]);
		if (cpfExists.rows[0]) {
			return res.status(402).send({ message: 'Já existe um cliente registrado com esse CPF' });
		} else {
			res.locals.customer = customer;

			next();
		}
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
}
