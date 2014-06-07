var chai = require('chai'),
    expect = chai.expect

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

  it('should add resources with function to return 0 if no <int> is supplied', function() {
    var el = require('../index')

    el.addResource('Sengrid')
    console.log(typeof(el._resources['Sengrid']))
    el._resources['Sengrid'].should.be.an.instanceof(Function)
  })

  it('should return with the proper attributes', function() {
    var el = require('../index')

    JSON.parse(el()).should.have.interface({
      status: String,
      updated: Number,
      dependencies: Array,
      resources: Object
    })
  })

  it('should return status set to any value', function() {
    var el = require('../index'),
        expected = JSON.stringify('yo')

    e = el(expected)
    JSON.parse(e)['status'].should.equal(expected)
  })

})
