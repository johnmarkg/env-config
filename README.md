Get config objects from ENV variables defined in `config.env`.  This module will search for `config.env` in current directory and bubble down to root.  

If config files are elsewhere, they can be specified on the command line using `CONFIG=fullpath1;fullpath2 node app.js`.  These files will override any configs in default `config.env`, if it exists.

Configuration values can be grouped together using a prefix and plucked out individually.

# Usage

config.env:
```
# db configs
DB_VAR1=true
DB_VAR2=false

# redis configs
REDIS_VAR1=true
REDIS_VAR2=false

# another group of configs
APP1_VAR1=1
APP2_VAR2=2

```


```
var config = require('env-config')

// pluck out configs for app1
config.get('app1')

// we can now use the configs for app1
console.info(config.app1)

// output:
//
// {
// 	var1: 1,
// 	var2: 2
// }

```

