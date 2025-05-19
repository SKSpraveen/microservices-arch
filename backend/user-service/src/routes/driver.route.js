import express from 'express';
import { getAllDriversController,getDriverByIdController,deleteDriverController,updateDriverController, updateAuthCertificatesByEmailController} from '../controllers/driver.controller.js'
import Driver from '../models/Driver.js';


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
router.put('/users/drivers/addVehicle/:email',updateAuthCertificatesByEmailController)
router.post("/users/drivers/update-driver-location", async (req, res) => {
  const { driverId, location } = req.body;

  if (!driverId || !location || !location.lat || !location.lng) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    const updated = await Driver.findByIdAndUpdate(
      { _id: driverId },
      {  currentLocation: location  },
      {new: true}
    );

    res.json({ message: 'Location updated successfully' });
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


export default router;