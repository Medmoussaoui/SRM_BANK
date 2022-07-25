import { IBalanceController } from "../../Core/Interfaces/Balance.Controller.interface";
import { FormSheama } from "../../Core/class/Validation";
import { SendBalance } from "./class/sendBalance";
import * as connecion from '../../Core/Helper/MySQL_Functions';

const sendBalanceSheama: FormSheama = new FormSheama(
    [
        {
            type: 'number',
            isRequired: true,
            max: 100000,
            min: 100,
            key: 'badget'
        },
        {
            type: 'number',
            isRequired: true,
            max: 80,
            min: 10,
            key: 'recieverId'
        },
    ]
);

export class BalanceController implements IBalanceController {

    sendBalance() {
        return async (req, res) => {

            const isValid = sendBalanceSheama.validate(req.body);
            if (isValid == false) {
                return res.status(400).send('Bad Request');
            }

            const sendBalance = new SendBalance(req.body);
            await connecion.connect();

            const success = await sendBalance.send();
            await connecion.endConnect();

            if (success.success) {
                return res.status(200).send(success.data);
            }
            res.status(success.success).send(success.error);
        }
    }

    pullBalance() {
        throw new Error("Method not implemented.");
    }

    getBalanceInfo() {
        throw new Error("Method not implemented.");
    }

}