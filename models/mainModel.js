
var moment = require('moment');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

exports.loginMdl = function (loginDtls,callback) {

	MongoClient.connect("mongodb://ccomplaint:cc0mplaint@ds127115.mlab.com:27115/ccomplaint", function (err, database) {
		if (err) throw err;

		db = database.db();

		db.collection('users').find({ email: loginDtls.email }).toArray((err, docs) => {
			if (err) {
				console.log(err)
				
			} else {
				database.close();
				callback(err, docs);
				return;
			}
		})
	});
};

exports.registerMdl = function (registerDtls,callback) {

	MongoClient.connect("mongodb://ccomplaint:cc0mplaint@ds127115.mlab.com:27115/ccomplaint", function (err, database) {
		if (err) throw err;

		db = database.db();

		db.collection('users').insertOne(registerDtls,(err, docs) => {
			if (err) {
				console.log(err);
				
			} else {
				database.close();
				callback(err, docs);
				return;
			}
		})
	});
};

exports.custComplaintsMdl = function (cust_id,callback) {

	MongoClient.connect("mongodb://ccomplaint:cc0mplaint@ds127115.mlab.com:27115/ccomplaint", function (err, database) {
		if (err) throw err;

		db = database.db();

		if(cust_id = 'agnt_in') {
			var cust_id = '';
		} else {
			var cust_id = { cust_id: cust_id};
		}
		db.collection('cust_cmplnts').find(cust_id).toArray((err, docs) => {
			if (err) {
				console.log(err);
				
			} else {
				console.log(docs);
				database.close();
				callback(err, docs);
				return;
			}
		})
	});
};

exports.createComplaintMdl = function (cmplntDtls,callback) {

	MongoClient.connect("mongodb://ccomplaint:cc0mplaint@ds127115.mlab.com:27115/ccomplaint", function (err, database) {
		if (err) throw err;

		db = database.db();
		
		db.collection('cust_cmplnts').insertOne(cmplntDtls,(err, docs) => {
			if (err) {
				console.log(err);
				
			} else {
				database.close();
				callback(err, docs);
				return;
			}
		})
	});
};

exports.complaintDtlsMdl = function (cmplnt_id,callback) {

	MongoClient.connect("mongodb://ccomplaint:cc0mplaint@ds127115.mlab.com:27115/ccomplaint", function (err, database) {
		if (err) throw err;

		db = database.db();

		db.collection('cust_cmplnts').find({ _id: ObjectID(cmplnt_id)}).toArray((err, docs) => {
			if (err) {
				console.log(err)
				
			} else {
				database.close();
				callback(err, docs);
				return;
			}
		})
	});
};

exports.commentsDtlsMdl = function (cmplnt_id,callback) {

	MongoClient.connect("mongodb://ccomplaint:cc0mplaint@ds127115.mlab.com:27115/ccomplaint", function (err, database) {
		if (err) throw err;

		db = database.db();

		db.collection('cmnts').find({cmplnt_id : cmplnt_id}).toArray((err, docs) => {
			if (err) {
				console.log(err);
			} else {
				database.close();
				callback(err, docs);
				return;
			}
		})
	});
};

exports.createCmntMdl = function (cmntDtls,callback) {

	cmntDtls.created_dt = moment().format('YYYY-MM-DD HH:mm:ss');

	MongoClient.connect("mongodb://ccomplaint:cc0mplaint@ds127115.mlab.com:27115/ccomplaint", function (err, database) {
		if (err) throw err;

		db = database.db();
		
		db.collection('cmnts').insertOne(cmntDtls,(err, docs) => {
			if (err) {
				console.log(err);
				callback(true, err);
			} else {
				database.close();
				callback(false, docs);
				return;
			}
		})
	});
};

exports.updCmplntMdl = function (status,cmplnt_id,callback) {

	MongoClient.connect("mongodb://ccomplaint:cc0mplaint@ds127115.mlab.com:27115/ccomplaint", function (err, database) {
		if (err) throw err;

		db = database.db();
		
		var cur_dt = moment().format('YYYY-MM-DD HH:mm:ss');

		if(status == '0') {
			status = 'Active';
		} else if(status == '1') {
			status = 'Assigned';
		} else if(status == '2') {
			status = 'Processing';
		} else {
			status = 'Solved';
		}
		
		db.collection('cust_cmplnts').updateOne({_id : ObjectID(cmplnt_id)}, {$set: {'status': status,'upd_dt': cur_dt}},(err, docs) => {
			if (err) {
				console.log(err);
				
			} else {
				database.close();
				callback(err, docs);
				return;
			}
		})
	});
};
