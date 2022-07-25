import { EndPoint } from "../../../Core/Helper/endpoint";
import { SendBalanceModule } from "../../../Modules/BalanceModule/SendBalanceModule"
import { SendBalanceErrors } from "./sendBalanceErrors";

interface SendBalanceOptions {
    senderId: string,
    receiverId: string,
    badget: number
}

export class SendBalance extends BalanceModule {

    public errors: SendBalanceErrors;
    public options: SendBalanceOptions;
    private sendBalanceModule: SendBalanceModule;


    constructor(options: SendBalanceOptions) {
        super();
        this.options = options;
        this.errors = new SendBalanceErrors();
        this.sendBalanceModule = new SendBalanceModule();
    }

    async transferBalance(): Promise<EndPoint> {
        const fetch = []
        fetch.push(super.incrementBalance(this.options.receiverId, this.options.badget));
        fetch.push(super.decrimentBalacne(this.options.senderId, this.options.badget));
        try {
            const [reciever, sender] = await Promise.all(fetch);
            return { success: true }
        }
        catch (err) {
            return { success: false }
        }
    }

    async setRecordTransfer(): Promise<EndPoint> {
        let fetch = [];
        fetch.push(this.sendBalanceModule.insertSenderRecord());
        fetch.push(this.sendBalanceModule.insertRecieverRecord());
        try {
            const [sender, reciever] = await Promise.all(fetch);
            return { success: true }
        }
        catch (err) {
            return { success: false }
        }
    }

    async send(): Promise<EndPoint> {

        const balanceAccount = await this.getBalance();
        if (balanceAccount < this.options.badget) {
            return this.errors.balanceNotEnough();
        }

        const transfer = await this.transferBalance();
        if (transfer.success) {
            return await this.setRecordTransfer();
        }
        
        return transfer;
    }



}