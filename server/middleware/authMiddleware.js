const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Consumer = require('../models/Consumer');

// const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) return res.status(401).json({ message: 'Access Denied' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.consumer = verified;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid Token' });
    }
};

///// 

const protect = async(req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.admin = await Admin.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};


const authMiddleware = async(req, res, next) => {
    let token;

    // Check if the Authorization header exists and starts with Bearer
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]; // Extract token
            const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token

            // Check if user is Admin or Consumer
            const admin = await Admin.findById(decoded.id).select('-password');
            const consumer = await Consumer.findById(decoded.id).select('-password');

            if (admin) {
                req.user = admin; // Assign admin user
            } else if (consumer) {
                req.user = consumer; // Assign consumer user
            } else {
                return res.status(404).json({ message: 'User not found' });
            }

            next(); // Move to next middleware/controller
        } catch (error) {
            console.error('Token verification failed:', error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// module.exports = authMiddleware;

module.exports = { protect, authMiddleware };