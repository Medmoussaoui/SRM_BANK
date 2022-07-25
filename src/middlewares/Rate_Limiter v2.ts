import * as connection from '../Core/Helper/MySQL_Functions'

export interface RateOptions {
    /* The expire Properties Set expire expire time as ms */
    expire?: number,
    /* The path properties it's the route of the specefic
    * rate limite Part in the application
    */
    limiterName?: string,
    /* the points properties it's number of requests allowed to make */
    points?: number,
}

interface LimitInstance {
    id?: string,
    points?: number,
    reachedLimit?: boolean
}


class RateLimiter {

    options: RateOptions = {};

    constructor(options?: RateOptions) {
        this.initialOptions(options);
    }

    private initialOptions(options: RateOptions = {}) {
        this.options.limiterName = options.limiterName ?? 'default';
        this.options.expire = options.expire ?? 30000
        this.options.points = options.points ?? 10;
    }

    async createTable(): Promise<any> {
        try {
            const result = await connection.query(
                `CREATE TABLE IF NOT EXISTS RateLimiter(
                    id VARCHAR(255) NOT NULL,
                    points int NOT NULL,
                    limiterName VARCHAR(255) NOT NULL,
                    expire VARCHAR(255) NOT NULL
                )`
            );
        }
        catch (err) {
            return err;
        }
    }

    async getInstance(id): Promise<LimitInstance | undefined> {
        const queryResult = await this.select(id);
        if (queryResult == undefined) return;
        
        const isExpired = this.isDateExpired(queryResult[0]);
        if (isExpired) {
            await this.delete(id);
            return;
        }
        
        const instance: LimitInstance = {}
        instance.reachedLimit = this.IsRachedLimit(queryResult[0]);
        instance.points       = queryResult[0].points;
        instance.id           = id;
        return instance;
    }

    private IsRachedLimit(instance): boolean {
        return parseInt(instance.points) >= this.options.points!;
    }

    private isDateExpired(instance) {
        return Date.now().valueOf() >= Number(instance.expire);
    }

    // Generate The Expire Date
    private initExpireDate = (expire: number) => Date.now().valueOf() + expire;

    private async select(id): Promise<any> {
        const res = await connection.query(
            `SELECT * FROM RateLimiter where id = "${id}" AND limiterName = "${this.options.limiterName}"`
        );
        return (res.length == 0) ? undefined : res[0];
    }

    // Regester the new id to make request with spesific path to Rate limite on this particuler path
    async insert(id) {
        const { expire, limiterName } = this.options;
        const expireDate = this.initExpireDate(expire!);
        await connection.query(`INSERT INTO RateLimiter (id, points, limiterName, expire) VALUES("${id}", "1", "${limiterName}", "${expireDate}")`);
    }

    async delete(id) {
        const { limiterName } = this.options;
        await connection.query(`DELETE FROM RateLimiter where id = "${id}" AND limiterName = "${limiterName}"`);
    }

    async increment(id) {
        const { limiterName, expire } = this.options;
        const expireDate = this.initExpireDate(expire!);
        const result = await connection.query(`UPDATE RateLimiter SET points = points + 1 , expire = "${expireDate}" where id = "${id}" AND limiterName = "${limiterName}"`);
        return result;
    }
}


export { RateLimiter }