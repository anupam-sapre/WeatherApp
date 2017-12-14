/**
 * Created by Anupam on 12/11/2017.
 */
module.exports = function() {

    var mongoose = require("mongoose")
    var HistorySchema = require("./history.schema.server.js")();
    var History = mongoose.model("History", HistorySchema);

    var api = {
        createHistory: createHistory,
        findHistoryUserById:findHistoryUserById,
        updateHistory:updateHistory
    };
    return api;


    function createHistory(id,history) {
        history._user = id
        return History.create(history);
    }

    function findHistoryUserById(userId) {
        return History.find({_user:userId});
    }


    function updateHistory(userId, hist) {

        return History
            .update({_user: userId},{
                $push: {
                    latitude: hist.latitude,
                    longitude: hist.longitude,
                    timestamp: hist.timestamp,
                    address: hist.address,
                    placeid:hist.placeid
                }
            });


    }
};