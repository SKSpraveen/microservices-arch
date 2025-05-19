import express from 'express';
import { getAllUsersController,getUserByIdController,deleteUserController,updateUserController, getUserByIdPrController} from '../controllers/user.controller.js'
import authGuard from '../middleware/auth.middleware.js';


const router = express.Router(); 

/* Removed 
 * authMiddleware
 * for
 * backend test
*/
router.get('/users/all', getAllUsersController);  // router.get('/users', authMiddleware , getAllUsersController);
router.get('/users/',authGuard , getUserByIdController);  // router.get('/users/:id', authMiddleware , getUserByIdController);
router.get('/users/:id' , getUserByIdPrController);  // router.get('/users/:id', authMiddleware , getUserByIdController);
router.put('/users/:userId', updateUserController);  // router.put('/users/:id', authMiddleware , updateUserController);
router.delete('/users/', authGuard, deleteUserController);  // router.delete('/users/:id', authMiddleware , deleteUserController);

export default router;