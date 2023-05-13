const express = require('express');
const users = require('./usersRoutes');

module.exports = app => {
    app.use(express.json(), users);
};