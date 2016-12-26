module.exports = app => {
	// allow requests to be cross-origin
	app.use('/hello-world', require('./controllers'));

	// keep at bottom to catch errors
//	app.use('', require('./controllers/error'));
};