import {
  register,
  activateAccount,
  login,
  resendOTP,
  logout,
  signOut,
  forgotPassword,
  reactivateAccount,
  resetPassword,
} from '../services/driver.service.js';

export const registerController = async (req, res) => {
  try {
    const { success, data, message } = await register(req.body);
    if (!success) return res.status(400).json({ success, message });
    return res.status(201).json({ success: true, data });
  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

export const activateAccountController = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const { success, token, session, message } = await activateAccount({ email, otp }, req);
    if (!success) return res.status(400).json({ success, message });
    res.cookie("session", session, {
      httpOnly: true,
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, 
  });
    return res.status(200).json({ success: true, token, session });
  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

export const loginController = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    const { success, token, session, message } = await login(emailOrUsername, password, req);

    if (message === 'Session already active on this device') {
      return res.status(200).json({ message });
    }

    if (!success) {
      return res.status(400).json({ success, message });
    }

    res.cookie("session", session, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ success: true, token, session });
  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

export const resendOTPController = async (req, res) => {
  try {
    const { email } = req.body;
    const { success, message } = await resendOTP(email);
    if (!success) return res.status(400).json({ success, message });
    return res.status(200).json({ success: true, message });
  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

export const extendSessionController = async (req, res, next) => {
  try {
    const { userId } = req.user; 
    const deviceInfo = JSON.stringify(req.headers['user-agent']);
    const { success, message, session } = await services.auth.extendSession(userId, deviceInfo);
    if (!success) return res.status(400).json({ success, message });
    return res.status(200).json({ success: true, session });
  } catch (error) {
    next(error);
  }
};

export const logoutController = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const { success, message } = await logout(sessionId);
    if (!success) return res.status(400).json({ success, message });
    return res.status(200).json({ success: true, message });
  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

export const signOutController = async (req, res) => {
  try {
    const { userId } = req.user;
    const { success, message } = await signOut(userId);
    if (!success) return res.status(400).json({ success, message });
    return res.status(200).json({ success: true, message });
  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

export const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    const { success, message } = await forgotPassword(email);
    if (!success) return res.status(400).json({ success, message });
    return res.status(200).json({ success: true, message });
  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

export const reactivateAccountController = async (req, res) => {
  try {
    const { email } = req.body;
    const { success, message } = await reactivateAccount(email);
    if (!success) return res.status(400).json({ success, message });
    return res.status(200).json({ success: true, message });
  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

export const resetPasswordController = async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    const { success, message } = await resetPassword(password, email, otp  );
    if (!success) return res.status(400).json({ success, message });
 
    return res.status(200).json({ success: true});
  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

export const checkAuthController = async (req, res) => {
  try {
    if(req.user) {
      console.log(req.user)
      return res.status(200).json({isAuthenticated: true})
    }

    return res.status(403).json({isAuthenticated: false})
  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

export const refreshTokenController = async (req, res) => {
  try {
    const { refreshToken } = req.cookies; 

    if (!refreshToken) {
      return res.status(401).json({ success: false, message: "No refresh token found." });
    }

    const { success, token, message } = await refreshTokenHandler(refreshToken);

    if (!success) {
      return res.status(401).json({ success, message });
    }

    res.cookie("session", token, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ success: true, token });
  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};