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
	} else {
		res.locals.customer = customer;

		next();
	}
}

export async function checkCpf(req, res, next) {
	const { customer } = res.locals;
	const id = Number(req.params.id);

	try {
		const cpfExists = await connection.query('SELECT * FROM customers WHERE cpf=$1', [customer.cpf]);
		if (cpfExists.rows[0] && cpfExists.rows[0].id !== id) {
			return res.status(409).send({ message: 'Já existe um cliente registrado com esse CPF' });
		} else {
			next();
		}
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
}
