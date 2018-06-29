const scoreRoutes = require('./score_routes');

/**
 * Contains all of the route groups.
 */
module.exports = function(app, db) {
    scoreRoutes(app, db);
};