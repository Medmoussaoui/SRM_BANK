import express from 'express';
import session, { Store } from 'express-session';
import { sessionOptions } from '../Core/Config/session.config';
import { RecordsController } from '../Controller/RecordsController';
import { rateLimitermiddleware } from '../middlewares/Rate_Limiter';


export const  records = express.Router();

// Initial Controller
const recordsController = new RecordsController();

// RateLimiter Middleware
records.use('/home', rateLimitermiddleware());
records.use('/get/records', rateLimitermiddleware({points: 3}));

// Main Route
records.get('/home', (req, res) => {
    const clientSesionId = req.header('connect.sid');
    sessionOptions.store.get(clientSesionId, (err, ss) => {
        console.log(err);
        console.log(ss);
        res.send('Check The Console');

    });
});

records.get('/get/records', recordsController.getRecordsByRecordType());

function saveSessionLogin(req) : Promise<object> {
    return new Promise((resolve, reject) => {
        console.log("--> Session " + req.session.id);
        const {email, password} = req.body;
        req.session.user = {"email" : email ,"password" : password};
        sessionOptions.store.set(
            email,
            req.session.user,
            (err) => {
                if(err) return reject(err);
                resolve(req.session.id);              
            }
        );
    });
}
