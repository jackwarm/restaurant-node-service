const log = require('../logger');
const express = require('express');
const router = express.Router();
const ddbapi = require('../ddbapi');

router.post('/',(req, res, next) => {
    const user = {
        username: req.body.username,
        password: req.body.password
    }
    ddbapi.checkUser(user,res);
});
router.post('/add',(req, res, next) => {
    const user = req.body;
    ddbapi.addUser(user,res);
});
router.get('/users',(req, res, next) => {
    ddbapi.getAllUsers(res);
});
router.get('/del/:id',(req, res, next) => {
    id = parseInt(req.params.id);
    ddbapi.deleteUser(id,res);
});

module.exports = router;