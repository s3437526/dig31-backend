const mongoose = require('mongoose')
const Schema = mongoose.Schema

// schema
const placeSchema = new mongoose.Schema({
    placeName: { type: String, required: true },
    locationType: { type: Schema.Types.ObjectId, required: true, ref: 'Location' },
}, { timestamps: true })

// model
const placeModel = mongoose.model('Place', placeSchema)

// export
module.exports = placeModel