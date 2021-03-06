// const express = require('express')
// const router = express.Router()
// const Utils = require('./../utils')
// const ActivityHistory = require('./../models/ActivityHistory')
// const path = require('path')

// // GET - get single activity history -------------------------------------------------------
// router.get('/:id', Utils.authenticateToken, (req, res) => {
//     if (activityHistory._id != req.params.id) {
//         return res.status(401).json({
//             message: "Not authorised"
//         })
//     }

//     ActivityHistory.findById(req.params.id)
//         .then(activityHistory => {
//             res.json(activityHistory)
//         })
//         .catch(err => {
//             console.log(err)
//             res.status(500).json({
//                 message: "Couldn't get activity history",
//                 error: err
//             })
//         })
// })


// // PUT - update activity history ---------------------------------------------      // This will push or pop to the array?
// router.put('/:id', Utils.authenticateToken, (req, res) => {
//     // validate request
//     if (!req.body) return res.status(400).send("Task content can't be empty")

//     // update activity history
//     function updateActivityHistory(update) {
//         ActivityHistory.findByIdAndUpdate(req.params.id, update, { new: true })
//             .then(activityHistory => res.json(activityHistory))
//             .catch(err => {
//                 res.status(500).json({
//                     message: 'Problem updating acctivity history',
//                     error: err
//                 })
//             })
//     }
// })

// // POST - create new activity history --------------------------------------
// router.post('/', (req, res) => {
//     // validate request
//     if (Object.keys(req.body).length === 0) {
//         return res.status(400).send({ message: "Activity history content can not be empty" })
//     }

//     // check account with email doen't already exist            // check other ways for activity history already existing?
//     ActivityHistory.findOne({ email: req.body.email })
//         .then(activityHistory => {
//             // if (activityHistory != null) {
//             //     return res.status(400).json({
//             //         message: "email already in use, use different email address"
//             //     })
//             // }
//             // create new user       
//             let newActivityHistory = new ActivityHistory(req.body)
//             newActivityHistory.save()
//                 .then(activityHistory => {
//                     // success!  
//                     // return 201 status with user object
//                     return res.status(201).json(activityHistory)
//                 })
//                 .catch(err => {
//                     console.log(err)
//                     return res.status(500).send({
//                         message: "Problem creating activity history",
//                         error: err
//                     })
//                 })
//         })
// })

// module.exports = router