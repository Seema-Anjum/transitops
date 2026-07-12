const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );
};

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role });

    const token = generateToken(user);
    res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const Lock_time = 10 * 60 * 1000; // 10 minutes in milliseconds
const Max_attempts = 5;

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

     // check if account is currently locked 
     if(user.isLocked && user.lockUntil && user.lockUntil > new Date()) {
        const minutesLeft = Math.ceil((user.lockUntil - new Date()) / 60000);
        return res.status(403).json({
            message: `Account is locked due to too many  failed attempts. Please try again in ${minutesLeft} minute(s).`,
        });
     }

     // Lock has expired naturally -reset it
     if(user.isLocked && user.lockUntil && user.lockUntil <= new Date()) {
        user.isLocked = false;
        user.failedLoginAttempts = 0;
        user.lockUntil = null;
     }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        user.failedLoginAttempts += 1;

        if (user.failedLoginAttempts >= Max_attempts) {
            user.isLocked = true;
            user.lockUntil = new Date(Date.now() + Lock_time);
            await user.save();
            return res.status(403).json({
                message: `Account is locked due to too many failed attempts. Please try again in ${Math.ceil(Lock_time / 60000)} minute(s).`
            });
        }
        await user.save();
        return res.status(400).json({
             message: `Invalid credentials. ${Max_attempts - user.failedLoginAttempts} attempt(s) remaining.`,
     });
    }

    // successful login - reset counters
    user.failedLoginAttempts = 0;
    user.isLocked = false;
    user.lockUntil = null;
    await user.save();

    const token = generateToken(user);
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login };