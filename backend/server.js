const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());


connectDB(process.env.MONGO_URI);


app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/scores', require('./routes/scoreRoutes'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on ${PORT}`));