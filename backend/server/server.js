const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');

class ApiService {
    constructor () {

    }

    restApiConfiguration = async () => {
        const app = express();
        app.use(helmet());
        app.use(compression());
        app.use(cookieParser());
        app.use(cors({ origin: true, credentials: true }));
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));
        app.use('/v1/', require('../routes/users'));
        app.get('/', (request, response) => {
            response.status(200).json({ message: 'REST Fullstack Challenge 20201209 Running' })
        });
        this.app = app;
    }

    initialize = async () => {
        await this.restApiConfiguration();
    }

    startApplication = async () => {
        return this.app;
    }
}

module.exports = ApiService;