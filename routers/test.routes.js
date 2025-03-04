const express = require('express');
const { addTest, fetchAllTest, fetchSingleTest, updateTest, deleteTest } = require('../controllers/test.controllers');
const router = express.Router()
// const multer = require('multer');
// const path = require('path')


// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads');
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname)
//         )
//     }
// });

// const upload = multer({
//     storage: storage,
//     fileFilter: function (req, file, cb) {
//         const fileTypes = /jpeg|jpg|png|gif/;
//         const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
//         const mimetype = fileTypes.test(file.mimetype);
//         if (extname && mimetype) {
//             return cb(null, true)
//         }
//         cb('Error:Images are allowed' + fileTypes)

//     }
// })


// create new test
router.post('/', addTest);

// fetch all tests
router.get('/', fetchAllTest);

// fetch single test
router.get('/:id', fetchSingleTest)

// update single test
router.put('/:id', updateTest)

// delete test
router.delete('/:id', deleteTest)

module.exports = router;