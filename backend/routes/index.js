const express = require('express');
const users = require('./users');

module.exports = app => {
    app.use(express.json(), users);
}