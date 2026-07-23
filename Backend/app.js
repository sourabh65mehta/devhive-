import ApiError from './src/utils/ApiError.js';
import express from 'express';
import authRoutes from './src/Routes/auth.routes.js';
import { questionRoute } from './src/Routes/question.routes.js';


const app = express();
app.use(express.json({ limit: '16kb'}));
app.use(express.urlencoded({ extended: true ,limit: '16kb'}));
   



app.get('/health', (req, res) => {
 res.status(200).json({ success: true, message: 'DevHive API is running' });
});

app.use("/api/auth",authRoutes);
app.use("/api",questionRoute);

// global error handling middleware
app.use((err,req,res,next)=>{
    console.log(err);
    if(err instanceof ApiError){
        return res.status(err.statusCode).json({
            success:false,
            message:err.message,
            errors:err.errors,
        });
    }
    res.status(500).json({
        success:false,
        message:'Internal Server Error',
    })
})

export default app;
