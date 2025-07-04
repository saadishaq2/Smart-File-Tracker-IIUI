import multer from 'multer';

const storage = multer.memoryStorage();

const fileUpload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 2 // 2MB max
    },
    fileFilter: (req, file, cb) => {
        const allowed = ['application/pdf', 'image/png', 'image/jpeg'];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only PDF, PNG, JPEG allowed"));
        }
    }
});

export default fileUpload
