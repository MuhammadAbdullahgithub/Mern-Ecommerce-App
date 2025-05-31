import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoute.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js'
import cors from 'cors';

// Configure env
dotenv.config({ path: './.env' });
const MODE = process.env.DEV_MODE || 'development';

// Database config
connectDB().catch(err => {
    console.error('Failed to connect to MongoDB:', err.message.red);
    process.exit(1);
});

// Rest object
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use("/api/v1/product", productRoutes);

// Default route
app.get('/', (req, res) => {
    res.send("<h1>Welcome To ecommerce web</h1>");
});

// 404 route handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Page not found',
    });
});

// PORT
const PORT = process.env.PORT || 8082;

// Server start
app.listen(PORT, (error) => {
    if (error) {
        console.error(`Error starting server: ${error.message}`.bgRed.white);
        process.exit(1); // Exit the process on failure
    }
    console.log(`Server Running on ${MODE} mode on port ${PORT}`.bgCyan.white);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('Shutting down server...'.bgYellow.black);
    process.exit();
});





