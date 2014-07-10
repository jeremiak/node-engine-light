# node-engine-light
be compatible with [Engine Light](http://engine-light.codeforamerica.org/)

## installation
  $ npm install engine-light

## documentation

Require `engine-light` and create an object

```js
var EngineLight = require('engine-light')

var engineLight = new EngineLight()
// can also be used without the `new` keyword:
engineLight = EngineLight()
```

Then use it right away to generate Engine Light compliant responses

```js

engineLight.getStatus()
// returns a Promise of '{"status":"ok","updated":1402120470799,"dependencies":[],"resources":{}}'

engineLight.getStatus('doing aiight')
// returns a Promise of '{"status":"doing aiight","updated":1402120470799,"dependencies":[],"resources":{}}'
```

You can add your own depdencies with the `addDependency` function

```js
engineLight.addDependency('Postgres')
engineLight.getStatus()
// returns a Promise of '{"status":"ok","updated":1402120706100,"dependencies":["Postgres"],"resources":{}}'
```

You can add resources as well. `addResource` takes two parameters:

The first is expected to be a string, and the name of the resource

The second (optional) is expected to be a function, that returns the  current resource usage information as a percentage of the allowed limit.

```js
function getSendgridUsage() {
	var allowed, used
	percentage = (allowed/used) * 100

	return percentage
}

engineLight.addResource('Sendgrid', getSendgridUsage)
engineLight.getStatus()
// returns a Promise of '{"status":"ok","updated":1402121246418,"dependencies":[],"resources":{"Sendgrid":17.85}}'
```

Engine Light can also be be used as middleware.

```js
var express = require('express')
var app = express()
var EngineLight = require('engine-light')

var engineLight = new EngineLight()
app.use(engineLight.getMiddleware())

app.listen(80)
```

## contributors

@jeremiak
@jden

Please submit pull requests and issues through github.

You can run tests with `npm test`
