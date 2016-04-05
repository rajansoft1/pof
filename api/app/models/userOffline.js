/**
 * Created by rajanchaudhary on 1/28/16.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var userOffline = new Schema({
    email: String,
    resultLink: String,
    createdDate: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('userOffline', userOffline);