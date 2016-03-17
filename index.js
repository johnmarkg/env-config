(function() {

	var fs = require('fs');
	var path = require('path');
	var fileToEnv = require('node-env-file');
	var envToObject = require('node-env-configuration');

	function EnvConfig() {

		this.configFiles = [];
		var t = this;

		// look for default config file
		var mainEnvConfig = findEnvFile('config.env')
		if (mainEnvConfig) {
			this.configFiles.push(mainEnvConfig);
		}

		// get config files from env
		if (process.env.CONFIG) {
			var split = process.env.CONFIG.split(',')
			for (var i in split) {
				var fileOrDir = split[i]
				try {
					var stat = fs.statSync(fileOrDir);

					if (stat.isFile()) {
						this.configFiles.push(fileOrDir);
					}
					else if(stat.isDirectory()){

						fs.readdirSync(fileOrDir)
							.sort(function(a, b) {
								return a < b ? -1 : 1;
							})
							.forEach(function(f){
								f = path.resolve(path.join(fileOrDir, f));
								if(f.match(/\.env$/)){

									var _stat = fs.statSync(f);
									if (_stat.isFile()) {
										t.configFiles.push(f);
									}
									else{
										return
									}

								}
							})
					}
					else{
						console.error('env-config-shared: process.env.CONFIG file not a file or directory' + fileOrDir)
					}
				} catch (err) {
					console.error('env-config-shared: env file not a file: ' + fileOrDir)
				}
			}
		}

		// need at least one config file
		if (this.configFiles.length === 0) {
			throw new Error('env-config-shared: no config file found, create config.env in current dir or lower, or set ENV var CONFIG=file1;file2');
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
