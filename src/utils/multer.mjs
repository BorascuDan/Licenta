import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'thumbnail') {
            cb(null, 'uploads/thumbnails');
        } else if (file.fieldname === 'video') {
            cb(null, 'uploads/videos');
        } else if (file.fieldname === 'profile_pic') {
            cb(null, 'uploads/profile_pics');
        } else if (file.fieldname === 'background_pic') {
            cb(null, 'uploads/background_pics');
        }
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}${ext}`);
    }
})

export const upload = multer({ storage });

