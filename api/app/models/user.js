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
    questions: Array,
    password: String,
    ageGroup: String,
    isActivated: String,
    resultLink: String,
    rating: Number,
    createdDate: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('user', user);