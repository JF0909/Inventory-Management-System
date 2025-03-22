const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json);

//routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/stock', require('./routes/stockRoutes'));
app.use('/api/suppliers', require('./routes/supplierRoutes'));

//export testing
if(require.main === module){
    connectDB();
    const PORT = process.env.PORT || 5001;
    app.listen(PORT,() => console.log(`Server running on port ${PORT}`));
}

mudule.exports = app;