import { checkCpf, validateCustomerSchema } from '../middlewares/customerValidationsMiddleware.js';
import {
	getCustomerById,
	getCustomers,
	newCustomer,
	updateCustomer,
} from '../controllers/customersControllers.js';

import { Router } from 'express';

const router = Router();

router.get('/customers', getCustomers);
router.get('/customers/:id', getCustomerById);
router.post('/customers', validateCustomerSchema, checkCpf, newCustomer);
router.put('/customers/:id', validateCustomerSchema, checkCpf, updateCustomer);

export default router;
