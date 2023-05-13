const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb://localhost:27017/pharmaInc', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        }).then(() => {
            console.log('Connected to database successfully!');
        })
    } catch (error) {
        console.log(`Error: ${error}`);
    }
}