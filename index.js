var resolved = require('resolved')

engineLight._dependencies = []
engineLight._resources = {}

engineLight.addDependency = function(dependency) {
  if (typeof(dependency) === 'string') {
    engineLight._dependencies.push(dependency)
  }
  else {
    throw new TypeError('dependency must be a string')
  }
}

engineLight.addResource = function(resource, percentage) {
  percentage = typeof(percentage) === 'function' ? percentage : (function(){return 0})
  if (typeof(resource) === 'string') {
    engineLight._resources[resource] = percentage
  }
  else {
    throw new TypeError('resource must be a string')
  }
}

function executeResourceFunctions(resources) {
  var updated_resources = {}

  for (resource in resources) {
    updated_resources[resource] = resources[resource]()
  }

  return updated_resources
}

// (String?) => Promise<Object>
function buildResponseObject(status) {
  return resolved({
    'status': status,
    'updated': new Date().getTime(),
    'dependencies': engineLight._dependencies,
    'resources': executeResourceFunctions(engineLight._resources)
  })
}

// (String?) => Promise<String>
function engineLight(status) {
  status = status || 'ok'
  return buildResponseObject(status).then(function (val) {
    return JSON.stringify(val)
  })
}

module.exports = engineLight
