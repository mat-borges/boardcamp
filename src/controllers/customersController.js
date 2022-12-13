import { connection } from '../db/db.js';

export async function getCustomers(req, res) {
	const { cpf } = req.query;
	const limit = parseInt(req.query.limit);
	const offset = parseInt(req.query.offset);

	function queryStrings() {
		let filter;
		if (cpf) {
			filter = `${cpf}%`;
		}

		if (cpf && limit && offset) {
			return {
				string: `SELECT * FROM customers WHERE cpf ILIKE $1 LIMIT $2 OFFSET $3;`,
				params: [filter, limit, offset],
			};
		} else if (cpf && limit) {
			return {
				string: `SELECT * FROM customers WHERE cpf ILIKE $1 LIMIT $2;`,
				params: [filter, limit],
			};
		} else if (cpf && offset) {
			return {
				string: `SELECT * FROM customers WHERE cpf ILIKE $1 OFFSET $2;`,
				params: [filter, offset],
			};
		} else if (cpf) {
			return {
				string: `SELECT * FROM customers WHERE cpf ILIKE $1;`,
				params: [filter],
			};
		} else if (limit && offset) {
			return {
				string: `SELECT * FROM customers ORDER BY id LIMIT $1 OFFSET $2;`,
				params: [limit, offset],
			};
		} else if (limit) {
			return {
				string: `SELECT * FROM customers ORDER BY id LIMIT $1 ;`,
				params: [limit],
			};
		} else if (offset) {
			return {
				string: `SELECT * FROM customers ORDER BY id OFFSET $1 ;`,
				params: [offset],
			};
		} else {
			return { string: 'SELECT * FROM customers ORDER BY id;', params: [] };
		}
	}

	try {
		const customers = await connection.query(`${queryStrings().string}`, queryStrings().params);
		const rentals = await connection.query('SELECT * FROM rentals;');

		let countRentals = [];
		for (let customer of customers.rows) {
			let rentalsCount = 0;
			for (let rental of rentals.rows) {
				if (customer.id === rental.gameId) {
					rentalsCount++;
				}
			}
			countRentals.push({ ...customer, rentalsCount });
		}
		res.send(countRentals);
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
