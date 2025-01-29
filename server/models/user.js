const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: [3, "Username must be atleast 3 characters long"],
    unique: true //for uniqueness of username
  },
  name: String,
  passwordHash: String,
  eventsCreated: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],
  eventsAttending: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event"
  }] 
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User