const log = require('../logger');
const express = require('express');
const router = express.Router();
const ddbapi = require('../ddbapi');

router.post('/',(req, res, next) => {
    review = req.body;
    ddbapi.insertReview(review,res);
    ddbapi.updateAvgRating(review.review_restaurant_id);
});

router.get('/:id',(req, res, next) => {
    id = parseInt(req.params.id);
    ddbapi.getAllReviews(id,res);
});
router.get('/del/:id',(req, res, next) => {
    id = parseInt(req.params.id);
    ddbapi.deleteReview(id,res);
});
router.post('/mod/',(req, res, next) => {
    id = parseInt(req.params.id);
    review = req.body;
    ddbapi.updateReview(review,res);
    ddbapi.updateAvgRating(review.review_restaurant_id);
});
module.exports = router;