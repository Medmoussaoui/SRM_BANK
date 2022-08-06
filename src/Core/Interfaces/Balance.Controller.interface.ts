export interface IBalanceController {

    transferBalance(req,res): any;
    /**
     * this methode we gona use it to send badget of money from this 
     * client account by senderId to other person by publicClientId
     * @param badget
     * @param senderId
     * @param publicClientId
     */

    pullBalance(req,res): any;
    /**
     * this methode we gona use it to regester any action of pull balance
     * from ATM of bank region the information we gona register is 
     * datetime and the bankId any diffrent bank region has unique bankId,
     * and badget pull and clientId
     * @param datetime
     * @param bankId
     * @param badget
     * @param clientId
     */

    putBalance(): any;

    getBalanceInfo(): any;


}