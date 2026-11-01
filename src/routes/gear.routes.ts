import { Router } from 'express';
import * as GearController from '../controllers/gear.controller';

const router = Router();
router.get('/gear-categories', GearController.listCategories);
router.get('/gear-items', GearController.listGear);
router.get('/gear-items/:id', GearController.getGear);
router.post('/gear-items', GearController.createGear);
router.put('/gear-items/:id', GearController.updateGear);
router.delete('/gear-items/:id', GearController.deleteGear);
export default router;
