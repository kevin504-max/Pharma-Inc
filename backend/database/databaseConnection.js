const mongoose = require('mongoose');

async function connect() {
    try {
        mongoose.set("strictQuery", true);
        
        await mongoose.connect('mongodb://127.0.0.1:27017/pharmaInc', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Conexão com o Banco de Dados efetuada com sucesso!');
    } catch (error) {
        console.log(`Error: ${error}`);
    }
}

module.exports = { connect };