import { checkCategory, checkGame, validateGameSchema } from '../middlewares/gameValidationsMiddleware.js';
import { getGames, newGame } from '../controllers/gamesController.js';

import { Router } from 'express';

const router = Router();

router.get('/games', getGames);
router.post('/games', validateGameSchema, checkCategory, checkGame, newGame);

export default router;
