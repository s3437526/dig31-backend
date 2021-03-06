// import Item from "./Item"
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// schema
const lightSchema = new mongoose.Schema({
    placeName: { type: Schema.Types.ObjectId, required: true, ref: 'Place' },
    type: { type: Schema.Types.ObjectId, required: true, ref: 'Device' },
    name: { type: String, required: true },
    status: { type: Number, required: true },
    state: { type: Number, required: true },
    level: { type: Number, required: true },
    pinned: { type: Boolean, required: true },
    enabled: { type: Boolean, required: true },
    colour: { type: String, required: true },
    pollRate: { type: Date, required: true },
    reportingRate: { type: Number, required: true },
    ipAddress: { type: String, required: true },
    mqttTopic: { type: String, required: true },
    lastActive: { type: [Date], required: false },
    activityHistory: { type: Schema.Types.ObjectId, required: true, ref: 'ActivityHistory' }
}, { timestamps: true })

// model
const lightModel = mongoose.model('Light', lightSchema, "items")

// export
module.exports = lightModel