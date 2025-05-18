import Driver from '../models/Driver.js';

 // this for get all drivers to admin
export const getAllDrivers = async ()=> {
  try {
    const drivers = await Driver.find();
    return { success: true, data: drivers };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getDriverById = async (email) => {
  console.log('email on service',email);
  
  try {
    const driver = await Driver.findOne({ email });
    console.log('driver',driver);
    
    if (!driver) {
      return { success: false, error: 'Driver not found' };
    }

    return { success: true, data: driver };
  } catch (error) {
    return { success: false, error: error.message };
  }
};


export const updateDriver = async (id, data)=> {
  try {
    console.log(id, data)
    const drivers = await Driver.findByIdAndUpdate(id, data, { new: true });
    return drivers 
      ? { success: true, data: drivers } 
      : { success: false, error: 'Update failed' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteDriver = async (id)=> {
  try {
    await Driver.findByIdAndDelete(id);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateAuthCertificatesByEmail = async (email, certificatesData) => {
  try {
    const updatedDriver = await Driver.findOneAndUpdate(
      { email }, // Find driver by email
      { $set: { authCertificates: certificatesData } },
      { new: true }
    );

    if (!updatedDriver) {
      return { success: false, error: "Driver not found" };
    }

    return { success: true, data: updatedDriver };
  } catch (error) {
    return { success: false, error: error.message };
  }
};