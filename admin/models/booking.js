const mongooes = require('mongoose');
const Schema = mongooes.Schema;

const bookingSchema = new Schema({
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
    }
  },
  { timestamps: true }

);

module.exports = mongooes.model('Booking', bookingSchema);


