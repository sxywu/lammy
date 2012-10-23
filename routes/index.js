// router & controller
var $ = require('jquery'),
  d3 = require('d3'),
	http = require('http'),
	async = require('async'),
	mongoose = require('mongoose'),
	models = require('../models/models'),
	Gift = models.gift,
	User = models.user,
	Party = models.event;

exports.index = function(req, res){
  res.render('index');
}

exports.user = function(req, res) {
	
	async.parallel({
	    users: function(callback){
	        setTimeout(function(){
	            // User.where("pledged", true).exec(function() {
	            // 								var total = 0;
	            // 								$.each(this.emitted.complete[0], function() {
	            // 									total += this.amount;
	            // 								})
	            // 								callback(null, total);
	            // 							});
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
								// var result = [];
								// 							$.each(dates, function(i, date) {
								// 								
								// 								console.log(date);
								// 								var temp = {};
								// 								temp["date"] = date["date"];
								// 								temp["time"] = date["time"];
								// 								temp["female"] = date["female"];
								// 								temp["male"] = date["male"];
								// 								
								// 								result.push(temp);
								// 							});
								callback(err, dates);
							});
	        }, 100);
	    },
	},
	function(err, results) {
		var totalpledged = 0,
			totalusers = 0;
		$.each(results["users"], function(i, user) {
			totalusers += 1;
			if (user.pledged) {
				totalpledged += user.amount;
			}
		});
		
		var pie = [];
		$.each(results["dates"], function(i, date) {
			var totalattending = date.female.length;
			totalattending += date.male.length;
			var percent = totalattending / totalusers;
			date["pie"] = percent;
		pie.push(percent);
		});
		
		console.log(results["dates"]);
	  res.render('user', {"totalpledged": totalpledged, "totalusers": totalusers, "totaldates": results.dates.length, "gifts": results.gifts, "pie": pie, "dates": results.dates});
	});
}

exports.upvote = function(req, res) {
	var data = req.body.objectData,
		id = mongoose.Types.ObjectId(data.id);
	Gift.findByIdAndUpdate(id, {$inc: {upvotes: 1}}, function(err, gift) {
		res.contentType('json');
	  res.send({ data: gift.upvotes});
	});
}

exports.admin = function(req, res) {
	res.render('admin', {"gifts": gifts});
}
