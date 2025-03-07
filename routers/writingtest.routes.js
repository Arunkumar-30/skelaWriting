const express = require('express')

const { addTask, fetchAllTask, fetchSingleTask, updateTask, deleteTask } = require('../controllers/writingtest.controllers')
const router = express.Router();
const multer = require('multer');
const path = require('path')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname)
        )
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        const fileTypes = /jpeg|jpg|svg|png|gif|avif/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true)
        }
        cb('Error:Images are allowed' + fileTypes)

    }
})



// create a new task
router.post('/', upload.single('imageUrl'), (req, res, next) => {
    if (req.fileValidationError) {
        return res.status(404).json({ message: fileValidationError })
    }
    next()
}, addTask);


// all task view
router.get('/', fetchAllTask)

// fetch single task
router.get('/:id', fetchSingleTask)

// update task
router.put('/:id', upload.single('imageUrl'), (req, res, next) => {
    if (req.fileValidationError) {
        return res.status(404).json({ message: fileValidationError })
    }
    next();
}, updateTask)

// delete task
router.delete('/:id', deleteTask)





module.exports = router;