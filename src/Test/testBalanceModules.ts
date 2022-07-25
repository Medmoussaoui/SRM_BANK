import { BalanceModule } from "../Modules/BalanceModule/BalanceModule";

/**
 * clients Ids Test:
 * - msds4d5s65d65fd
 * - sdsfsd55ds54qd
 * - sdqdqsf54d85dsqd
 * - sq5d45qsd4qs5f4dq
 * - ds545q4dq5s45d4s
 */

export function testGetBalance(clientId: string) {
    const module = new BalanceModule();
    module.getBalance();

}