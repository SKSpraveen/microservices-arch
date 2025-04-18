
import { 
  getAllDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
} from '../services/driver.service.js';


export const getAllDriversController = async (req, res) => {
  const result = await getAllDrivers();
  result.success 
    ? res.status(200).json(result.data)
    : res.status(500).json({ error: result.error });
};

export const getDriverByIdController = async (req, res) => {
  const { id } = req.params;
  const result = await getDriverById(id);
  result.success 
    ? res.status(200).json(result.data)
    : res.status(404).json({ error: result.error });
};

export const updateDriverController = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const result = await updateDriver(id, data);
  result.success 
    ? res.status(200).json(result.data)
    : res.status(400).json({ error: result.error });
};

export const deleteDriverController = async (req, res) => {
  const { id } = req.params;
  const result = await deleteDriver(id);
  result.success 
    ? res.status(204).send()
    : res.status(500).json({ error: result.error });
};