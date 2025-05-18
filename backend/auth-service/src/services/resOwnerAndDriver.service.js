// authService.js
import Driver from '../models/driver.model.js';
import RestaurantOwner from '../models/restaurantOwner.js';
import OTP from '../models/OTP.js';
import Session from '../models/session.model.js';
import ApiError from '../utils/ApiError.js';
import { generateOTP } from '../utils/GenerateOTP.js';
import { sendEmail, getOtpEmail } from '../utils/emails.js';
import { generateToken } from '../utils/jwt.js';
import { hashPassword, verifyPassword } from '../utils/bcrypt.js';
import userAgent from 'useragent';

// Helper to get correct model based on role
const getModelByRole = (role) => {
  if (role === 'driver') return Driver;
  if (role === 'restaurantOwner') return RestaurantOwner;
  throw new ApiError(400, 'Invalid role specified');
};

// ========== REGISTER ==========
export const register = async (registrationData) => {
    try {
      const { role, email, password, username, phoneNumber, NIC, address } = registrationData;
      console.log('Role in register:', role);
  
      if (!role) {
        throw new ApiError(400, 'Invalid role.');
      }
      if (!email || !password || !username || !phoneNumber) {
        throw new ApiError(400, 'Missing required fields.');
      }
  
      const Model = getModelByRole(role);
      const existingUser = await Model.findOne({ email });
  
      if (existingUser && existingUser.isActive) {
        throw new ApiError(400, 'This email already exists.');
      } else if (existingUser && !existingUser.isActive) {
        return { success: false, message: 'Inactive account under this email. Activate or use another email.' };
      }
  
      const hashedPassword = (await hashPassword(password)).toString();
      const defaultFields = {
        username,
        email,
        phoneNo: phoneNumber,
        password: hashedPassword,
        isActive: false,
        avatar: 'https://img.rasset.ie/0003696e-500.jpg',
        role,
      };
  
      if (role === 'driver') {
        Object.assign(defaultFields, {
          NIC,
          isAuthorized: false,
          authCertificates: {},
          currentOrder: '',
        });
      } else if (role === 'restaurantOwner') {
        Object.assign(defaultFields, {
          NIC: '',
          address: address || '',
        });
      }
  
      const user = await Model.create(defaultFields);
  
      const otp = (await generateOTP()).toString();
      await OTP.findOneAndUpdate(
        { email: user.email },
        { $set: { email: user.email, otp } },
        { new: true, upsert: true }
      );
  
      await sendEmail(user.email, 'Activate your account', getOtpEmail(otp));
  
      return { success: true, data: user };
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
// ========== ACTIVATE ACCOUNT ==========
export const activateAccount = async (activationData, req, role) => {
    try {
      if (!activationData.email || !activationData.otp) {
        throw new ApiError(400, 'Missing activation data.');
      }
      if (!role) throw new ApiError(400, 'Invalid role.');
  
      const Model = getModelByRole(role);
      const storedOTP = await OTP.findOne({ email: activationData.email });
  
      if (!storedOTP || storedOTP.otp !== activationData.otp) {
        throw new ApiError(400, 'Invalid or expired OTP.');
      }
  
      await OTP.deleteMany({ email: activationData.email });
  
      const user = await Model.findOne({ email: activationData.email });
      if (!user) throw new ApiError(404, `${role} not found.`);
  
      user.isActive = true;
      await user.save();
  
      const token = await generateToken({ id: user._id, email: user.email });
  
      const sessionPayload = {
        userId: user._id,
        token,
        role,
        expiresIn: new Date(Date.now() + 24 * 60 * 60 * 1000),
        ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        deviceInfo: JSON.stringify(userAgent.parse(req.headers['user-agent'])),
      };
  
      const newSession = await Session.findOneAndUpdate(
        { userId: user._id },
        sessionPayload,
        { new: true, upsert: true }
      );
  
      return { success: true, token, role, session: newSession };
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  
  // ========== LOGIN ==========
  export const login = async (emailOrUsername, password, req, role) => {
    try {
      if (!emailOrUsername || !password) {
        throw new ApiError(400, 'Missing login credentials.');
      }
      console.log("Password",password,emailOrUsername);
      

      let user = await Driver.find({email: emailOrUsername});
     console.log("user",user);
     
      if ( !user[0]) {
        console.log("inside user first");
        
        user = await RestaurantOwner.find({email: emailOrUsername});
        if(!user) {
            console.log("inside user");
            
            return { success: false, message: 'no user found'};
        }
      }
  
    //   const Model = getModelByRole(role);
    //   const user = await Model.findOne({
    //     $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    //   });
  
    //   if (!user) throw new ApiError(404, `${role} not found.`);

      const isPasswordValid = await verifyPassword(password, user[0].password);
      console.log(isPasswordValid);
      
      if (!isPasswordValid) throw new ApiError(401, 'Invalid username/email or password.');
  
      if (!user[0].isActive) throw new ApiError(403, 'Activate your account first.');
  
      const deviceInfoString = JSON.stringify(userAgent.parse(req.headers['user-agent']));
      const existingSession = await Session.findOne({ userId: user[0]._id, deviceInfo: deviceInfoString });
  
      if (existingSession && existingSession.expiresIn > Date.now()) {
        return { success: true, message: 'Session already active on this device.', token: existingSession.token, role: user[0].role ,email:user[0].email};
      }
  
      const token = await generateToken({ id: user[0]._id });
  
      const sessionPayload = {
        userId: user[0]._id,
        token,
        role: user[0].role,
        expiresIn: new Date(Date.now() + 24 * 60 * 60 * 1000),
        ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        deviceInfo: deviceInfoString,
      };
  
      const newSession = await Session.findOneAndUpdate(
        { userId: user[0]._id, deviceInfo: deviceInfoString },
        sessionPayload,
        { new: true, upsert: true }
      );
      console.log(user[0])
  
      return { success: true, token, role: user[0].role, session: newSession ,email:user[0].email};
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  
  // ========== RESEND OTP ==========
  export const resendOTP = async (email) => {
    try {
      if (!email) throw new ApiError(400, 'Email is required.');
  
      const otp = (await generateOTP()).toString();
  
      await OTP.findOneAndUpdate(
        { email },
        { $set: { email, otp } },
        { new: true, upsert: true }
      );
  
      await sendEmail(email, 'Activate your account', getOtpEmail(otp));
  
      return { success: true, message: 'A new OTP has been sent to your email.' };
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  
  // ========== EXTEND SESSION ==========
  export const extendSession = async (userId, deviceInfo) => {
    try {
      if (!userId || !deviceInfo) throw new ApiError(400, 'Missing session data.');
  
      const session = await Session.findOne({ userId, deviceInfo });
  
      if (!session || session.expiresIn < Date.now()) {
        throw new ApiError(403, 'Session expired, please log in again.');
      }
  
      session.expiresIn = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      await session.save();
  
      return { success: true, message: 'Session extended successfully.', session };
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  
  // ========== LOGOUT ==========
  export const logout = async (sessionId) => {
    try {
      if (!sessionId) throw new ApiError(400, 'Session ID is required.');
  
      await Session.findByIdAndDelete(sessionId);
  
      return { success: true, message: 'Logged out successfully.' };
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  
  // ========== SIGN OUT ALL ==========
  export const signOut = async (userId) => {
    try {
      if (!userId) throw new ApiError(400, 'User ID is required.');
  
      await Session.deleteMany({ userId });
  
      return { success: true, message: 'Signed out from all devices.' };
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  
  // ========== FORGOT PASSWORD ==========
  export const forgotPassword = async (email, role) => {
    try {
      if (!email || !role) throw new ApiError(400, 'Missing email or role.');
  
      const Model = getModelByRole(role);
      const user = await Model.findOne({ email });
  
      if (!user) throw new ApiError(404, `${role} not found.`);
  
      const otp = (await generateOTP()).toString();
      await OTP.findOneAndUpdate(
        { email },
        { $set: { email, otp } },
        { new: true, upsert: true }
      );
  
      await sendEmail(email, 'Reset your password', getOtpEmail(otp));
  
      return { success: true, message: 'A password reset OTP has been sent to your email.' };
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  
  // ========== RESET PASSWORD ==========
  export const resetPassword = async (password, email, otp, role) => {
    try {
      if (!password || !email || !otp || !role) {
        throw new ApiError(400, 'Missing reset data.');
      }
  
      const Model = getModelByRole(role);
      const storedOTP = await OTP.findOne({ email });
  
      if (!storedOTP || storedOTP.otp !== otp) {
        throw new ApiError(400, 'Invalid or expired OTP.');
      }
  
      await OTP.deleteMany({ email });
  
      const user = await Model.findOne({ email });
      if (!user) throw new ApiError(404, `${role} not found.`);
      if (!user.isActive) throw new ApiError(403, 'Activate your account first.');
  
      user.password = (await hashPassword(password)).toString();
      await user.save();
  
      return { success: true, message: 'Password reset successfully.' };
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  
  // ========== REACTIVATE ACCOUNT ==========
  export const reactivateAccount = async (email) => {
    try {
      if (!email) throw new ApiError(400, 'Email is required.');
  
      const otp = (await generateOTP()).toString();
  
      await OTP.findOneAndUpdate(
        { email },
        { $set: { email, otp } },
        { new: true, upsert: true }
      );
  
      await sendEmail(email, 'Reactivate your account', getOtpEmail(otp));
  
      return { success: true, message: 'A reactivation OTP has been sent to your email.' };
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
