import { EndPoint } from "../../../../Core/Helper/endpoint";
import { TransferBalanceErrors } from "./TransferBalanceErrors";
import { BalanceModule, TransferDetailsModule } from "../../../../Modules/BalanceModule/index";
import { RecordsModule } from "../../../../Modules/RecordsModule/class/RecordsModule";
import { TransferDetailsOptions } from "../../../../Core/Types/BalanceTypes";


export class TransferBalanceController {

    private errors: TransferBalanceErrors;
    public options: TransferDetailsOptions;
    private transferDetailsModule: TransferDetailsModule;
    private balanceModule: BalanceModule;
    private recordsModule: RecordsModule

    constructor(options: TransferDetailsOptions) {
        this.errors = new TransferBalanceErrors();
        this.options = options;
        this.balanceModule = new BalanceModule();
        this.recordsModule = new RecordsModule();
        this.transferDetailsModule = new TransferDetailsModule();
    }

    private async transferBalance(): Promise<EndPoint> {
        const promises = []
        promises.push(this.balanceModule.incrementBalance(this.options.recieverId, this.options.badget));
        promises.push(this.balanceModule.decrimentBalacne(this.options.senderId, this.options.badget));
        try {
            const [reciever, sender] = await Promise.all(promises);
            return { success: true }
        }
        catch (err) {
            return { success: false }
        }
    }

    private async setTransferRecords(): Promise<EndPoint> {
        try {
            // Insert Transfer Records Notifications
            let transferRecords = [];
            transferRecords.push(this.recordsModule.create(this.options.senderId, 'recordSender'));
            transferRecords.push(this.recordsModule.create(this.options.recieverId, 'recordReciever'));
            const [senderRecordsId, recieverRecordId] = await Promise.all(transferRecords);
            
            // Insert Transfer Details
            let transferDetails = [];
            transferDetails.push(this.transferDetailsModule.insertTransferSenderDetails(this.options, senderRecordsId));
            transferDetails.push(this.transferDetailsModule.insertTransferRecieverDetails(this.options, recieverRecordId));
            const [senderDetails, recieverDetails] = await Promise.all(transferDetails);
            
            return { success: true, statusCode: 200 }
        } catch (err) {
            return { success: false, error: err['message'] }
        }
    }

    public async send(): Promise<EndPoint> {

        const balanceAccount = await this.balanceModule.getBalance();

        if (balanceAccount < this.options.badget) {
            return this.errors.balanceNotEnough();
        }
        const setRecords = await this.setTransferRecords();

        if (setRecords.success) {
            return await this.transferBalance();
        }
        return setRecords;
    }



}