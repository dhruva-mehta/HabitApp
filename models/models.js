var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
if (! process.env.MONGODB_URI) {
  console.log('Error: MONGODB_URI is not set. Did you run source env.sh ?');
  process.exit(1);
}

var connect = process.env.MONGODB_URI;
mongoose.connect(connect);

var userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    imgUrl: {
        type: String,
        default: 'https://horizons-static.s3.amazonaws.com/horizons_h.png'
    },
    friends: {
        type: Array,
        default: []
    },
    requests:{
        type: Array,
        default: []
    }
});

var User = mongoose.model('User', userSchema);

module.exports = {
  User: User,
};
