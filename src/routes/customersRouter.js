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
router.post('/customers', newCustomer);
router.put('/customers/:id', updateCustomer);

export default router;
