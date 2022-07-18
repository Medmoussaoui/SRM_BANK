import { FormSheama } from "../Validation/ValidatorEngine";
import * as connection from '../Core/functions/MySQL_Functions';
import { ClientModule } from "../Modules/client";
import { NextFunction, Request, Response } from "express";
import bcrypt from 'bcrypt';
import { salt_bcrypt } from "../Core/Config/bcrypt.config";
import { RateLimiter } from "../middlewares/Rate_Limiter v2";

const loginSheama = new FormSheama([
    {
        type: 'string',
        key: 'email',
        max: 25,
        min: 12,
    },
    {
        type: 'string',
        key: 'password',
        max: 25,
        min: 8
    }
]);

const signUpSheama = new FormSheama([
    {
        type: 'string',
        key: 'email',
        max: 30,
        min: 12,
    },
    {
        type: 'string',
        key: 'password',
        max: 30,
        min: 12,
    },
    {
        type: 'string',
        key: 'fullName',
        max: 30,
        min: 12
    },
    {
        type: 'string',
        key: 'birthday',
        max: 8,
        min: 6
    }
]);


export class Authentication {

    clientModule: ClientModule = new ClientModule();

    login_fails_limit = new RateLimiter({ limiterName: 'login_failds' });

    async login(req: Request, res: Response) {
        const body           = req.body;
        const validateSheama = loginSheama.validate(body);

        if (typeof validateSheama != 'boolean'){
            return res.send('Payload Recieved is not valid');
        }
        await connection.connect();
        const limiter = await this.login_fails_limit.getInstance(body.email);
        
        if (limiter && limiter.reachedLimit) {
            return res.send('Reached Limit Points');
        }
        const client = await this.clientModule.getUserByEmail(body.email);

        if (client == undefined) {
            return res.status(401).send('This email Address is not Exist');
        }
        const validPassword = await bcrypt.compare(body.password, client.password);

        if (validPassword) {
            return res.send("welcome you are authorized");
        }
        /// Invalid Password  
        if (limiter == undefined) {
            await this.login_fails_limit.insert(body.email);
            console.log('--> Create New Limiet For Client');
        }
        else {
            await this.login_fails_limit.increment(body.email);
            console.log('--> Increment Points');
        }
        return res.status(401).send('The Password Is Invalid !');
    }

    async signUp(req: Request, res: Response) {
        const validateSheama = signUpSheama.validate(req.body);

        if (typeof validateSheama != 'boolean') {
            res.status(401).send('Payload Recieved is not valid');
            return;
        }        
        await connection.connect();
        const emailExist = await this.clientModule.getEmail(req.body.email);

        if (emailExist) {
            res.status(401).send('this email is already Used');
            return;
        }
        req.body.password = await bcrypt.hash(req.body.password, salt_bcrypt);
        const  state      = await this.clientModule.addNewAccount(req.body);

        if (state != true) {
            res.status(500).send('ALL Done Put Error happen after register new account');
            return
        }
        res.send('Account Created succesfully');
    }
}
