
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'lammy' });
};

exports.user = function(req, res) {
	res.render('user', {title: 'welcome'});
}