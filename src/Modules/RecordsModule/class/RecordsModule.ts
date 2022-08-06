import { mysql } from "../../../Core/Config/db.knex.config";
import { DateBetween, RecordFilter, RecordType } from "../../../Core/Types/RecordTypes";


export class RecordsModule {

    async create(accountId: string, recordType: RecordType): Promise<any> {
        const data = { accountId: accountId, recordType: recordType };
        const recordId = mysql.insert(data, ['recordId']).into('Records');
        return recordId;
    }

    async delete(recordId: string, accountId?: string) { }

    async getAllRecords(accountId: string, filterDate: DateBetween) { }

    async getRecordsTransferSender(accountId: string, filter: RecordFilter) { }

    async getRecordsTransferReciever(accountId: string, filter: RecordFilter) { }

    async getRecordsPull(accountId: string, filter: RecordFilter) { }

    async getRecordsPut(accountId: string, filter: RecordFilter) { }

    async getRecordById(recordId: number, accountId?: string) { }
}