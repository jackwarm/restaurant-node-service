const log = require('../logger');
const express = require('express');
const router = express.Router();
const ddbapi = require('../ddbapi');

router.get('/',(req, res, next) => {
    ddbapi.allRestaurants(res);
});
router.post('/mod',(req, res, next) => {
    const restaurant = req.body;
    if (parseInt(restaurant.restaurant_id) > 0) {
        ddbapi.updateRestaurant(restaurant,res);
    } else {
        ddbapi.addRestaurant(restaurant,res);
    }
});
router.get('/del/:id',(req, res, next) => {
    id = parseInt(req.params.id);
    ddbapi.deleteRestaurant(id,res);
});
module.exports = router;