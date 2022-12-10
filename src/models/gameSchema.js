import Joi from 'joi';

export const gameSchema = Joi.object({
	name: Joi.string().required(),
	image: Joi.string().uri().required(),
	stockTotal: Joi.number().integer().required(),
	categoryId: Joi.number().integer().required(),
	pricePerDay: Joi.number().integer().required(),
});
