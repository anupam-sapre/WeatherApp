/**
 * Created by Anupam on 12/11/2017.
 */
module.exports = function(app,models) {
    var projHistoryModel = models.projHistoryModel;
    app.post('/proj/addHistory/:userId',addHistory);
    app.get("/proj/searchHistory/:userId", searchHistory);


    function addHistory(req, res) {
        var history = req.body;
        var id = req.params.userId;

        projHistoryModel.findHistoryUserById(id).then(
            function(historyObj) {
                if(historyObj.length>0){


                    projHistoryModel
                        .updateHistory(id, history)
                        .then(
                            function(stats) {
                                console.log(stats);
                                res.send(200);
                            },
                            function(error) {
                                res.statusCode(404).send(error);
                            }
                        );
                }else{
                    projHistoryModel.createHistory(id,history).then(
                        function(stats) {
                            console.log(stats);
                            res.send(200);
                        },
                        function(error) {
                            res.statusCode(404).send(error);
                        }
                    );
                }
            },
            function(error) {
                res.statusCode(404).send(error);
            }
        );
    }

    function searchHistory(req,res) {
            var userId = req.params.userId;
            projHistoryModel
                .findHistoryUserById(userId)
                .then(
                    function (history) {
                        res.json(history);
                    },
                    function(err) {
                        res.statusCode(404).send(err);
                    }
                )


    }

}