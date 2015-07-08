(function () {

	var fs = require('fs');
	var path = require('path');
	var fileToEnv = require('node-env-file');
	var envToObject = require('node-env-configuration');

	function Config(){

		// this.envFilename = filename || 'config.env';
		this.configFiles = [];

		// look for default config file
		var mainConfig = findEnvFile('config.env')
		if(mainConfig){
			this.configFiles.push(mainConfig);
		}

		// get config files from env
		if(process.env.CONFIG){
			var split = process.env.CONFIG.split(';')
			for(var i in split){
				try{
					var stat = fs.statSync(split[i]);

					if(stat && stat.isFile()){

						this.configFiles.push(split[i]);
					}
				}
				catch(err){}
			}
		}			

		// need at least one config file
		if(this.configFiles.length === 0){
			throw new Error('no config file found, create config.env in current dir or lower, or set ENV var CONFIG=file1;file2'  );	
		}

		// process files and put into process.env
		for(var i in this.configFiles){
			fileToEnv(this.configFiles[i], {overwrite: true});			
		}

		return this;
	}

	// function getEnv(file){
		
	// 	// get config from .env into process.env
	// 	fileToEnv(file);

	// 	// override defaults from other env file(s)
	// 	if(process.env.CONFIG){
	// 		var split = process.env.CONFIG.split(';')
	// 		for(var i in split){
	// 			fileToEnv(split[i], {overwrite: true});			
	// 		}
	// 	}			
	// }

	// Config.prototype.filename = function(_f){
	// 	this.envFilename = _f
	// 	this.configFile = null;
	// 	return this;
	// }

	// add config for appName to config object
	Config.prototype.get = function(appName, label){
		if(!appName){
			appName = ''
		}
		var temp = envToObject(appName);	

		if(Object.keys(temp).length === 0){
			return this;
		}

		if(label || appName){
			this[label || appName] = temp;	
		}
		else{
			for(var key in temp){
				this[key] = temp[key];
			}			
		}
		
		
		// chainable
		return this;
	};

	module.exports = new Config();
	// module.exports = Config;

	function findEnvFile(envFilename){
		
		var dir = process.cwd();

		// dont want infinite loop
		var count = 0;

		while(true && count++ < 100){

			var envPath = path.resolve(path.join(dir, envFilename));

			try{
				var stat = fs.statSync(envPath);

				if(stat && stat.isFile()){
					// console.info('found config file: ' + envPath);
					return envPath;
				}
			}
			catch(err){}

			// end of the line
			if(path.parse(dir).root === dir){
				// throw new Error('config file not found: ' + envFilename);	
				return null;	
			}
			// keep looking
			else{
				dir = path.resolve(path.join(dir , '..'));	
			}
		}
	}

}).call(this);
