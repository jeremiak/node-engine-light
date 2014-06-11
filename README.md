# node-engine-light
be compatible with [Engine Light](http://engine-light.codeforamerica.org/)

## installation
  $ npm install engine-light

## documentation

Require `engine-light` and create an object

```js
var el = require('engine-light')
```

Then use it right away to generate Engine Light compliant responses

```js

el()
// returns a Promise of '{"status":"ok","updated":1402120470799,"dependencies":[],"resources":{}}'

el('doing aiight')
// returns a Promise of '{"status":"doing aiight","updated":1402120470799,"dependencies":[],"resources":{}}'
```

You can add your own depdencies with the `addDependency` function

```js
el.addDependency('Postgres')
el()
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

el.addResource('Sendgrid', getSendgridUsage)
el()
// returns a Promise of '{"status":"ok","updated":1402121246418,"dependencies":[],"resources":{"Sendgrid":17.85}}'
```

## contributors

@jeremiak
@jden

Please submit pull requests and issues through github.

You can run tests with `npm test`
