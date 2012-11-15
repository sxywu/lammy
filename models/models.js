var mongoose = require('mongoose'),
	db = mongoose.createConnection('localhost', 'test');
	// db = mongoose.createConnection('mongodb://nodejitsu:8471d5be27b67142cc2b681850dd7d18@alex.mongohq.com:10000/nodejitsudb971995647558');

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
 console.log("hooray");
});

var userSchema = new mongoose.Schema({
  firstName: String,
	lastName: String,
  pledged: Boolean,
  amount: Number,
  upvotes: [String],
	rsvp: [String],
	oneword: String,
	favmoment: String,
	paid: Boolean,
	sex: String,
  email: {type: String, unique:true}
});

exports.user = User = db.model('User', userSchema);

var giftSchema = new mongoose.Schema({
	name: String,
	url: String,
	img: String,
	tall: Boolean,
	desc: String,
	price: Number,
	upvotes: Number
});

exports.gift = Gift = db.model('Gift', giftSchema);

var eventSchema = new mongoose.Schema({
	date: String,
	time: String,
	female: [String],
	male: [String]
});

exports.event = Event = db.model('Event', eventSchema);
