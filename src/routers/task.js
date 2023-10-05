const express = require('express');
const auth = require('../middleware/auth');
const Task = require('../models/task');
const router = new express.Router();
const User = require('../models/user');
const nodemailer = require('nodemailer');

// create a task
router.post('/tasks', auth, async (req,res) => {
    const { title, description, priority } = req.body;
    const task = new Task({
        title,
        description,
        priority,
        owner : req.user._id
    });

    try {
        await task.save();
        res.status(201).send(task);
    } catch(error) {
        res.status(400).send(error.message);
    }
})

// get all task by priority
router.get('/tasks/priority', async (req,res) => {
    try {
        const tasks = await Task.find({}).sort({ priority : 'asc' });
        res.status(200).send({ tasks });
    } catch (error) {
        res.status(500).send(error.message);
    }
})

router.get('/tasks/priority/me', auth, async (req,res) => {
    // Queue to hold tasks ordered by priority
    const taskQueue = [];

    // Function to add a task to the queue in the correct position based on priority
    function enqueueTask(task) {
        const index = taskQueue.findIndex((queuedTask) => queuedTask.priority > task.priority);
        if (index === -1) {
            taskQueue.push(task);
        } else {
            taskQueue.splice(index, 0, task);
        }
    }

    try {
        // console.log(req.user);
        await req.user.populate('tasks');
        const tasks = req.user.tasks

        // Enqueue the pending tasks into the priority queue
        for (const task of tasks) {
            enqueueTask(task);
        }

        // res.status(200).send(req.user.tasks);
        if(taskQueue !== undefined) {
            res.status(200).send(taskQueue);
        } else {
            res.status(200).send(tasks);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
})


router.get('/tasks/:id', async (req,res) => {
    const _id = req.params.id;

    try {
        const task = await Task.findOne({ _id : _id });

        if(!task) {
            return res.status(404).send();
        }

        res.status(200).send(task);
    } catch (error) {
        res.status(500).send();
    }
})


router.patch('/tasks/:id', async (req,res) => {
    const updates = Object.keys(req.body);
    const allowedUpdated = ['title','description', 'priority','status'];
    const isValidUpdate = updates.every((update) => allowedUpdated.includes(update));

    if(!isValidUpdate) {
        return res.status(400).send({ error : 'Invalid Updated' });
    }

    try {
        const task = await Task.findById({ _id : req.params.id });
        if(!task) {
            return res.status(404).send();
        }

        const oldPriority = task.priority;

        updates.forEach((update) => {
            task[update] = req.body[update];
        })
        await task.save();

        if(oldPriority !== task.priority) {
            res.status(200).send({"Alert" : "Priority has been updated please check once","task" : task});
        } else {
            res.status(200).send(task);
        }
    } catch (error) {
        res.status(400).send();
    }
})

router.post('/tasks/addCollaborators/:id', auth, async (req,res) => {
    const { taskId } = req.params;
    const { users } = req.body;

    try {
        const task = await Task.findById({ _id : req.params.id });
        if(!task) {
            return res.status(404).send();
        }

        const add = await task.addCollaborators(users);
        res.status(200).send(task);
    } catch (error) {
        res.status(500).send({'Error' : error.message});
    }
})

router.delete('/tasks/:id', auth, async (req,res) => {
    try {
        const task = await Task.findOneAndDelete( { _id : req.params.id, owner : req.user._id } );

        if(!task) {
            res.status(404).send();
        }

        res.status(200).send(task);
    } catch (error) {
        res.status(500).send();
    }
})


module.exports = router;
