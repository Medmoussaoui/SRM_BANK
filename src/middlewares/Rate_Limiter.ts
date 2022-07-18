import { NextFunction, Request, Response } from 'express';
import * as connection from '../Core/functions/MySQL_Functions' 

    export interface RateOptions {
        /* The duration Properties Set expire duration time as ms */ 
        duration?: number,
        /* The path properties it's the route of the specefic
        * rate limite Part in the application
        */
        path?:     string,
        /* the points properties it's number of requests allowed to make */
        points?:   number,
        /* The Ip Is The clients IpAddress */
        ip?: string,
    }

    interface EndPoint {
        exitcode?: number,
        success  : boolean,
        data?    : any
    }

    async function deleteIpAddressRate(options: RateOptions) {
        await connection.query(`DELETE FROM RateLimiter where ipAddress = "${options.ip}" AND path = "${options.path}"`);
    }

    async function getTheIpRateLimite(optins: RateOptions) {
        const {ip, path} = optins;
        return await connection.query(`SELECT * FROM RateLimiter where ipAddress = "${ip}" AND path = "${path}"`);
    }

    // Generate The Expire Date
    var initExpireDate = (duration : number) => Date.now().valueOf() + duration;

    // Regester the new ip address make request with spesific path to Rate limite on this particuler path
    async function regesterIpAddress(options: RateOptions) {
        const {duration, path, ip} = options;
        const expire = initExpireDate(duration); 
        await connection.query(`INSERT INTO RateLimiter (ipAddress, points, path, expire) VALUES("${ip}", "1", "${path}", "${expire}")`);
    }

    async function incrementPointsRequest(options: RateOptions) {; 
        const {ip, path, duration} = options;
        const expire = initExpireDate(duration);
        const result = await connection.query(`UPDATE RateLimiter SET points = points + 1 , expire = "${expire}" where ipAddress = "${ip}" AND path = "${path}"`);
        return result;
    }

    async function refrechExpireDate(options : RateOptions) {
        const expire = initExpireDate(options.duration); 
        await connection.query(`UPDATE RateLimiter SET expire = "${expire}", points = 1 where ipAddress = "${options.ip}" AND path = "${options.path}"`);
    }


    function rateLimitermiddleware(options: RateOptions = {}) {
        options.duration = options.duration ?? 10000;
        options.points   = options.points ?? 10;
        
        async function process(ip: string, urlPath: string) : Promise<EndPoint> {
            options.ip   = ip;
            options.path = options.path ?? urlPath;
            const isIpRated = await getTheIpRateLimite(options); 

            // check if the ipAddress is not regester in the rateLimiter db
            // if is not so register that ipAddress
            if(isIpRated.length == 0) {
                await regesterIpAddress(options);
                // return {success : true, data: `Regester This Ip (${ip})`};
                return {success : true, data: `Next`};
            }
            
            const client     = isIpRated[0];
            const isExpire   = Date.now().valueOf() >= Number(client.expire);

            /**
             * if Expire is = true that means the expire time is finish so that 
             * let points = 1 and set new expire date to allow make new requests
             */
            if(isExpire) {
                await refrechExpireDate(options);
                // return {success : true, data: 'Refrech new Expire date'};
                return {success : true, data: 'Next'};
            }

            /**
             * is isReachedLimit = true taht it well be stop any request come before expireTime
             * but after expire the time that step allow client make requests again 
             */
            const isReachedLimit = ( parseInt(client.points) >= options.points );

            if(isReachedLimit){
                return {success: false, data: `The ipAddress on this Path is Reached Limit (${client.points})`};
            } 

            /**
             * when any new request come the points value is increment by plus +1 
             * after any request to stop client make request after points value reached The limite 
             * that set in {RateOptions}.points Object
             */
            await incrementPointsRequest(options);
            // return {success: true, data: `the points is not reached limit yet (${client.points})`};
            return {success : true, data: 'Next'};
        }

        return async function (req : Request, res: Response, next: NextFunction) {  
            try {
              await connection.connect();
              const result = await process(req.ip, req.originalUrl);
              await connection.endConnect();
              if(result.success) next();
              else res.send(result.data);
            } 
            catch(err) {
              res.send(err);
              await connection.endConnect();
            }
        }         
    }

    export { rateLimitermiddleware }