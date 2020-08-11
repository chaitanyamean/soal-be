const express = require('express');

const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/category')

// middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors({origin: process.env.CLIENT_URL}));


// db connection
mongoose.connect(process.env.DATABASE_CLOUD, { useNewUrlParser: true , useUnifiedTopology: true, useCreateIndex: true })
    .then(() => console.log('DB connected'))
    .catch(error => console.log('error in connection', error))
// routes
app.use('/api', authRoutes);
app.use('/api', productRoutes);
app.use('/api', categoryRoutes);


const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`API is running on port ${port}`));
