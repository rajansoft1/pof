/**
 * Created by rajanchaudhary on 1/28/16.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var user = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    mobile: String,
    referredBy: String,
    questions: Object,
    password: String,
    ageGroup: String,
    isActivated: String,
    createdDate: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('user', user);