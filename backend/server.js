const express = require('express');
const cors = require("cors");
require('dotenv').config();
const sequelize = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test database connection
app.get("/", (req, res) => res.send('TransitOps API running'));

const PORT = process.env.PORT || 5000;

sequelize.authenticate()
    .then(() => {
        console.log('Database connected...');
        return sequelize.sync(); // creates tables if they do not exist
    })
    .then(() => {
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => console.log("DB connection error: ", err));   
    