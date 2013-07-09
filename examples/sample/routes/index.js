
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'sp-socket & jquery.sp_connector.js sample' });
};
