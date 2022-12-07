import { deleteRental, getRentals, newRental, returnRental } from '../controllers/rentalsControllers.js';

import { Router } from 'express';

const router = Router();

router.get('/rentals', getRentals);
router.post('/rentals', newRental);
router.post('/rentals/:id/return', returnRental);
router.delete('/rentals/:id', deleteRental);

export default router;
