[![Build Status](https://travis-ci.org/johnmarkg/env-config-shared.svg?branch=master)](https://travis-ci.org/johnmarkg/env-config-shared)
[![Coverage Status](https://coveralls.io/repos/johnmarkg/env-config-shared/badge.svg?branch=master)](https://coveralls.io/r/<account>/<repository>?branch=master)

Get config objects from ENV variables defined in `config.env`.  This module will search for `config.env` in current directory and bubble down to root.  

If config files are elsewhere, they can be specified on the command line using `CONFIG=fullpath1;fullpath2 node app.js`.  These files will override any configs in default `config.env`, if it exists.

Configuration values can be grouped together using a prefix and plucked out individually.

See [node-env-config-shareduration](https://github.com/whynotsoluciones/node-env-config-shareduration) for info on structuring config.env


# Usage

```
#
# config.env:
#

# db configs
DB_VAR1=true
DB_VAR2=false

# redis configs
REDIS_VAR1=true
REDIS_VAR2=false

# app1
APP1_VAR1=1
APP1_VAR2=2

# app2
APP2_VAR1=3

```

```
#
# config2.env:
#

# override a config value
APP1_VAR2=100
```



```
//
// app.js
//

var config = require('env-config-shared')

// pluck out configs for app1 and app2
config
	.get('app1')
	.get('app2')

// we can now use the configs for app1 and app2
console.info(config.app1)
console.info(config.app2)
```

Use the default config only
```
~ node app.js
{
	var1: 1,
	var2: 2
}
{
	var1: 3
}
```


Override some config using the CONFIG env
```
~ CONFIG=./config2.env node app.js
{
	var1: 1,
	var2: 100
}
{
	var1: 3
}
```


