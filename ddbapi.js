const global = require('./global');
const log = require('./logger');
const mysql = require('mysql');

// Create the Database Connection
const connect = mysql.createConnection({
    host: global.DDB.host,
    user: global.DDB.user,
    password: global.DDB.password,
    database: global.DDB.database
})

// Return the resulting HTTP message back to the user
httpReply = (response,code,message) => {
    response.status(code).json(message);
}

const ddbapi = {

    // Verify if the user is registered
    checkUser: (user, response)  => {
        connect.query("SELECT user_id,user_admin,user_fullname,user_name FROM registered_users " +
            "WHERE user_name=? AND user_password=? AND offline=0",
            [user.username,user.password],(err, result, fields) => {
            if (err) {
                log.error(err.sqlMessage);
                httpReply(response, 200, {status: 500, message: err.sqlMessage});
            } else {
                if (result.length === 0) {
                    httpReply(response, 200, {status: 404, message: "User Not Found"});
                } else if (result.length > 1) {
                    httpReply(response, 200, {status: 500, message: "Too Many Matching Users"});
                } else {
                    httpReply(response, 200, {status: 0, message: "success", user: result[0]});
                }
            }
        });
    },
    allRestaurants: (response)  => {
        connect.query("SELECT * FROM restaurants WHERE offline=0 ORDER BY restaurant_average_rating DESC",
            [],(err, result, fields) => {
                if (err) {
                    log.error(err.sqlMessage);
                    httpReply(response, 500, {status: 500, message: err.sqlMessage});
                } else {
                    httpReply(response, 200, {status: 0, message: "success", restaurants: result});
                }
            });
    },
    updateAvgRating: (restaurant_id) => {
        sql =  "UPDATE restaurants F ";
        sql += "SET F.`restaurant_average_rating`=(SELECT AVG(R.review_rating) FROM reviews R WHERE R.`review_restaurant_id`=?) ";
        sql += "WHERE F.`restaurant_id`=?";
        params = [restaurant_id,restaurant_id];
        connect.query(sql, params,(err, result, fields) => {
            if (err) {
                log.error(err.sqlMessage);
            } else {
                log.info("Average Rating Updated Successfully");
            }
        });
    },
    insertReview: (review,response) => {
        sql = "INSERT INTO reviews ";
        sql += "(review_user_id, review_restaurant_id, review_rating, review_visit_date, review_comment, review_created_at) ";
        sql += "VALUES (?,?,?,?,?,NOW()) ";
        params = [review.review_user_id, review.review_restaurant_id, review.review_rating, review.review_visit_date, review.review_comment];
        connect.query(sql, params,(err, result, fields) => {
            if (err) {
                log.error(err.sqlMessage);
                httpReply(response, 200, {status: 500, message: err.sqlMessage});
            } else {
                log.info("Insert Success");
                httpReply(response, 200, {status: 0, message: "Review Added"});
            }
        });
    },
    getAllReviews: (id,response)  => {
        const query = "SELECT R.`review_id`,R.review_restaurant_id,U.`user_fullname`,R.`review_rating`,R.`review_visit_date`,R.`review_comment`,R.`review_created_at` " +
            "FROM reviews R " +
            "JOIN registered_users U ON U.user_id=R.`review_user_id` " +
            "WHERE R.`review_restaurant_id`=? AND R.offline=0 " +
            "ORDER BY R.`review_rating` DESC";
        connect.query(query,[id],(err, result, fields) => {
                if (err) {
                    log.error(err.sqlMessage);
                    httpReply(response, 500, {status: 500, message: err.sqlMessage});
                } else {
                    httpReply(response, 200, {status: 0, message: "success", reviews: result});
                }
            });
    },
    addUser: (user,response) => {
        sql = "INSERT INTO registered_users ";
        sql += "(user_name, user_password, user_admin, user_fullname, user_created) ";
        sql += "VALUES (?,?,?,?,NOW()) ";
        params = [user.user_name, user.user_password, user.user_admin, user.user_fullname];
        connect.query(sql, params,(err, result, fields) => {
            if (err) {
                log.error(err.sqlMessage);
                httpReply(response, 200, {status: 500, message: err.sqlMessage});
            } else {
                log.info("Insert Success");
                httpReply(response, 200, {status: 0, message: "User Added"});
            }
        });
    },
    getAllUsers: (response)  => {
        connect.query("SELECT * FROM registered_users WHERE offline=0",
            [],(err, result, fields) => {
                if (err) {
                    log.error(err.sqlMessage);
                    httpReply(response, 500, {status: 500, message: err.sqlMessage});
                } else {
                    httpReply(response, 200, {status: 0, message: "success", users: result});
                }
            });
    },
    addRestaurant: (restaurant,response) => {
        let sql = "INSERT INTO restaurants ";
        sql += "(restaurant_name, restaurant_address, restaurant_created,restaurant_average_rating) ";
        sql += "VALUES (?,?,NOW(),0) ";
        let params = [restaurant.restaurant_name, restaurant.restaurant_address];
        connect.query(sql, params,(err, result, fields) => {
            if (err) {
                log.error(err.sqlMessage);
                httpReply(response, 200, {status: 500, message: err.sqlMessage});
            } else {
                log.info("Insert Success");
                httpReply(response, 200, {status: 0, message: "Restaurant Added"});
            }
        });
    },
    updateRestaurant: (restaurant,response) => {
        let sql =  "UPDATE restaurants ";
        sql += "SET restaurant_name=?, restaurant_address=? ";
        sql += "WHERE restaurant_id=?";
        let params = [restaurant.restaurant_name,restaurant.restaurant_address,restaurant.restaurant_id];
        connect.query(sql, params,(err, result, fields) => {
            if (err) {
                log.error(err.sqlMessage);
                httpReply(response, 200, {status: 500, message: err.sqlMessage});
            } else {
                log.info("Restaurant Updated Successfully");
                httpReply(response, 200, {status: 0, message: "Restaurant Updated Successfully"});
            }
        });
    },
    updateReview: (review,response) => {
        let sql =  "UPDATE reviews ";
        sql += "SET review_rating=?, review_comment=? ";
        sql += "WHERE review_id=?";
        let params = [review.review_rating, review.review_comment, review.review_id];
        connect.query(sql, params,(err, result, fields) => {
            if (err) {
                log.error(err.sqlMessage);
                httpReply(response, 200, {status: 500, message: err.sqlMessage});
            } else {
                log.info("Restaurant Updated Successfully");
                httpReply(response, 200, {status: 0, message: "Review Updated Successfully"});
            }
        });
    },
    deleteRestaurant: (restaurant_id,response) => {
        sql =  "UPDATE restaurants SET offline=1  WHERE restaurant_id=?";
        params = [restaurant_id];
        connect.query(sql, params,(err, result, fields) => {
            if (err) {
                log.error(err.sqlMessage);
                httpReply(response, 200, {status: 500, message: err.sqlMessage});
            } else {
                log.info("Restaurant Deleted Successfully");
                httpReply(response, 200, {status: 0, message: "Restaurant Deleted Successfully"});
            }
        });
    },
    deleteReview: (review_id,response) => {
        sql =  "UPDATE reviews SET offline=1  WHERE review_id=?";
        params = [review_id];
        connect.query(sql, params,(err, result, fields) => {
            if (err) {
                log.error(err.sqlMessage);
                httpReply(response, 200, {status: 500, message: err.sqlMessage});
            } else {
                log.info("Restaurant Deleted Successfully");
                httpReply(response, 200, {status: 0, message: "Review Deleted Successfully"});
            }
        });
    },
    deleteUser: (user_id,response) => {
        sql =  "UPDATE registered_users SET offline=1, user_name=CONCAT('id_',user_id)  WHERE user_id=?";
        params = [user_id];
        connect.query(sql, params,(err, result, fields) => {
            if (err) {
                log.error(err.sqlMessage);
                httpReply(response, 200, {status: 500, message: err.sqlMessage});
            } else {
                log.info("Restaurant Deleted Successfully");
                httpReply(response, 200, {status: 0, message: "User Deleted Successfully"});
            }
        });
    },
};

module.exports = ddbapi;