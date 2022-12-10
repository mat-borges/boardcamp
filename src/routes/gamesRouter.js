import { getGames, newGame } from '../controllers/gamesController.js';

import { Router } from 'express';
import { validateGameSchema } from '../middlewares/gameSchemaValidation.js';

const router = Router();

router.get('/games', getGames);
router.post('/games', validateGameSchema, newGame);

export default router;
