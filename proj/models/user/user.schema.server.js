module.exports = function() {
    var mongoose = require("mongoose");
    var UserSchema = mongoose.Schema({
        username: {type: String, required: true},
        password: String,
        locations: [String],
        google: {
            id:    String,
            token: String,
            displayName: String
        },
        dateCreated: {type: Date, default: Date.now}
    }, {collection: "proj.user"});

    return UserSchema;
};