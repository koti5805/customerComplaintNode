/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var jwt = require('jsonwebtoken');
var moment = require('moment');

process.env.SECRET_KEY = "thisismysecretkey";
var appmdl = require('../models/mainModel');

// var masterVldtr = require('../validators/mstrVldt');

exports.loginCtrl = function (req, res) {

    var loginDtls = req.body;

    appmdl.loginMdl(loginDtls,function(err, results) {
        if (err) {
            console.log("err " + err);
            res.send(500, "Server Error");
            return;
        }
  
        if(results && results.length>0) {
          
            if (results[0].agnt_in == 1) {
                var rslts = {
                    agnt_in: results[0].agnt_in,
                    agnt_id: results[0]._id
                }
            } else {
                var rslts = {
                    cust_in: results[0].cust_in,
                    cust_id: results[0]._id
                }
            }

          var token = jwt.sign({
            data: rslts
          }, process.env.SECRET_KEY , { expiresIn: '2h' });
  
          res.json({
              status:200,
              data : rslts,
              token: token,
              expiresIn:'7200'
          })
        } else {
            res.send({"status" : 201,"message" : 'invalid UserName or Password'});
        }
    });
  }

exports.registerCtrl = function (req, res) {

    var registerDtls = req.body;
    req.body.cust_in = 1;
    appmdl.registerMdl(registerDtls, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": 'Data Submitted Failed' });
            return;
        }

        res.send({ "status": 200, "data": results });
    });
}

exports.custComplaintsCtrl = function (req, res) {

    var cust_id = req.params.cust_id;

    appmdl.custComplaintsMdl(cust_id, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": 'Data Submitted Failed' });
            return;
        }

        res.send({ "status": 200, "data": results });
    });
}

exports.createComplaintCtrl = function (req, res) {
    var cur_dt = moment().format('YYYY-MM-DD HH:mm:ss');
    var cmplntDtls = req.body.complaintform;

    cmplntDtls.created_dt = cur_dt;
    cmplntDtls.status = 'Not Assigned';
    
    if(req.body.cust_id) {
        cmplntDtls.cust_id = req.body.cust_id;
    } else if(req.body.agnt_id) {
        cmplntDtls.agnt_id = req.body.agnt_id;
    }
    
    appmdl.createComplaintMdl(cmplntDtls, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": 'Data Submitted Failed' });
            return;
        }

        res.send({ "status": 200, "data": results });
    });
}

exports.complaintDtlsCtrl = function (req, res) {

    var cmplnt_id = req.params.cmplnt_id;

    appmdl.complaintDtlsMdl(cmplnt_id, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": 'Data Submitted Failed' });
            return;
        }

        appmdl.commentsDtlsMdl(cmplnt_id, function (err, cmplntRes) {
            if (err) {
                res.send({ "status": 500, "msg": 'Data Submitted Failed' });
                return;
            }

            if (cmplntRes.length > 0) {
                results[0].comments = cmplntRes;
            }
            res.send({ "status": 200, "data": results });
        });

    });
}

exports.createCmntCtrl = function (req, res) {

    var cmplntDtls = req.body.complaintform;


    var status = cmplntDtls.status;
    var cmntDtls = req.body;

    var cmplnt_id = cmplntDtls._id;
    var cust_id = cmplntDtls.cust_id;

    cmntDtls.cmplnt_id = cmplnt_id.toString();
    cmntDtls.cust_id = cust_id.toString();

    delete cmntDtls.complaintform;
    console.log(cmntDtls);

    appmdl.createCmntMdl(cmntDtls, function (err, results) {
        if (err) {
            res.send({ "status": 500, "msg": 'Data Submitted Failed' });
            return;
        }

        appmdl.updCmplntMdl(status, cmplnt_id, function (err, results) {
            if (err) {
                res.send({ "status": 500, "msg": 'Data Submitted Failed' });
                return;
            }
            res.send({ "status": 200, "data": results });
        });
    });
}