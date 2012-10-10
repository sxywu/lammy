
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index');
};

exports.user = function(req, res) {
	res.render('user');
}