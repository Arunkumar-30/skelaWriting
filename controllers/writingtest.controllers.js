const taskControllers = require('../models/writingtest.model');


const addTask = async (req, res) => {
    try {
        const { testId, taskType, prompt } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
        if (!testId || !taskType || !prompt) {
            return res.status(404).json({ message: 'testId,tasktype,prompt are required' })
        }
        const task = await taskControllers.create({
            testId,
            taskType,
            prompt,
            imageUrl
        })
        res.status(201).json(task)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

// fetch all tasks
const fetchAllTask = async (req, res) => {
    try {
        const task = await taskControllers.findAll();
        res.status(201).json(task)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// fetch single task
const fetchSingleTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await taskControllers.findByPk(id)
        if (!task) {
            return res.status(404).json({ message: 'task id not found' })
        }
        res.status(201).json(task)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// update task 
const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const taskID = await taskControllers.findByPk(id);
        if (!taskID) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const { testId, taskType, prompt } = req.body;
        const imageUrl = req.file ? req.file.path : taskID.imageUrl;

        const updatedTask = await taskControllers.update(
            {
                testId,
                taskType,
                prompt,
                imageUrl
            },
            { where: { id } }
        );

        if (updatedTask[0] === 0) {
            return res.status(404).json({ message: 'Task ID not found or nothing to update' });
        }
        return res.status(200).json({ message: 'Task updated successfully', task: { id, testId, taskType, prompt, imageUrl } });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

// delete task
const deleteTask = async (req, res) => {
    try {
        const taskID = await taskControllers.findByPk(req.params.id);
        if (!taskID) {
            return res.status(404).json({ message: "task id not found" })
        }
        await taskID.destroy({ where: { taskID } });
        res.status(201).json({ message: "deleted succuessfully" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


module.exports = { addTask, fetchAllTask, fetchSingleTask, updateTask, deleteTask }