import { mysql } from "../../../Core/Config/db.knex.config";

export class BalanceModule {
    
    async getBalance(): Promise<number> {
        const balance = await mysql.select('balance').from('accountInfo');
        return balance['balance'];
    }

    async incrementBalance(clientId: string, badget: number) {
        // ...
    }

    async decrimentBalacne(clientId: string, badget: number) {
        // ...
    }
}