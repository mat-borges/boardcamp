import { getCategories, newCategory } from '../controllers/categoriesController.js';

import { Router } from 'express';

const router = Router();

router.get('/categories', getCategories);
router.post('/categories', newCategory);

export default router;
