const Promise = require('bluebird');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').Server(app);
const compress = require('compression');

// don't display the powered by header
app.disable('x-powered-by');

app.set('port', process.env.PORT || 1330);
// gzipping
app.use(compress());
// allow json bodies
app.use(bodyParser.json());

// routes ======================================================================
require('./routes')(app);

// launch ======================================================================
// expose the app via a promise
module.exports = new Promise(function(resolve) {
	server.listen(app.get('port'), () => resolve(app));
})
	.tap(() => {
		console.log(
			'express listening on port %d in %s mode\n',
			app.get('port'),
			app.settings.env
		);
	});