const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb://localhost:27017/pharmaInc', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        }).then(() => {
            console.log('Conexão com o Banco de Dados efetuada com sucesso!');
        })
    } catch (error) {
        console.log(`Error: ${error}`);
    }
}