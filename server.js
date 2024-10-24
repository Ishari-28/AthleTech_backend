const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mysqlpool = require('./config/db');

//configure dotenv
dotenv.config();

//rest object
const app = express()

//middleware
app.use(morgan("dev"));
app.use(express.json());

//routes
app.use('/api/v1/athlete', require("./routes/athletesRouts"));


app.get('/test', (req, res) => {
    res.status(200).send("<h1>Mysql 123</h1>");
});


//port
const PORT = process.env.PORT || 8080;

//contidionaly listen
mysqlpool
    .query('SELECT 1')
    .then(() => {
    //MY SQL
    console.log('MySQL DB Connected')

    //listen
    app.listen(PORT, () => {
        console.log(`Server Running on port ${process.env.PORT}`);
}); 
}).catch((error) => {
    console.log(error);
})


