import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });
    if (user) {
      const token = generateToken(user._id);
      const userData = { _id: user._id, name: user.name, email: user.email };
      
      const isProd = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';
      res.cookie('token', token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });
      
      res.cookie('user', JSON.stringify(userData), {
        httpOnly: false, // Let client read this to show "Hello Name"
        secure: isProd,
        sameSite: isProd ? 'none' : 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000
      });

      res.status(201).json({ ...userData, token });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);
      const userData = { _id: user._id, name: user.name, email: user.email };

      const isProd = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';
      res.cookie('token', token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000
      });
      
      res.cookie('user', JSON.stringify(userData), {
        httpOnly: false,
        secure: isProd,
        sameSite: isProd ? 'none' : 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000
      });

      res.json({ ...userData, token });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logoutUser = (req, res) => {
  const isProd = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';
  res.cookie('token', '', { httpOnly: true, secure: isProd, sameSite: isProd ? 'none' : 'strict', expires: new Date(0) });
  res.cookie('user', '', { httpOnly: false, secure: isProd, sameSite: isProd ? 'none' : 'strict', expires: new Date(0) });
  res.status(200).json({ message: 'Logged out successfully' });
};
