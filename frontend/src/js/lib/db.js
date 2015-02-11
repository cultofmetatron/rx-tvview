var Rx = require('rx');

//var PouchDB = require('pouchdb');

/*
var createChangeStream = function(db) {
  return Rx.Observable.create(function(observer) {
    db.changes({ live: true })
      .on('change', function(val) { observer.onNext(val); })
      .on('error', function(err) { observer.onError(err); })
      .on('complete', function() { observer.onCompleted(); });
  });
};

var DBStore = function(dbName) {
  this.db = new Pouchdb(dbName);
  this.changes = new Rx.Subject();
  createChangeStream(this.db).subscribe(this.changes);
};

DBStore.create = function(db) {
  return new DBStore(db);
}
*/

var DBStore = {};



module.exports = DBStore;


