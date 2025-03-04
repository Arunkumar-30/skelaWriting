
const testControllers = require('../models/test.model');


// add new test controller
const addTest = async (req, res) => {
    try {
        const { title, description, duration } = req.body;
        // const image = req.file ? `/uploads/${req.file.filename}` : null;
        const test = await testControllers.create({
            title,
            description,
            duration,
        });
        res.status(201).json(test);
    } catch (error) {
        console.error('error :', error);
        res.status(500).json({ error: error.message })
    }
}

// fetch all tests
const fetchAllTest = async (req, res) => {
    try {
        const test = await testControllers.findAll();
        res.status(201).json(test)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// fetch single test
const fetchSingleTest = async (req, res) => {
    try {
        const { id } = req.params;
        const test = await testControllers.findByPk(id);
        if (!test) {
            return res.status(404).json({ message: 'Test id not found' })
        }
        res.status(201).json(test)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// update test single
const updateTest = async (req, res) => {
    try {
        const { id } = req.params;
        const testData = req.body;
        const test = await testControllers.update(testData, { where: { id } })
        if (!test) {
            return res.status(404).json({ message: 'update test not found' })
        }
        res.status(201).json({ test, message: 'update successfully' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// delete test
const deleteTest = async (req, res) => {
    try {
        const { id } = req.params;
        const test = await testControllers.destroy({ where: { id } });
        if (!test) {
            return res.status(404).json({ message: 'Id is not found' })
        }
        res.status(201).json({ message: 'Delete test successfully' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = { addTest, fetchAllTest, fetchSingleTest, updateTest, deleteTest }