var mongoose = require('mongoose'),
	db = mongoose.createConnection('localhost', 'test');

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
 console.log("hooray");
});

var userSchema = new mongoose.Schema({
  name: String,
  pledged: Boolean,
  amount: Number,
  upvotes: [Number],
  email: String
});

exports.user = User = db.model('User', userSchema);

var giftSchema = new mongoose.Schema({
	name: String,
	url: String,
	img: String,
	desc: String,
	price: Number,
	upvotes: Number
});

exports.gift = Gift = db.model('Gift', giftSchema);

var eventSchema = new mongoose.Schema({
	date: String,
	time: String,
	female: [Number],
	male: [Number]
}, { _id: false });

exports.event = Event = db.model('Event', eventSchema);

// var gift1 = new Gift({img: "images/1.jpg", url: "http://www.nanamicowdroy.com/shop/n-deck-suspended-animation/", price: 600, upvotes: 0, name: 'nanami cowdroy "suspended animation"', desc: "Custom laser etched/engraved front and back with artist mark. Strung ready for hanging. Each N-Deck has edition number."}),
// 	gift2 = new Gift({img: "images/2.jpg", url: "http://www.nanamicowdroy.com/shop/n-deck-the-messenger/", price: 600, upvotes: 0, name: 'nanami cowdroy "the messenger"', desc: ""}),
// 	gift3 = new Gift({img: "images/3.jpg", url: "http://www.rei.com/product/843712/arbor-timeless-fish-bamboo-longboard", price: 179.95, upvotes: 0, name: "nanami cowdroy longboard", desc: ""}),
// 	gift4 = new Gift({img: "images/4.jpg", url: "http://www.nanamicowdroy.com/shop/cable-cranes/", price: 180, upvotes: 0, name: 'nanami cowdroy "cable cranes"', desc: "Price is for Size A (38cm x 26cm)"});
// 
// gift1.save();
// gift2.save();
// gift3.save();
// gift4.save();

// var shirley = new User({name: "Shirley", pledged: false, amount: 25});
// shirley.save();

// 
// var party1 = new Event({date: "11/9", time: "8PM", female: [], male: [], _id: 1}),
// 	party2 = new Event({date: "11/10", time: "3PM", female: [], male: [], _id: 2}),
// 	party3 = new Event({date: "11/17", time: "3PM", female: [], male: [], _id: 3});

// var party1 = new Date({date: "11/9", time: "8PM", id: 1});
// 	
// party1.save();
// party2.save();
// party3.save();
// 
// console.log(1);