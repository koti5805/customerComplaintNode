var express = require('express');
router = express.Router();
var jwt = require('jsonwebtoken');

process.env.SECRET_KEY = "thisismysecretkey";

var isLoggedIn = function (req, res, next) {

    var token = req.body.token || req.headers['token'];
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, function (err, ress) {
            if (err) {
                res.send({ "status": 201, "message": 'Token Invalid' });
            } else {
                next();
            }
        })
    } else {
        res.send({ "status": 201, "message": 'Token Invalid' });
    }
}

//Include Controller
var getRoutes = require('../controllers/mainCtrl');

router.post('/login',getRoutes.loginCtrl);
router.post('/register',getRoutes.registerCtrl);
router.get('/custComplaints/:cust_id',isLoggedIn,getRoutes.custComplaintsCtrl);
router.post('/createComplaint',isLoggedIn,getRoutes.createComplaintCtrl);
router.get('/complaintDtls/:cmplnt_id',isLoggedIn,getRoutes.complaintDtlsCtrl);
router.post('/createCmnt',isLoggedIn,getRoutes.createCmntCtrl);

module.exports = router;
