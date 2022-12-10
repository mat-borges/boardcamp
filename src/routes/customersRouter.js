import {
	getCustomerById,
	getCustomers,
	newCustomer,
	updateCustomer,
} from '../controllers/customersControllers.js';

import { Router } from 'express';
import { validateCustomerSchema } from '../middlewares/customerSchemaValidation.js';

const router = Router();

router.get('/customers', getCustomers);
router.get('/customers/:id', getCustomerById);
router.post('/customers', validateCustomerSchema, newCustomer);
router.put('/customers/:id', updateCustomer);

export default router;
