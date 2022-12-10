import Joi from 'joi';

export const gameSchema = Joi.object({
	name: Joi.string().required().label('name'),
	image: Joi.string().uri().required().label('image'),
	stockTotal: Joi.number().integer().required().label('stockTotal'),
	categoryId: Joi.number().integer().required().label('categoryId'),
	pricePerDay: Joi.number().integer().required().label('pricePerDay'),
});
