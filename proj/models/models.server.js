module.exports = function() {

    var models = {
        projUserModel: require("./user/user.model.server")()
    };
    return models;
};