import { Request, Response } from "express";
import { RecordsModule } from "../../Modules/records.Model";
import { IRecordsController } from "../../Core/Interfaces/Records.Controlles.interface";

let expectedRecordes : string[] = [
  'deposit_records' ,
  'pull_records' ,
  'send_records' ,
  'recieved_records',
  'all'
];

export class RecordsController implements IRecordsController  {

  recordsMd : RecordsModule = new RecordsModule();


  getRecordsByRecordType() {
    return async (req: Request, res: Response) => {
      const recordType = req.body;

      const included = expectedRecordes.includes(recordType);
      
      // Stop here Because the RecordType Is Not valid so can't get any records
      if(included == false) return res.status(401).send('The Record Type passed is Invalid');

      // RecordType passed is valid
      let records = await this.recordsMd.getRecordsByRecordType(recordType);

      // Send Records To Client
      res.send(records);
    }
  }


  getRecordsWithAllType() {
    throw new Error("Method not implemented.");
  }


  signVisiteRecord() {
    throw new Error("Method not implemented.");
  }

}