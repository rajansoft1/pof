/**
 * Created by rajanchaudhary on 2/15/16.
 */
var nodeMailer = require('nodemailer');
var ses = require('nodemailer-ses-transport');
var User = require('mongoose').model('user');
var userOffline = require('mongoose').model('userOffline');
var Config = require('../../config/config')

exports.getById = function(req, res){
    User.findOne({'_id': req.param("id")}, function(err , data){
        if(err){
            res.error("not found")
        }
        else{
            res.success(data)
        }
    })
}


exports.refer = function(req, res){
    var template = "Referral Page Content"+
"Refer a friend!"

"Parentof began with the simple question – How can we make a parent’s life easier? Our vision" +

"became simpler with each person who joined our community, and shared their inputs after using our platform. Help us in our vision to Simplify Parenting! Refer us to your friends, and let them know how you feel about Parentof. Each person who joins our community adds to our research and helps us to bring better parenting insights to you! To share Parentof with your friends, click the options below – {FB Share} {Twitter Share} {Whatsapp Share} {Linkedin Share} {Email Share}"

    var mailOptions = {
        from: config.username, // sender address
        to: req.email, // list of receivers
        cc: req.contacts.getKey('email'),
        subject: 'Please activate your Parentof account', // Subject line
        text: template // plaintext body
    };
    sendMail(mailOptions, res)
}

exports.offlineData = function(req, res){
    var offline = new userOffline({email: req.params.email, resultLink: req.params.token});
    offline.save(function(){
        res.success("saved")
    })
}

exports.register = function (req, res) {
    var user = new User(req.body.user);
    User.find({email: req.body.user.email}, function(err, data){
        if(data.length == 0){
            userOffline.find({email: user.email}, function(errr, offline){
                if(!err){
                    if(offline.length > 0) {
                        user.resultLink = offline[0].resultLink
                    }
                        user.save(function(err){
                            if (err) {
                                res.error(err);
                            } else {
                                var template =
                                    "Dear "+user.firstName+", We are excited to have you onboard our community. To complete your registration, please click the following link:"+user.resultLink
                                    + "If the above link/button does not work, please use your Web browser to go to:" +user.resultLink+
                                    "Your Username is: "+user.email+
                                    "Your friends at Parentof"
                                var mailOptions = {
                                    from: "info@parentof.com", // sender address
                                    to: user.email, // list of receivers
                                    subject: 'Please activate your Parentof account', // Subject line
                                    text: template // plaintext body
                                };
                                sendMail(mailOptions, res)

                            }
                        })

                }
            })

        }
        else{
            res.error("user already exist");
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
    var questions = req.body.questions
    User.findOne({email: email}, function (err, data) {
        if(err){

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
exports.activate = function(req, res){
    var id = req.params.token;
    User.findOne({_id: id}, function (err, data) {
        if(err){
            res.error("account with given email not found")
        }
        else{
            data.isActivated = true;
            data.save(function(){
                res.writeHead(302, {
                    'Location': Config.postActivation
                    //add other headers here...
                });
                res.end();
            })

        }

    })
}

exports.getUserByEmail = function (req, res) {
    var email = req.params.email;
    console.log(email)
    User.findOne({email: email}, function (err, data) {
        if(err){
            res.error("account with given email not found")
        }
        else{
            res.success(data)
        }
    })
}
exports.updateResultToken = function(req, res){
    var email = req.params.email;
    var token = req.params.token;
    console.log(email)
    User.findOne({email: email}, function (err, data) {
        if(err){
            res.error("account with given email not found")
        }
        else{
            data.resultLink = token;
            data.save(function(rs){
                res.success(data)
            })
        }
    })
}

var sendMail = function(mailOptions, res){
    //var transporter = nodemailer.createTransport('smtps://"online@homelane.com:Homevista12@smtp.gmail.com');
    var transporter = nodeMailer.createTransport(ses({
        accessKeyId: 'AKIAJHJFHYJFURZKESMA',
        secretAccessKey: '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'
    }));
    //var transporter = nodeMailer.createTransport({
    //    service: 'Gmail',
    //    //uncomment tls to test in local machine.
    //    tls: {
    //        rejectUnauthorized: false
    //    },
    //    auth: {
    //        user: "info@parentOf.com",
    //        pass: "parentOf"
    //    }
    //});
    //Access Key ID:
    //    AKIAJHJFHYJFURZKESMA
    //Secret Access Key:
    //    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
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            res.error(error);
        }
        res.success('Message sent: ' + info.response);
    });
}

Array.prototype.getKey = function(key) {
    for (i = 0; i < this.length; i++) {
        this[i] = this[i][key];
    }
};