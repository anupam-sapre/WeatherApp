module.exports = function() {
    var mongoose = require("mongoose");
    var HistorySchema = mongoose.Schema({
        _user: {type: mongoose.Schema.ObjectId, ref: "User"},
        latitude: [String],
        longitude:[String],
        address:[String],
        timestamp: [String],
        dateCreated: {type: Date, default: Date.now}
    }, {collection: "proj.history"});

    return HistorySchema;
};