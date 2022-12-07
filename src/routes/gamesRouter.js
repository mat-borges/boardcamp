import { getGames, newGame } from '../controllers/gamesController.js';

import { Router } from 'express';

const router = Router();

router.get('/games', getGames);
router.post('/games', newGame);

export default router;
