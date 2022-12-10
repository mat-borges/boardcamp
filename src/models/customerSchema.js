import DateExtension from '@joi/date';
import JoiImport from 'joi';

const Joi = JoiImport.extend(DateExtension);

export const customerSchema = Joi.object({
	name: Joi.string().required().label('name'),
	phone: Joi.string()
		.min(10)
		.max(11)
		.pattern(/^[0-9]{10,11}$/, 'phone')
		.required()
		.label('phone'),
	cpf: Joi.string()
		.length(11)
		.pattern(/^[0-9]{3}[0-9]{3}[0-9]{3}[0-9]{2}$/, 'cpf')
		.required()
		.label('cpf'),
	birthday: Joi.date().format('YYYY-MM-DD').required().label('birthday'),
});
