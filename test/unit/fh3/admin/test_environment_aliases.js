var assert = require('assert');
var fhcSetup = require('test/helpers/fhcSetup');

describe('test environment aliases', function () {
  before(function (done) {
    fhcSetup(function (err) {
      if (err) {
        return done(err);
      }
      var genericCommand = require('genericCommand');
      this.adminenvironmentaliases = {
        read : genericCommand(require('cmd/fh3/admin/environments/alias/read')),
        create : genericCommand(require('cmd/fh3/admin/environments/alias/create')),
        update : genericCommand(require('cmd/fh3/admin/environments/alias/update')),
        delete : genericCommand(require('cmd/fh3/admin/environments/alias/delete')),
        list : genericCommand(require('cmd/fh3/admin/environments/alias/list'))
      };

      this.nockEnvironmentAliases = require('test/fixtures/admin/fixture_environment_aliases');
    });
  });

  it('test admin-environment-aliases list', function(done) {
    this.adminenvironmentaliases.list({_ : []}, function (err, data){
      assert.equal(err, null);
      assert.equal(data.length, 1);
      assert.equal(data[0].environmentId, 'dev');
      assert.equal(data[0].environmentIdAlias, 'myDev');
      return done();
    });
  });
  it('test admin-environment-aliases read', function(done) {
    this.adminenvironmentaliases.read({ id : '1a'}, function (err, data){
      assert.equal(err, null);
      assert.equal(data.environmentId, 'dev');
      return done();
    });
  });
  it('test admin-environment-aliases create', function(done) {
    this.adminenvironmentaliases.create({ environment : 'dev', environmentAlias : 'myDev', environmentLabelAlias : 'My Dev' }, function (err, data){
      assert.equal(err, null);
      assert.equal(data.environmentLabelAlias, 'My Dev');
      return done();
    });
  });
  it('test admin-environment-aliases update', function(done) {
    this.adminenvironmentaliases.update( { id : '1a', environmentLabelAlias : 'My Dev 2'}, function (err){
      assert.equal(err, null);
      return done();
    });
  });
  it('test admin-environment-aliases delete', function(done) {  
    this.adminenvironmentaliases.delete({id : '1a'}, function (err){
      assert.equal(err, null);
      return done();
    });
  });


  after(function(done){
    this.nockEnvironmentAliases.done();
  });
});