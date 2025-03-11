const User = require('./auth_model'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function register(name, email, password) {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });

  return { message: 'User registered successfully', user };
}

async function signIn(email, password) {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error('User not found');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid password');
  }

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

  return { token };
}

// ✅ Correctly export functions
module.exports = { register, signIn };
