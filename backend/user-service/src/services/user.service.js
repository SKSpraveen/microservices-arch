import User from '../models/User.js';


export const getAllUsers = async () => {
  try {
    const users = await User.find();
    if(!users || users.length === 0) {
      return { success: true, error: 'No users found' };
    }
    return { success: true, data: users };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getUserById = async (id) => {
  try {
    const user = await User.findById(id);
    return user 
      ? { success: true, data: user } 
      : { success: false, error: 'User not found' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateUser = async (id, data) => {
  console.log(id, data);
  try {
    const user = await User.findByIdAndUpdate(id, data, { new: true });
    console.log(user);
    return user 
      ? { success: true, data: user } 
      : { success: false, error: 'Update failed' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteUser = async (id) => {
  try {
    await User.findByIdAndDelete(id);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};