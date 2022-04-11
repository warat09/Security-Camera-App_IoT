import { config } from './config/config';
import express from 'express';
import http from 'http';
import mongoose  from 'mongoose';
import Logging from './library/Logging';
import Upload_IMG from './routes/Camera_IMG'
import Setup_Camera from './routes/Camera'
import Register from './routes/User'
const router = express();

mongoose.connect(config.mongo.url,{retryWrites:true,w:"majority"})
.then(()=>{ 
    Logging.info('Conected to mongoDB');
    StartServer()
})
.catch(error => { 
    Logging.error('Unable to Conect to mongoDB');
    Logging.error(error);
})

const StartServer = () =>
{
    router.use((req,res,next)=>{
        Logging.info(`Incoming -> Method : [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

        res.on('finish',()=>{
            Logging.info(`Incoming -> Method : [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`);
        })

        next();
    })

    router.use(express.urlencoded({extended:true}));
    router.use(express.json());

    router.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With,Content-Type,Accept, Authorization"
        );
        if (req.method === "OPTIONS") {
            res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET");
            return res.status(200).json({});
        }
        next();
    });

    router.use('/IMG',Upload_IMG);
    router.use('/Camera',Setup_Camera);
    router.use('/User',Register);





    router.get('/ping',(req,res,next)=>res.status(200).json({message:'Hello!!!!'}));
    
    router.use((req,res,next)=>{
        const error = new Error('not found');
        Logging.error(error)
        return res.status(404).json({ message: error.message });
    });

    http.createServer(router).listen(config.server.port,()=> Logging.info(`Server is runnig on port ${config.server.port}`));
};