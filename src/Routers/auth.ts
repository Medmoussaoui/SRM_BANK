import express from 'express';
import { Authentication } from '../Authentication/authentication.Controller';
import { RateLimiter } from '../middlewares/Rate_Limiter v2';
import * as connection from '../Core/functions/MySQL_Functions';


export const auth = express.Router();

const authController = new Authentication();

const login_failds   = new RateLimiter({limiterName:'login_failds'});

/* SET RATE LIMITER MIDDLEWARE */
//auth.use('/login', rateLimitermiddleware({points:4, duration:60000}));
//
//auth.use('/signup',rateLimitermiddleware({points:4, duration:12000}))

/* ROUTES */

auth.post('/login' , async (req, res) => {
    await authController.login(req, res);
    await connection.endConnect();
});

auth.post('/signup', async (req,res) => {
    await authController.signUp(req,res);
    await connection.endConnect();
})
