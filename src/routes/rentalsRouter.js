import { deleteRental, getRentals, newRental, returnRental } from '../controllers/rentalsControllers.js';
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
router.delete('/rentals/:id', deleteRental);

export default router;
