import { deleteRental, getRentals, newRental, returnRental } from '../controllers/rentalsControllers.js';
import { gameCustomerExists, rentalSchemaValidation } from '../middlewares/rentalValidationsMiddleware.js';

import { Router } from 'express';

const router = Router();

router.get('/rentals', getRentals);
router.post('/rentals', rentalSchemaValidation, gameCustomerExists, newRental);
router.post('/rentals/:id/return', returnRental);
router.delete('/rentals/:id', deleteRental);

export default router;
