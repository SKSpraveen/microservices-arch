
import Driver from '../models/Driver.js';
import { 
  getAllDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
  updateAuthCertificatesByEmail,
} from '../services/driver.service.js';


export const getAllDriversController = async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.status(200).json({ success: true, data: drivers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


export const getDriverByIdController = async (req, res) => {
  const { email } = req.params;
  console.log('email on controller',email);
  
  if (!email) {
    return res.status(400).json({ success: false, error: 'Email is required' });
  }

  const result = await getDriverById(email);

  if (result.success) {
    return res.status(200).json({ success: true, data: result.data });
  } else {
    return res.status(404).json({ success: false, error: result.error });
  }
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

export const updateAuthCertificatesByEmailController = async (req, res) => {
  const { email } = req.params;
  const { insuranceImage, licenseImage, licensePlateNumber,vehicleType,vehicleImage } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, error: "Email is required" });
  }

  const certificatesData = { insuranceImage, licenseImage, licensePlateNumber,vehicleType,vehicleImage };

  const result = await updateAuthCertificatesByEmail(email, certificatesData);

  if (result.success) {
    return res.status(200).json({ success: true, data: result.data });
  } else {
    return res.status(404).json({ success: false, error: result.error });
  }
};
