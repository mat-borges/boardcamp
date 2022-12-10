import { connection } from '../db/db.js';

export async function getCustomers(req, res) {
	const { cpf } = req.query;

	try {
		let customers;
		if (cpf) {
			const filter = `${cpf}%`;
			customers = await connection.query('SELECT * FROM customers WHERE cpf ILIKE $1;', [filter]);
		} else {
			customers = await connection.query('SELECT * FROM customers;');
		}
		res.send(customers.rows);
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
}

export async function getCustomerById(req, res) {
	const { id } = req.params;
	try {
		const customer = await connection.query('SELECT * FROM customers WHERE id=$1;', [id]);

		if (!customer.rows[0]) return res.sendStatus(404);

		res.send(customer.rows[0]);
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
}

export async function newCustomer(req, res) {
	const { name, phone, cpf, birthday } = res.locals.customer;

	try {
		await connection.query('INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);', [
			name,
			phone,
			cpf,
			birthday,
		]);
		res.sendStatus(201);
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
}

export async function updateCustomer(req, res) {
	const { name, phone, cpf, birthday } = res.locals.customer;
	const id = Number(req.params.id);

	try {
		await connection.query('UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id=$5;', [
			name,
			phone,
			cpf,
			birthday,
			id,
		]);
		res.sendStatus(201);
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
}
