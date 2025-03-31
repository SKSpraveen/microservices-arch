
import { 
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../services/user.service.js';


export const getAllUsersController = async (req, res) => {
  const result = await getAllUsers();
  result.success 
    ? res.status(200).json(result.data)
    : res.status(500).json({ error: result.error });
};

export const getUserByIdController = async (req, res) => {
  const { userId } = req.user;
  const result = await getUserById(userId);
  result.success 
    ? res.status(200).json(result.data)
    : res.status(404).json({ error: result.error });
};

export const updateUserController = async (req, res) => {
  const { userId } = req.user;
  const data = req.body;
  const result = await updateUser(userId, data);
  result.success 
    ? res.status(200).json(result.data)
    : res.status(400).json({ error: result.error });
};

export const deleteUserController = async (req, res) => {
  const { userId } = req.user;
  const result = await deleteUser(userId);
  result.success 
    ? res.status(204).send()
    : res.status(500).json({ error: result.error });
};