import { IBalanceController } from "../../Core/Interfaces/Balance.Controller.interface";
import { FormSheama } from "../../Core/class/Validation";
import { TransferBalanceController } from "./class/TransferBalance/TransferBalanceController";

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

    async transferBalance(req, res) {

        const isValid = sendBalanceSheama.validate(req.body);
        if (isValid == false) {
            return res.status(400).send('Bad Request');
        }

        const sendBalance = new TransferBalanceController(req.body);
        const success = await sendBalance.send();

        if (success.success) {
            return res.status(200).send(success.data);
        }
        res.status(success.success).send(success.error);

    }

    pullBalance(req,res) {
        throw new Error("Method not implemented.");
    }

    putBalance() {
        throw new Error("Method not implemented.");
    }

    getBalanceInfo() {
        throw new Error("Method not implemented.");
    }

}