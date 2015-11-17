(function() {

	var fs = require('fs');
	var path = require('path');
	var fileToEnv = require('node-env-file');
	var envToObject = require('node-env-configuration');

	function EnvConfig() {

		this.configFiles = [];

		// look for default config file
		var mainEnvConfig = findEnvFile('config.env')
		if (mainEnvConfig) {
			this.configFiles.push(mainEnvConfig);
		}

		// get config files from env
		if (process.env.CONFIG) {
			var split = process.env.CONFIG.split(';')
			for (var i in split) {
				try {
					var stat = fs.statSync(split[i]);

					if (stat && stat.isFile()) {
						this.configFiles.push(split[i]);
					}
				} catch (err) {}
			}
		}

		// need at least one config file
		if (this.configFiles.length === 0) {
			throw new Error('no config file found, create config.env in current dir or lower, or set ENV var CONFIG=file1;file2');
		}

		// process files and put into process.env
		for (var i in this.configFiles) {
			fileToEnv(this.configFiles[i], {
				overwrite: true
			});
		}

		return this;
	}

	EnvConfig.prototype.getAll = function() {

		var t = this
		var appNames = {};

		this.configFiles.forEach(function(f){

			var lines = fs.readFileSync(f, 'utf8')

			lines.split("\n").forEach(function(l){
				if(!l){ return; }
				var name = l.replace(/^([a-z0-9]+)[\=\_].*/i, "$1").toLowerCase().trim()

				appNames[name] = true
			})
		})

		Object.keys(appNames).forEach(function(app){
			t.get(app)
		})
		return this;
	}

	// add config for appName to config object
	EnvConfig.prototype.get = function(appName, label) {
		if (!appName) {
			appName = ''
		}
		var temp = envToObject(appName);

		if (Object.keys(temp).length === 0) {
			return this;
		}

		if (label || appName) {
			this[label || appName] = temp;
		} else {
			for (var key in temp) {
				this[key] = temp[key];
			}
		}

		// chainable
		return this;
	};

	module.exports = new EnvConfig();
	// module.exports = EnvConfig;

	function findEnvFile(envFilename) {

		var dir = process.cwd();

		// dont want infinite loop
		var count = 0;

		while (true && count++ < 100) {

			var envPath = path.resolve(path.join(dir, envFilename));

			try {
				var stat = fs.statSync(envPath);
				if (stat && stat.isFile()) {
					// console.info('found config file: ' + envPath);
					return envPath;
				}
			} catch (err) {}

			// end of the line
			if (path.parse(dir).root === dir) {
				return null;
			}
			// keep looking
			else {
				dir = path.resolve(path.join(dir, '..'));
			}
		}
	}

}).call(this);
