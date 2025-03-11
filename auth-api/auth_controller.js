const authService = require('./auth_service');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const response = await authService.register(name, email, password);
    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await authService.signIn(email, password);
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
