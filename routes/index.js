// router & controller
var $ = require('jquery'),
  d3 = require('d3'),
	http = require('http'),
	async = require('async'),
	mongoose = require('mongoose'),
	models = require('../models/models'),
	Gift = models.gift,
	User = models.user,
	Party = models.event,
	userId = null;

exports.index = function(req, res){
	var id = req.signedCookies.id;
	if (id) {
						userId = id;
						renderUser(req, res);
					} else {
						res.render('index');
					}
	// res.render('index');
}

exports.user = function(req, res) {
	id = req.signedCookies.id;
	
	if (!$.isEmptyObject(req.body)) {
		if (req.body.firstName && req.body.lastName && req.body.inputEmail) {
			User.find({email: req.body.inputEmail}, function(err, user) {
				if (user.length == 0) {
					user = new User({firstName: req.body.firstName, 
								lastName: req.body.lastName,
								email: req.body.inputEmail,
								sex: req.body.genderRadios,
								paid: false});
					user.save();
					userId = user.id;

					console.log("new user");
					res.cookie('id', userId, {signed: true, maxAge: 3000000});
				} else {
					userId = user[0].id;
					console.log("old user");				
					res.cookie('id', userId, {signed: true, maxAge: 3000000});
				}
				renderUser(req, res);
			});
		} else {
			res.render("index");
		}
		
	} else if (typeof id != 'undefined') {
		userId = id;
		console.log("saved id");
		res.cookie('id', userId, {signed: true, maxAge: 3000000});
		renderUser(req, res);
	} else {
		res.render("index");
	}

	
}

renderUser = function(req, res) {
	async.parallel({
	    users: function(callback){
	        setTimeout(function(){
							User.find({}, function(err, users) {
								callback(err, users);
							});
	        }, 200);
	    },
	    gifts: function(callback){
	        setTimeout(function(){
	            Gift.find().sort({upvotes: "desc"}).find(function(err, gifts) {
								callback(err, gifts);
							});
	        }, 100);
	    },
			dates: function(callback){
	        setTimeout(function(){
	            Party.find({}, function(err, dates) {
								callback(err, dates);
							});
	        }, 100);
	    },
	},
	function(err, results) {
		var totalpledged = 0,
			totalusers = 0,
			user;
		$.each(results["users"], function(i,u) {
			totalusers += 1;
			if (u.pledged) {
				totalpledged +=u.amount;
			}
			if (u.id == userId) {
				user = u;
			}
		});
		
		var pie = [];
		$.each(results["dates"], function(i, date) {
			var totalattending = date.female.length;
			totalattending += date.male.length;
			// var percent = totalattending / totalusers;
			pie.push(totalattending);
		});
		
		console.log(user);
	  res.render('user', {"totalpledged": totalpledged, "totalusers": totalusers, 
			"totaldates": results.dates.length, "gifts": results.gifts, "pie": pie, 
			"dates": results.dates, "user": user});
	});
}

exports.pledge = function(req, res) {
	var data = req.body.objectData,
		id = mongoose.Types.ObjectId(userId);
		
	User.findByIdAndUpdate(id, {$set: {pledged: true}}, function(err, user) {
	});
	User.findByIdAndUpdate(id, {$set: {amount: parseInt(data.amount)}}, function(err, user) {
		// console.log("pledge", user);
	});
	
	res.send({data: "success"});
	
}

exports.upvote = function(req, res) {
	var data = req.body.objectData,
		id = mongoose.Types.ObjectId(data.id),
		uid = mongoose.Types.ObjectId(userId);
	Gift.findByIdAndUpdate(id, {$inc: {upvotes: 1}}, function(err, gift) {
		res.contentType('json');
	  res.send({ data: gift.upvotes});
	});
	User.findByIdAndUpdate(mongoose.Types.ObjectId(userId), {$push: {upvotes: data.id}}, function(err, user) {
		// console.log("upvote", user);
	});
}

exports.rsvp = function(req, res) {
	var data = req.body.objectData,
		id = mongoose.Types.ObjectId(data.id),
		uid = mongoose.Types.ObjectId(userId);
	
	User.find({}, function(err, users) {
		var totalusers = 0;
		$.each(users, function(i, u) {
			totalusers += 1;
		});
		
		User.findByIdAndUpdate(uid, {$push: {rsvp: data.id}}, function(err, user) {
			var name = user.firstName + ' ' + user.lastName;

			if (user.sex == "female") {
				Party.findByIdAndUpdate(id, {$push: {female: name}}, function(err, party) {
					res.contentType('json');
				  res.send({gender: "female", name: name, total: totalusers});
				});
			} else {
				Party.findByIdAndUpdate(id, {$push: {male: name}}, function(err, party) {
					res.contentType('json');
				  res.send({gender: "male", name: name, total: totalusers});
				});
			}
			// console.log("rsvp", user);
		});
	});
}

exports.cancel = function(req, res) {
	var data = req.body.objectData,
		id = mongoose.Types.ObjectId(data.id),
		uid = mongoose.Types.ObjectId(userId);
	
	User.find({}, function(err, users) {
		var totalusers = 0;
		$.each(users, function(i, u) {
			totalusers += 1;
		});
		
		User.findByIdAndUpdate(uid, {$pull: {rsvp: data.id}}, function(err, user) {
			var name = user.firstName + ' ' + user.lastName;
			if (user.sex == "female") {
				Party.findByIdAndUpdate(id, {$pull: {female: name}}, function(err, party) {
					res.contentType('json');
				  res.send({gender: "female", name: name, total: totalusers});
				});
			} else {
				Party.findByIdAndUpdate(id, {$pull: {male: name}}, function(err, party) {
					res.contentType('json');
				  res.send({gender: "male", name: name, total: totalusers});
				});
			}
		});
	});
}

exports.submit = function(req, res) {
	var data = req.body.objectData,
		id = mongoose.Types.ObjectId(userId);
	
	User.findByIdAndUpdate(id, {$set: {oneword: data.oneword, favmoment:data.favmoment}}, function(err, user) {
		console.log(user);
		res.send({redirect: "/success"});
	});
	
}

exports.success = function(req, res) {
	res.render("success");
}
// 
// exports.admin = function(req, res) {
// 	res.render('admin', {"gifts": gifts});
// }
