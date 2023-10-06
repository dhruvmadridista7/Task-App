const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');

const router = new express.Router();


// create user - sign Up
router.post('/users', async (req,res) => {
    // console.log(req.body);
    const user = new User(req.body);
    try {
        await user.save();

        const token = await user.generateAuthToken();

        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send();
    }
})

// not yet added in readme
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).send(users);
        
    } catch (error) {
        res.status(500).send(error.message);
    }
})

// login
router.post('/users/login', async (req,res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        // console.log(user);
        const token = await user.generateAuthToken();
        res.status(200).send({user, token});
    } catch (error) {
        res.status(400).send();
    }
})

router.post('/users/logout', auth, async (req,res) => {
    try {
        req.user.tokens = req.user.tokens.filter((tkn) => {
            return tkn.token !== req.token
        })

        await req.user.save();
        res.send(req.user);
    } catch (error) {
        res.status(500).send();
    }
})

router.get('/users/me', auth, async (req,res) => {
    res.send(req.user);
})

router.patch('/users/me', auth, async (req,res) => {
    const updates = Object.keys(req.body);
    const allowedUpdated = ['name', 'email', 'password'];
    const isValidUpdate = updates.every((update) => allowedUpdated.includes(update));

    if(!isValidUpdate) {
        res.status(400).send({ error : 'Invalid Updates' });
    }

    try {
        // const user = await User.findById(req.params.id);
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })
        await req.user.save();

        res.send(req.user);

    } catch (error) {
        res.status(400).send(error.message);
    }
})


router.delete('/users/:id', async (req,res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if(!user) {
            return res.status(404).send('User Not Found');
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send();
    }
})





module.exports = router;