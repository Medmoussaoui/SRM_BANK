import express from 'express';
import { BalanceController } from '../Controller/index';


export const balanceRouter = express.Router();

const balanceController = new BalanceController();

balanceRouter.post('/transfer', (req, res) => balanceController.transferBalance(req, res));

balanceRouter.post('/pull', (req, res) => balanceController.pullBalance(req, res));

