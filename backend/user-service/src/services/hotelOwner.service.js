import HotelOwner from '../models/HotelOwner.js';

export const getAllHotelOwner = async () => {
  try {
    const hotelOwners = await HotelOwner.find({}).populate('_id');
    if (!hotelOwners || hotelOwners.length === 0) {
      return { success: true, error: 'No hotel owners found' };
    }
    console.log(hotelOwners);
    return { success: true, data: hotelOwners };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getHotelOwnerById = async (id) => {
  try {
    const hotelOwners = await HotelOwner.findById(id);
    return hotelOwners 
      ? { success: true, data: hotelOwners } 
      : { success: false, error: 'User not found' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateHotelOwner = async (id, data) => {
  try {
    const hotelOwners = await HotelOwner.findByIdAndUpdate(id, data, { new: true });
    return hotelOwners 
      ? { success: true, data: hotelOwners } 
      : { success: false, error: 'Update failed' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteHotelOwner = async (id) => {
  try {
    await HotelOwner.findByIdAndDelete(id);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};