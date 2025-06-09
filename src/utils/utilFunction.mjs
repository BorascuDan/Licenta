import jwt from "jsonwebtoken";

export function sendJsonResponse(res, success, status, message, data) {
    res.status(status).json({ success: success, message: message, data: data });
}

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return sendJsonResponse(res, false, 401, "Access denied", null);
    }
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    
      if (err) {
        return sendJsonResponse(res, false, 403, "Invalid or expired token", null);
        console.log('invalidule')
      }
      
      req.user = user;
      next();
    });
  };

  export function shufle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}