var Rx = require('rx');

//removed because the browserify workflow interfered with e6ify
//var PouchDB = require('pouchdb');


var createChangeStream = function(db) {
  return Rx.Observable.create(function(observer) {
    db.changes({ live: true })
      .on('change', function(val) { observer.onNext(val); })
      .on('error', function(err) { observer.onError(err); })
      .on('complete', function() { observer.onCompleted(); });
  });
};

var DBStore = function(dbName) {
  this.db = new PouchDB(dbName);
  this.changes = new Rx.Subject();
  createChangeStream(this.db).subscribe(this.changes);
};

DBStore.create = function(db) {
  return new DBStore(db);
}


//var DBStore = {};



module.exports = DBStore;


