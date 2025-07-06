// admin-user/controller.js

const AdminUser = require('./models');
const bcrypt = require('bcryptjs');

// Create admin user
exports.createAdminUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Basic validation
        if (!name || !email || !password || !role) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await AdminUser.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        res.status(201).json(newUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

// Login
exports.loginAdminUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await AdminUser.findOne({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.json({
            id: user.id,
            name: user.name,
            role: user.role,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all admin users
exports.getAllAdminUsers = async (req, res) => {
    try {
        const users = await AdminUser.findAll({
            attributes: { exclude: ['password'] },
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
