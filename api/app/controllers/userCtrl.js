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
    var template = "Referral Page Content\n\n\n"+
"Refer a friend!\n\n"+

"Parentof began with the simple question – How can we make a parent’s life easier? \nOur vision" +

" became simpler with each person who joined our community, and shared their inputs after using our platform. Help us in our vision to Simplify Parenting! Refer us to your friends, and let them know how you feel about Parentof. Each person who joins our community adds to our research and helps us to bring better parenting insights to you! To share Parentof with your friends, click the options below – \n{FB Share} \n{Twitter Share} \n{Whatsapp Share} \n{Linkedin Share} \n{Email Share}"
    var mailOptions = {
        from: Config.username, // sender address
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
            userOffline.findOne({email: user.email}, function(err, offline){

                if(!err){
                    if(offline && offline.length > 0) {
                        user.resultLink = offline[0].resultLink
                    }
                    user.save(function(err){
                        if (err) {
                            res.error(err);
                        } else {
                            var template =
                                "Dear "+user.firstName+", \n\nWe are excited to have you onboard our community.<br> To complete your registration, please click the following link: <a href='http://api.parentof.com/activate/"+Config.activationLink+user._id
                                + "'>Activate </a> <br>If the above link/button does not work, please use your Web browser to go to: http://api.parentof.com/activate/" +Config.activationLink+user._id+
                                "\nYour Username is: "+user.email+
                                "\nYour friends at Parentof"

                            var mailOptions = {
                                from: Config.username, // sender address
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
        if(err|| !data){
            res.error("Account with given token is not found")
        }
        else{
            data.isActivated = true;
            data.save(function(){
                res.writeHead(302, {
                    'Location': Config.postActivation+ '?refer='+ data.id
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

exports.submitRating = function(){
    var email = req.params.email;
    var rating = req.params.rating;
    User.findOne({email: email}, function (err, data) {
        if(err){
            res.error("account with given email not found")
        }
        else{
            data.rating = rating;
            data.save(function(rs){
                res.success(data)
            })
        }
    })
}

var sendMail = function(mailOptions, res){
    //var transporter = nodemailer.createTransport('smtps://"online@homelane.com:Homevista12@smtp.gmail.com');
    /*var transporter = nodeMailer.createTransport(ses({
        accessKeyId: 'AKIAJHJFHYJFURZKESMA',
        secretAccessKey: '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'
    }));*/
    var transporter = nodeMailer.createTransport({
        service: 'Gmail',
        //uncomment tls to test in local machine.
    //    tls: {
    //        rejectUnauthorized: false
    //    },
        auth: {
            user: Config.username,
            pass: Config.password
        }
    });
    
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            res.error(error);
        }
        else{
            res.success('Message sent: ');
        }
    });
}

Array.prototype.getKey = function(key) {
    for (i = 0; i < this.length; i++) {
        this[i] = this[i][key];
    }
};