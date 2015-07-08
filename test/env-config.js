(function() {

    var assert = require('assert');

	describe('errors', function(){
		beforeEach(function(){
    		delete require.cache[require.resolve('../env-config')];
    	});

    	it('nonexistent default config file',function(){
    		assert.throws(function(){
    			var config = require('../env-config');
    		}, /no config file found/)
    	});

    	it('nonexistent files from CONFIG',function(){
    		process.env.CONFIG='nonexistentfile1;nonexistentfile2'
    		assert.throws(function(){
    			var config = require('../env-config');
    		}, /no config file found/)
    	});
	});



    describe('config.get', function(){
    	var config;

    	// chdir to find config file in ./test
    	before(function(){
    		process.chdir('test');		
    		
    	});

    	beforeEach(function(){
    		delete require.cache[require.resolve('../env-config')];
    		config = require('../env-config');
    	})


    	it('prototype', function(){
    		assert.equal(typeof config.get, 'function');
    	});


    	it('get app1', function(){
    		config.get('app1')
    		assert.equal(config.app1.var1, true);
    		assert.equal(config.app1.var2, false);
    		assert.equal(config.app2, null);
    	});

    	it('get app2', function(){
    		config.get('app2')
    		assert.equal(config.app1, null);
    		assert.equal(config.app2.var1, 1);
    		assert.equal(config.app2.var2, 2);    		
    	});

    	it('app name can only to underscore', function(){
    		config.get('app2var')
    		assert.equal(config.app2var, null);
    	});

    	it('chain', function(){
    		config
    			.get('app1')
    			.get('app2')
    		assert.equal(config.app1.var1, true);
    		assert.equal(config.app1.var2, false);
    		assert.equal(config.app2.var1, 1);
    		assert.equal(config.app2.var2, 2);    		    		
    	});

    	it('get with no appName', function(){
    		config.get()	
    		
    		assert.equal(config.app1, null);
    		assert.equal(config.app1Var1, true);
    		assert.equal(config.app2Var1, 1);
    		assert.equal(config.app2Var2, 2);    		
    	});

    	it('no namespace puts all env vars in to config object', function(){
    		process.env['DUMMY CONFIG']=1;
    		config.get()
    		
    		assert.equal(config.dummyConfig, 1); 
    	});
    });

    describe('override default config.env',function(){
    	var config;

    	beforeEach(function(){
    		delete require.cache[require.resolve('../env-config')];
    	})

    	it('override', function(){
    		process.env.CONFIG='./config2.env';
    		config = require('../env-config');
    		config.get('app1')
    		assert.equal(config.app1.var1, 10);
			assert.equal(config.app1.var2, false);
    	});

    	it('override multiple', function(){
    		process.env.CONFIG='./config2.env;./config3.env';
    		config = require('../env-config');
    		config.get('app1')
    		assert.equal(config.app1.var1, 10);
			assert.equal(config.app1.var2, 100);
    	});

    	it('chain w/ override', function(){
    	 	process.env.CONFIG='./config2.env;./config3.env';
    	 	config = require('../env-config');
    		config
    			.get('app1')
    			.get('app2')

    		assert.equal(config.app1.var1, 10);
			assert.equal(config.app1.var2, 100);    		
    		assert.equal(config.app2.var1, 1);
    		assert.equal(config.app2.var2, true);    		    		
    	});
    });


    describe('config.env should not be folder', function(){

        before(function(){
            process.chdir('dummy');      
        });

        beforeEach(function(){
            delete require.cache[require.resolve('../env-config')];
        });

        it('skip folder',function(){
            var config = require('../../env-config');
            config.get('app1')
            assert.equal(config.app1.var1, true);                
        });
        it('skip folder, CONFIG env',function(){
            process.env.CONFIG='./config.env';
            var config = require('../../env-config');
            config.get('app1')
            assert.equal(config.app1.var1, true);                
        });

    });        


}).call(this);    