const express = require('express')
const router = express.Router()
const Utils = require('./../utils')
const User = require('./../models/User')
const path = require('path')
const { rejects } = require('assert')

// User routes-----------------------------------------------------------------
// GET - get all users
// endpoint = /user------------------------------------------------------------
/*
This code block handles the request to retrieve all users from the database and if 
this is unsuccessful, throws a generic error
*/
router.get('/', Utils.authenticateToken, (req, res) => {
    // Get all users from the user model using the find() method
    // only signed in ADMIN user can list all users
    if (req.headers.access != 2) { // There has to be a safer way of determining admin...
        res.status(401).json({
            message: "Not authorised, your are not an administrator"
        })
    } else {
        User.find()
            .then((users) => {
                res.json(users)
            })
            .catch((err) => {
                console.log("There was a problem with retrieving users ", err)
            })
    }
})

// GET - get single user -------------------------------------------------------
router.get('/:id', Utils.authenticateToken, (req, res) => {
    // users can view their own profile, but ADMIN user can view any other profile also for modifying purposes
    if (req.user._id != req.params.id && req.headers.access != 2) { // There has to be a safer way of determining admin...
        return res.status(401).json({
            message: "Not authorised"
        })
    }

    User.findById(req.params.id)
        .then(user => {
            res.json(user)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: "Couldn't get user",
                error: err
            })
        })
})


// PUT - update user ---------------------------------------------
router.put('/:id', Utils.authenticateToken, (req, res) => {
    console.log(req.headers)
        // check that the user is admin in order to modify users unless they are modifying themselves
    if (req.user._id != req.params.id || (req.headers.access != 2 && req.body.newUser == false)) {
        console.log(`Headers recieved are: ${JSON.stringify(req.headers)}`)
        console.log(`Body recieved is: ${JSON.stringify(req.body)}`)
        return res.status(401).send({ message: "You have to be an administrator to modify users" })
    }

    // validate request
    if (!req.body) return res.status(400).send("Task content can't be empty")

    let avatarFilename = null

    // if avatar image exists, upload!
    if (req.files && req.files.avatar) {
        // upload avater image then update user
        let uploadPath = path.join(__dirname, '..', 'public', 'images')
        Utils.uploadFile(req.files.avatar, uploadPath, (uniqueFilename) => {
            avatarFilename = uniqueFilename
                // update user with all fields including avatar
            if (req.user.accessLevel != 2) {
                updateUser({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    imageURL: avatarFilename,
                    bio: req.body.bio,
                    newUser: !req.body.newUser
                })
            } else {
                updateUser({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    imageURL: avatarFilename,
                    bio: req.body.bio,
                    accessLevel: req.body.accessLevel,
                    newUser: !req.body.newUser
                })
            }
        })
    } else {
        console.log(`Not not New user is: ${!req.body.newUser}`)
            // update user without avatar
            // user has been updated therefore
        if (req.user._id == req.params.id) req.body.newUser = false
        updateUser(req.body)
    }

    // update User
    function updateUser(update) {
        console.log(`user.js line 105 update is: ${JSON.stringify(update)}`)
        User.findByIdAndUpdate(req.params.id, update, { new: true })
            .then(user => res.json(user))
            .catch(err => {
                res.status(500).json({
                    message: 'Problem updating user',
                    error: err
                })
            })
    }
})

// POST - create new user --------------------------------------
router.post('/', (req, res) => { //Utils.authenticateToken,

    // // check that the user is admin
    // if (req.headers.access != 2) {
    //     return res.status(401).send({ message: "You have to be an administrator to create users" })
    // }

    // validate request
    if (Object.keys(req.body).length === 0) {
        return res.status(400).send({ message: "User content can not be empty" })
    }

    // check account with email doen't already exist
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user != null) { //************************ORRRR if user name exists... add that also (for username-based logins in the future...*/
                return res.status(400).json({
                    message: "email already in use, use different email address"
                })
            }
            console.log(req.body)
                // create new user       
            let newUser = new User(req.body)
            newUser.save()
                .then(user => {
                    // success!  
                    // return 201 status with user object
                    return res.status(201).json(user)
                })
                .catch(err => {
                    console.log(err)
                    return res.status(500).send({
                        message: "Problem creating account",
                        error: err
                    })
                })
        })
})

// DELETE - delete user --------------------------------------
router.delete('/:id', Utils.authenticateToken, (req, res) => {
    // make sure the user is admin
    if (req.headers.access != 2) { // There has to be a safer way of determining admin...
        return res.status(401).json({
            message: "Not authorised to delete user, you are not an admin!"
        })
    }

    // attempt to delete the user
    try {
        User.findByIdAndDelete({ _id: req.params.id })
            .then(user => {
                    res.status(200).json({
                        message: "User " + user.firstName + " " + user.lastName + " successfully deleted.",
                        user
                    })
                }

            )
    } catch (err) {
        res.status(500).json({
            message: "Failed deleting user",
            err
        })
    }
})

module.exports = router