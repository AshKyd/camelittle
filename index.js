var exec = require('child_process').exec;
var util = require('util');
var escapeshellarg = require('escapeshellarg');
var events = require('events');

function Camelittle(opts){
	this.opts = opts;
}

util.inherits(Camelittle, events.EventEmitter);

/**
 * Parse out opts based on the global and grab-level options
 */
Camelittle.prototype.parseOpts = function(opts){
	var controls = '';
	var theseOpts = {};
	[this.opts, opts].forEach(function(optSet){
		for(var i in optSet){
			theseOpts[i] = optSet[i];
		}
	});

	if(theseOpts.controls){
		controls = this.parseControls(theseOpts.controls);
		delete theseOpts.controls;
	}

	var params = [];
	for(var i in theseOpts){
		if(theseOpts[i] === null){
			params.push('--' + i);
		} else {
			params.push('--' + i + ' ' + escapeshellarg(theseOpts[i]));
		}
	}
	return params.join(' ') + ' ' + controls;
};

Camelittle.prototype.parseControls = function(controls){
	var controlParams = [];
	for(var i in controls){
		controlParams.push('--set ' + escapeshellarg(i) + '=' + escapeshellarg(controls[i]));
	}
	return controlParams.join(' ');
};

Camelittle.prototype.callback = function(eventName, value, callback){
	if(callback){
		if(eventName == 'error'){
			callback(value, null);
		} else{
			callback(null, value);
		}
	}
	this.emit(eventName, value);
}

Camelittle.prototype.grab = function(opts, callback){
	var camelittle = this;

	// Support simple callback notation.
	if(typeof opts === 'function'){
		callback = opts;
		opts = {};
	}
	
	var args = this.parseOpts(opts);
	var stdout = !opts.save && !this.opts.save;
	if(stdout){
		// output to stdout
		args += ' -';
	}

	var cmd = 'fswebcam '+args;
	exec(cmd, {encoding: 'binary', maxBuffer: 5000*1024}, function(error, stdout) {
		if(error){
			camelittle.callback('error', error, callback);
			return;
		}
		if(stdout){
			camelittle.callback('frame', stdout, callback);
		} else {
			camelittle.callback('frame', null, callback);
		}
		
	});

};


module.exports = Camelittle;