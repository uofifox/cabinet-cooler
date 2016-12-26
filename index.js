const config = require('config');

const five = require('johnny-five');
const Particle = require('particle-io');
const board = new five.Board({
	io: new Particle({
		token: config.get('particleIo.token'),
		deviceId: config.get('particleIo.deviceId')
	})
});
const temperatureThreshold = config.get('threshold.temperature');
//A2 = thermistor input
//D0 = fan control
//D1 = LED1
board.on('ready', function() {
	console.log('Fan Switch Device Ready.1.');
	// const led = new five.Led('D1');
	const ledControl = new five.Led('D7');
	const fanRelay = new five.Relay({
		pin: 'D0', 
		type: 'NC'
	});
	const button = new five.Button('D1');
	
	// const thermistorInput = new five.Button('A2');
	// let wasHeld = false;
	// let currentTemperatureValue = false;
	// ledControl.blink();

/*
 reading = (1023 / reading)  - 1;
  reading = SERIESRESISTOR / reading;
*/


	const temperature = new five.Thermometer({
		pin: 'A2'
	});

	temperature.on('data', function() {
		console.log('celsius: %d', this.C);
		console.log('fahrenheit: %d', this.F);
		console.log('kelvin: %d', this.K);
		if (this.F > temperatureThreshold) {
			ledControl.on();
		} else {
			ledControl.off();
		}
	});

	button.on('press', function() {
		fanRelay.toggle();
	});
});