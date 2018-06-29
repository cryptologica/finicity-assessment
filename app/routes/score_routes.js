/**
 * Contains all of the '/score' group routes.
 */
module.exports = function (app, db) {

    const collection = db.collection('scores');

    /**
     * Record Score:
     * Inserts the given contestant into to the database. 
     * If the contestant already exists it will only update if the new score is higher.
     * @name post/score
     * @param {string} name The name of the contestant
     * @param {string} pies The number of pies the contestant ate (their score).
     */
    app.post('/score', (req, res) => {
        // Get parameters
        var name = req.body.name;
        var pies = parseInt(req.body.pies);
        // Check required parameters are present
        if (!name || !pies) {
            res.send({
                'error': 'Insufficient parameters supplied. Requires: {name} and {pies}.'
            });
            return;
        }
        // Create a contestant
        const contestant = {
            name: name,
            pies: pies
        };
        // Query on their name
        const findQuery = {
            name: name
        };
        // Check if contestant already exists
        collection.findOne(findQuery, (err, result) => {
            if (err) {
                res.send({
                    'error': 'Failed to query database.'
                });
                return;
            }
            // If given contestant doesn't already exist, add it
            if (result === null) {
                // Insert contestant into the database
                collection.insert(contestant, (err, result) => {
                    if (err) {
                        res.send({
                            'error': 'Failed to insert contestant into database.'
                        });
                    } else {
                        res.send({
                            name: result.ops[0].name,
                            pies: result.ops[0].pies
                        });
                    }
                });
                return;
            }
            // If already exists and new pie score is higher, update score
            if (pies > result.pies) {
                const updateQuery = {
                    name: name
                };
                const updateValues = {
                    $set: {
                        pies: pies
                    }
                };
                // Update pie score
                collection.update(updateQuery, updateValues, (err, result) => {
                    if (err) {
                        res.send({
                            'error': 'Failed to update pie score.'
                        });
                    } else {
                        res.send(contestant);
                    }
                });
            } else {
                res.send({
                    name: result.name,
                    pies: result.pies
                });
            }
        });
    });

    /**
     * Delete Score:
     * Deletes the given contestant.
     * @name delete/score
     * @param {string} name The name of the contestant to delete
     */
    app.delete('/score', (req, res) => {
        const name = req.body.name;
        if (!name) {
            res.send({
                'error': 'Insufficient parameters supplied. Requires: {name}.'
            });
            return;
        }
        const deleteQuery = {
            name: name
        };
        // Delete score from database
        collection.deleteOne(deleteQuery, (err, result) => {
            if (err) {
                res.send({
                    'error': 'Failed to delete contestant from database.'
                });
            } else {
                res.send({
                    'success-msg': 'Contestant (' + name + ') has been deleted.'
                });
            }
        });
    });

    /**
     * Get Scores:
     * Returns a list of the top 25 contestants (descending).
     * @name get/score
     */
    app.get('/score', (req, res) => {
        var options = {
            "sort": { pies: -1 },
            "limit": 3
        };
        collection.find({}, options).toArray(function (err, docs) {
            if (err) {
                res.send({
                    'error': 'Failed to get top scores from database.'
                });
            } else {
                // Remove all _id object properties
                docs.forEach(c => {
                    delete c._id;
                });
                res.send(docs);
            }
        });
    });
};