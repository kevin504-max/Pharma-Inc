const ApiServer = require('./server/server');

const startApplication = async () => {
    try {
        const config = require('./config/config.json');
        const mongoose = require('./database/databaseConnection');
        await mongoose.connect();
        const apiServer = new ApiServer();
        
        apiServer.initialize().then(() => {
            apiServer.getApplication().listen(config.port, () => {
                console.log(`Serviço rodando na porta ${config.port}`);
            });
        }).catch(error => {
            console.error(`Error: ${error}`);
            throw `Error: ${error}`;
        });
    } catch (error) {
        console.error(`Error: ${error}`);
        throw `Error: ${error}`;
    }
};

startApplication();