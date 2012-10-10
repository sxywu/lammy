var mongoose = require('mongoose'),
  db = mongoose.createConnection('localhost', 'test');
  
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("yay!");
});

var userSchema = new mongoose.Schema({
  name: String,
  pledged: Boolean,
  amount: Number,
  upvotes: [Number],
  email: String
});

