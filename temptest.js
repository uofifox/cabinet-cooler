const config = require('config');
const _ = require('lodash');
const five = require('johnny-five');
const Particle = require('particle-io');
const board = new five.Board({
	io: new Particle({
		token: config.get('particleIo.token'),
		deviceId: config.get('particleIo.deviceId')
	})
});
//const temperatureThreshold = config.get('threshold.temperature');
//A2 = thermistor input
//D0 = fan control
//D1 = LED1
board.on('ready', function() {
	console.log('TEmp Test 1 ready to go.');
	const bCoefficient = 3950;
	const thermistorNorminal = 10000;      
	// temp. for nominal resistance (almost always 25 C)
	const temperatureNominal = 25;
	const fanRelay = new five.Relay({
		pin: 'D0', 
		type: 'NC'
	});
	const analog = new five.Pin({
		pin: 'A4',
		mode: 0
	});
	let reading = 0.0;
	const SERIESRESISTOR = 10000;
	const currentValues = [];

	analog.read(function(error, value) {		
		reading = (1023 / value) - 1;
		reading = SERIESRESISTOR / reading;
		currentValues.push(reading);
		if (currentValues.length > 10)	{
			currentValues.shift();
		}

		const latestAverage = _.mean(currentValues);

		let steinhart = latestAverage / thermistorNorminal;     // (R/Ro)
		steinhart = Math.log(steinhart);                  // ln(R/Ro)
		steinhart /= bCoefficient;                   // 1/B * ln(R/Ro)
		steinhart += 1.0 / (temperatureNominal + 273.15); // + (1/To)
		steinhart = 1.0 / steinhart;                 // Invert
		steinhart -= 273.15;                         // convert to C
		console.log(`Current Temp ${steinhart} in celcius`);
		const actualTemp = steinhart * 1.8 + 32;
		if (actualTemp > 80) {
			fanRelay.off();
		} else {
			fanRelay.on();
		}
		console.log(`Actual Temp ${actualTemp} in celcius`);
	});
});