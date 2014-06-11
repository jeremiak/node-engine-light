var chai = require('chai'),
    expect = chai.expect
require('polyfill-promise')

chai.should()
chai.use(require('chai-interface'))

describe('Engine Light', function() {
  it('should create an engine light object', function() {
    var el = require('../index')

    el.should.be.instanceof(Object)
  })

  it('should add depencies with addDependency(string)', function() {
    var el = require('../index')

    el.addDependency('Postgres')
    el._dependencies[0].should.equal('Postgres')
  })

  it('should throw error if dependency is not a string', function() {
    var el = require('../index')

    expect(function(){el.addDependency({})})
      .to.throw(TypeError)
  })

  it('should add resources & percentage with addResource(string, function)', function() {
    var el = require('../index'),
        expected = function() { return 0}

    el.addResource('Sendgrid', expected)
    el._resources['Sendgrid'].should.equal(expected)
  })

  it('should checks resource status from Promise-returning resource status providers', function(done) {
    var el = require('../index')

    var checkStatus = function () {
      return Promise.resolve(0)
    }

    el.addResource('Sendgrid', checkStatus)

    el()
      .then(function (engineLightString) {
        var obj = JSON.parse(engineLightString)
        obj.resources.Sendgrid.should.equal(0)
      })
      .then(done, done)

  })


  it('should add resources with function to return 0 if no <int> is supplied', function() {
    var el = require('../index')

    el.addResource('Sengrid')
    console.log(typeof(el._resources['Sengrid']))
    el._resources['Sengrid'].should.be.an.instanceof(Function)
  })

  it('should return with the proper attributes', function(done) {
    var el = require('../index')

    el().then(function (str) {
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
    var el = require('../index'),
        expected = JSON.stringify('yo')

    el(expected).then(function (str) {
      JSON.parse(str)['status'].should.equal(expected)
    })
    .then(done, done)
    
  })

})
