class BalanceModule {
    async getBalance(): Promise<number> {
        // ...
        return 10;
    }

    incrementBalance(clientId: string, badget: number) {
        // ...
    }

    decrimentBalacne(clientId: string, badget: number) {
        // ...
    }
}