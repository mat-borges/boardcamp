import {
	deleteRental,
	getMetrics,
	getRentals,
	newRental,
	returnRental,
} from '../controllers/rentalsController.js';
import {
	gameCustomerExists,
	rentalExists,
	rentalSchemaValidation,
} from '../middlewares/rentalValidationsMiddleware.js';

import { Router } from 'express';

const router = Router();

router.get('/rentals', getRentals);
router.post('/rentals', rentalSchemaValidation, gameCustomerExists, newRental);
router.post('/rentals/:id/return', rentalExists, returnRental);
router.delete('/rentals/:id', rentalExists, deleteRental);
router.get('/rentals/metrics', getMetrics);

export default router;
