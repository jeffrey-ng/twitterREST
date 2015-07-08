process.env.NODE_ENV = 'test'

var app = require('../index');
var request = require('supertest');

describe('GET request tests', function() {
  it('respond w/ 404 for invalid tweet id', function(done) {
    request(app)
    .get('/api/tweets/55231d90f4d19b49441c9cb9')
    .expect(404,done);
  });
});
