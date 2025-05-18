import express from 'express';
import { getAllDriversController,getDriverByIdController,deleteDriverController,updateDriverController} from '../controllers/driver.controller.js'


const router = express.Router(); 

/* Removed 
 * authMiddleware
 * for
 * backend test
*/
router.get('/users/drivers', getAllDriversController);  // router.get('/drivers', authMiddleware , getAllDriversController);
router.get('/users/drivers/:email', getDriverByIdController);  // router.get('/drivers/:id', authMiddleware , getDriverByIdController);
router.put('/users/drivers/:id', updateDriverController);  // router.put('/drivers/:id', authMiddleware , updateDriverController);
router.delete('/users/drivers/:id', deleteDriverController);  // router.delete('/drivers/:id', authMiddleware , deleteDriverController);

export default router;