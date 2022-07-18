import { RecordsModuleInterface, RecordsOptions } from "../Core/Interfaces/Records.Module.Interface";
import * as connection from '../Core/functions/MySQL_Functions';


export class RecordsModule implements RecordsModuleInterface {

    async getRecordsByRecordType(recordsOptions: RecordsOptions): Promise<any> {
        const {accountId, recordsType, filterByDate} = recordsOptions; 
        let where = `account_id = "${accountId}"`;
        let joinTables = '';
        if(recordsType == 'all'){
            joinTables += 'JOIN send_records on recieved_records.account_Id = history_records.account_id ';
            joinTables += 'JOIN recieved_records on recieved_records.account_Id = history_records.account_id ';
            joinTables += 'JOIN pull_records on pull_records.account_Id = history_records.account_id ';
            joinTables += 'JOIN withdraw_records on withdraw_records.account_Id = history_records.account_id ';
        }
        else {
            where += `AND history_records.records_type = "${recordsType}"`
        }
        if(filterByDate != undefined){
            where += ` AND history_records.date BETWEEN "${filterByDate.from}" AND "${filterByDate.to}"`; 
        }
        try {
            const result = await connection.query(`SELECT * FROM history_records ${joinTables} ${where}`);
            return result;
        } 
        catch(err) {
           return err
        }
    }
    async signRecordVisite(record_id: string, accountId: string): Promise<any> {
        const query = `UPDATE history_records SET isVisite = 1 where record_id = "${record_id}" AND accountId = "${accountId}"`;
        const res   = await connection.query(query);
        return res;
    }

}