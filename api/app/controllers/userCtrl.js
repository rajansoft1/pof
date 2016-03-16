/**
 * Created by rajanchaudhary on 2/15/16.
 */

var User = require('mongoose').model('user');

exports.get = function (req, res) {
    Item.find({}, {sort: {sku: 1}}, function(err, data){
        if (err) {
            res.error('Unable to retreive Items')
        }
        if (data) {
            res.success(data);
        }
    });
}

exports.register = function (req, res) {
    var user = new User(req.body.user);
    user.save(function(err){
        if (err) {
            res.error(err);
        } else {
            res.success(user);
        }
    })
}

exports.login = function (req, res) {
    User.findOne({email: req.body.email, password: req.body.password}, function(err, data){
        if(!data || err){
            res.error("Username or password is in correct")
        }
        else{
            if(!data.isActivated){
                res.error("User is not activated, please click on the link in your mailbox")
            }
            else{
                res.success(data)
            }
        }
    })
}

exports.submitAnswers = function(req, res){
    var email = req.body.email
    var questions = req.body.question
    User.findOne({email: email}, function (err, data) {
        if(!err){
            res.error("account with given email not found")
        }
        else{
            data.questions = questions;
            data.save(function (errr) {
              if(errr){
                  res.error(errr);
              }
                else{
                  res.success(data)
              }
            })
        }
    })
}

exports.getUserByEmail = function (req, res) {
    var email = req.body.email;
    User.findOne({email: email}, function (err, data) {
        if(!err){
            res.error("account with given email not found")
        }
        else{
            res.success(data)
        }
    })
}

var sendMail = function(recipient, res){
    //var transporter = nodemailer.createTransport('smtps://"online@homelane.com:Homevista12@smtp.gmail.com');
    var transporter = nodeMailer.createTransport({
        service: 'Gmail',
        //uncomment tls to test in local machine.
        tls: {
            rejectUnauthorized: false
        },
        auth: {
            user: config.username,
            pass: config.password
        }
    });

    var mailOptions = {
        from: config.username, // sender address
        to: recipient, // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world 🐴', // plaintext body
        html: '<b>Hello world 🐴</b>' // html body
    };
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            res.error(error);
        }
        res.success('Message sent: ' + info.response);
    });
}