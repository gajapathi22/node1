const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/routes');

const app = express();

app.use('/api',routes);
app.use(express.json());

require('dotenv').config();
const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error',(error)=>{
    console.log('not connected')
});

database.once('connected',()=>{
    console.log('Datbabase connected')
});



app.use(express.json());

app.listen(3000,()=>{
    console.log(`port is running in ${3000}`)
})