module.exports = function() {

    var models = {
        projUserModel: require("./user/user.model.server")(),
        projHistoryModel: require("./history/history.model.server")()
    };
    return models;
};