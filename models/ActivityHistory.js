const mongoose = require('mongoose')
const Schema = mongoose.Schema

// schema
const activityHistorySchema = new Schema({
    lastActive: {
        type: [Date],
        required: true
    },
    activityDuration: {
        type: [Number],
        required: true
    }

}, { timestamps: true })

// model
const activityHistoryModel = mongoose.model('ActivityHistory', activityHistorySchema)

// export
module.exports = activityHistoryModel