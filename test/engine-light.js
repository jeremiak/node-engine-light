var chai = require('chai'),
    expect = chai.expect

require('polyfill-promise')

chai.should()
chai.use(require('chai-interface'))

var EngineLight = require('../index')

describe('Engine Light', function() {
  it('should create an engine light object', function() {
    var el = new EngineLight()
    el.should.be.instanceof(Object)
  })

  it('should create a new EngineLight object even without the new keywodrd', function () {
    var el = EngineLight()
    el.should.be.instanceof(EngineLight)
  })

  it('should add depencies with addDependency(string)', function() {
    var el = new EngineLight()

    el.addDependency('Postgres')
    el._dependencies[0].should.equal('Postgres')
  })

  it('should throw error if dependency is not a string', function() {
    var el = require('../index')

    expect(function(){el.addDependency({})})
      .to.throw(TypeError)
  })

  it('should add resources & percentage with addResource(string, function)', function() {
    var el = new EngineLight(),
        expected = function() { return 0}

    el.addResource('Sendgrid', expected)
    el._resources['Sendgrid'].should.equal(expected)
  })

  it('should checks resource status from Promise-returning resource status providers', function(done) {
    var el = new EngineLight()

    var checkStatus = function () {
      return Promise.resolve(0)
    }

    el.addResource('Sendgrid', checkStatus)

    el.getStatus()
      .then(function (engineLightString) {
        var obj = JSON.parse(engineLightString)
        obj.resources.Sendgrid.should.equal(0)
      })
      .then(done, done)

  })


  it('should add resources with function to return 0 if no <int> is supplied', function() {
    var el = new EngineLight()

    el.addResource('Sengrid')
    el._resources['Sengrid'].should.be.an.instanceof(Function)
  })

  it('should return with the proper attributes', function(done) {
    var el = new EngineLight()

    el.getStatus().then(function (str) {
      JSON.parse(str).should.have.interface({
        status: String,
        updated: Number,
        dependencies: Array,
        resources: Object
      })
    })
    .then(done, done)

  })

  it('should return status set to any value', function(done) {
    var el = new EngineLight(),
        expected = JSON.stringify('yo')

    el.getStatus(expected).then(function (str) {
      JSON.parse(str)['status'].should.equal(expected)
    })
    .then(done, done)

  })

  describe('Middleware', function() {
    it('should return a function with 3 arguments', function() {
      var el = new EngineLight()

      var middleware = el.getMiddleware()
      middleware.should.be.instanceof(Function)
      middleware.length.should.equal(3)
    })

    it('should respond to /.well-known/status with getStatus() text', function(done) {
      var el = new EngineLight(), body,
          middleware = el.getMiddleware(),
          req = {url: '/.well-known/status'},
          res = {
            setHeader: function() {},
            write: function(vaL) { body = JSON.parse(vaL)},
            end: end
          }

      middleware(req, res)

      function end() {
        body.should.include.keys('status', 'updated', 'dependencies', 'resources')
        done()
      }
    })

    it('should not respond to any URL except for /.well-known/status', function(done) {
      var el = new EngineLight(),
          middleware = el.getMiddleware(),
          req = {url: '/other-things'}, res

      middleware(req, res, done)
    })

  })
})
