import express from 'express';

export const administration = express.Router();


administration.get('/',(req,res) => res.send('Administraion Route'));

administration.get('/client', (req, res) => {});

