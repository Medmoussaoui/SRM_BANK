import { TransferDetailsOptions } from "../../../Core/Types/BalanceTypes";
import { EndPoint } from "../../../Core/Helper/endpoint";
import { mysql } from '../../../Core/Config/db.knex.config';


export class TransferDetailsModule {


    async insertTransferSenderDetails(transfer: TransferDetailsOptions, recordId: string): Promise<EndPoint> {
        // ...
        try {
            const insert = {
                badget: transfer.badget,
                recordId: recordId,
                recieverId: transfer.recieverId,
            };
            const insertResult = await mysql.insert(insert).into('SendTransferDetails');
            return { data: insertResult, success: true, statusCode: 200 }
        }
        catch (err) {
            return { success: false, error: 'server Error Happen try later' }
        }

    }

    async insertTransferRecieverDetails(transfer: TransferDetailsOptions, recordId: number) {
        try {
            const insert = {
                badget: transfer.badget,
                recordId: recordId,
                senderId: transfer.senderId,
            };
            const insertResult = await mysql.insert(insert).into('RecievedTransferDetails');
            return { data: insertResult, success: true, statusCode: 200 }
        }
        catch (err) {
            return { success: false, error: 'server Error Happen try later' }
        }
    }
}


