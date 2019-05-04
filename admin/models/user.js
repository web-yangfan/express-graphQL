const mongooes = require('mongoose');
const Schema = mongooes.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  createdEvents: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Event'
    }
  ]
});

// User 是数据库集合名
module.exports = mongooes.model('User', userSchema);