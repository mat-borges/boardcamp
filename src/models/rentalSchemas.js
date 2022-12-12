import Joi from 'joi';

export const newRentalsSchema = Joi.object({
	customerId: Joi.number().integer().required().label('customerId'),
	gameId: Joi.number().integer().required().label('gameId'),
	daysRented: Joi.number().integer().greater(0).required().label('daysRented'),
});
