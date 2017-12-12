module.exports = function() {

    var mongoose = require("mongoose")
    var UserSchema = require("./user.schema.server.js")();
    var User = mongoose.model("User", UserSchema);

    var api = {
        createUser: createUser,
        findUserByCredentials:findUserByCredentials,
        findUserById:findUserById,
        findUserByUsername:findUserByUsername,
        findUserByGoogleId:findUserByGoogleId,
        updateUser:updateUser
    };
    return api;


    function createUser(user) {
        return User.create(user);
    }
    function findUserByCredentials(username, password) {
        return User.findOne({username: username, password: password});
    }

    function findUserById(userId) {
        return User.findById(userId);
    }
    function findUserByUsername(username) {
        return User.findOne({username:username});
    }
    function findUserByGoogleId(googleId) {
        return User.findOne({'google.id': googleId});
    }


    function updateUser(userId, user) {
        delete user._id;
        return User
            .update({_id: userId},{
                $set: {
                    latitude: user.latitude,
                    longitude: user.longitude,
                    timestamp:user.timestamp,
                    address:user.address
                }
            });
    }
};