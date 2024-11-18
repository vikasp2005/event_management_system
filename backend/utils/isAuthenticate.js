export const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        return next();
    }
    return res.status(401).json({ message: 'Unauthorized' });
};

export const authorizeRole = (role) => (req, res, next) => {
    if (req.session.role === role) {
        return next();
    }
    return res.status(403).json({ message: 'Forbidden: Access denied' });
};
