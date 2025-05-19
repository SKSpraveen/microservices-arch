import User from '../models/User.js';
import OTP from '../models/OTP.js';
import Session from '../models/session.model.js';
import ApiError from '../utils/ApiError.js';
import { generateOTP } from '../utils/GenerateOTP.js';
import { sendEmail, getOtpEmail, getLinkEmail } from '../utils/emails.js';
import { generateToken, verifyToken } from '../utils/jwt.js';
import { hashPassword, verifyPassword } from '../utils/bcrypt.js';
import userAgent from 'useragent';

export const register = async (registrationData) => {
  try {
    
    if (
      !registrationData ||
      !registrationData.address ||
      !registrationData.email ||
      !registrationData.password ||
      !registrationData.phoneNumber ||
      !registrationData.username
    ) {
      throw new ApiError(400, 'Required data fields are missing');
    }

    const hashedPassword = (await hashPassword(registrationData.password)).toString();
    const isActive = false;
    const alergy = []; 
    const avatar = 'https://img.rasset.ie/0003696e-500.jpg'; 

    const existingUser = await User.findOne({ email: registrationData.email });
    if (existingUser && existingUser.isActive) {
      throw new ApiError(400, 'This email already exists');
    } else if (existingUser && !existingUser.isActive) {
      return { success: false, message: 'There is an inactive account under this email. Activate it or try with a new email.' };
    }

    const user = await User.create({
      username: registrationData.username,
      email: registrationData.email,
      address: registrationData.address,
      phoneNo: registrationData.phoneNumber,
      isActive,
      alergy,
      password: hashedPassword,
      avatar,
    });

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

export const activateAccount = async (activationData, req) => {
  try {
    const storedOTP = await OTP.findOne({ email: activationData.email });
    if (!storedOTP || storedOTP.otp !== activationData.otp) {
      return { success: false, message: 'Invalid or expired OTP' };
    }

    await OTP.deleteMany({ email: activationData.email });

    const user = await User.findOne({ email: activationData.email });
    if (!user) throw new ApiError(404, 'User not found');
    user.isActive = true;
    await user.save();

    const token = await generateToken({ id: user._id, email: user.email });
    const sessionPayload = {
      userId: user._id,
      token,
      expiresIn: new Date(Date.now() + 24 * 60 * 60 * 1000),
      ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      deviceInfo: JSON.stringify(userAgent.parse(req.headers['user-agent'])),
    };

    const newSession = await Session.findOneAndUpdate(
      { userId: user._id },
      sessionPayload,
      { new: true, upsert: true }
    );

    return { success: true, token, session: newSession };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const login = async (emailOrUsername, password, req) => {
  try {
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });
    if (!user) return { success: false, message: 'User not found' };
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) return { success: false, message: 'Invalid username or password' };
    if (!user.isActive) return { success: false, message: 'Please activate your account before logging in' };
    const existingSession = await Session.findOne({
      userId: user._id,
      deviceInfo: JSON.stringify(userAgent.parse(req.headers['user-agent'])),
    });
    console.log(1);
    
    // if (existingSession && existingSession.expiresIn > Date.now()) {
    //   return { success: true, message: 'Session already active on this device' };
    // }
    console.log(1);
    const token = await generateToken({ userId: user._id });
    
    
    const sessionPayload = {
      userId: user._id,
      token,
      expiresIn: new Date(Date.now() + 24 * 60 * 60 * 1000),
      ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      deviceInfo: JSON.stringify(userAgent.parse(req.headers['user-agent'])),
    };

    const newSession = await Session.findOneAndUpdate(
      { userId: user._id },
      sessionPayload,
      { new: true, upsert: true }
    );

    return { success: true, token, session: newSession, data:user };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const resendOTP = async (email) => {
  try {
    let otp = await generateOTP();
    otp = otp.toString();

    await OTP.findOneAndUpdate(
      { email },
      { $set: { email, otp } },
      { new: true, upsert: true }
    );

    await sendEmail(email, "Activate your account", getOtpEmail(otp));

    return {
      success: true,
      message: "A new OTP has been sent to your email.",
    };
  } catch (error) {
    console.error(error);
    throw new ApiError(500, "Failed to resend OTP");
  }
};

export const extendSession = async (userId, deviceInfo) => {
  try {
    const session = await Session.findOne({ userId, deviceInfo });

    if (!session || session.expiresIn < Date.now()) {
      return { success: false, message: "Session expired, please log in again." };
    }

    session.expiresIn = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000 ); 
    await session.save();

    return {
      success: true,
      message: "Session extended successfully.",
      session,
    };
  } catch (error) {
    console.error(error);
    throw new ApiError(500, "Failed to extend session");
  }
};

export const logout = async (sessionId) => {
  try {
    await Session.findByIdAndDelete(sessionId);

    return {
      success: true,
      message: "Logged out successfully.",
    };
  } catch (error) {
    console.error(error);
    throw new ApiError(500, "Failed to log out");
  }
};

export const signOut = async (userId) => {
  try {
    await Session.deleteMany({ userId });

    return {
      success: true,
      message: "Signed out from all devices.",
    };
  } catch (error) {
    console.error(error);
    throw new ApiError(500, "Failed to sign out from all devices");
  }
};


export const forgotPassword = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return { success: false, message: "User not found." };
    }

    const otp = (await generateOTP()).toString();
    await OTP.findOneAndUpdate(
      { email: user.email },
      { $set: { email: user.email, otp } },
      { new: true, upsert: true }
    );
    await sendEmail(user.email, 'Activate your account', getOtpEmail(otp));


    return {
      success: true,
      message: "A password reset link has been sent to your email.",
    };
  } catch (error) {
    console.error(error);
    throw new ApiError(500, "Failed to process forgot password request");
  }
};

export const resetPassword = async (password, email, otp)  => {
  try {
    console.log(password, email, otp)
    const storedOTP = await OTP.findOne({ email: email });
    if (!storedOTP || storedOTP.otp !== otp) {
      return { success: false, message: 'Invalid or expired OTP' };
    }

    await OTP.deleteMany({ email: email });

    
    const user  = await User.findOne({email: email})
    if (!user) {
      return { success : false, 'message': 'user not find'}
    }

    console.log('hello world');
    

    if (!user.isActive) return { success : false, 'message': 'uActivate your account first'}

    user.password = (await hashPassword(password)).toString();

    user.save();
    return { success : true, 'message': 'password reset successfully'}
  } catch (error) {
    console.error(error.message)
  }
}

export const reactivateAccount = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    let otp = await generateOTP();
    otp = otp.toString();

    await OTP.findOneAndUpdate(
      { email },
      { $set: { email, otp } },
      { new: true, upsert: true }
    );

    await sendEmail(email, "Reactivate your account", getOtpEmail(otp));

    return {
      success: true,
      message: "A reactivation email has been sent to your email.",
    };
  } catch (error) {
    console.error(error);
    throw new ApiError(500, "Failed to reactivate account");
  }
};