import express from 'express';
import { administration } from './Routers/administration';
import session from 'express-session';
import { sessionOptions } from './Core/Config/session.config';
import { auth } from './Routers/auth';
import { sendCodeVerifyLogin } from './Core/services/Emails/Verification.mails';
import helmet from 'helmet';
import { balanceRouter } from './Routers/balance';


const app = express();


// Middlewares //
app.use(session(sessionOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());

// Routes //
app.use('/auth', auth);
app.use('/balance', balanceRouter);



app.get('/sendMail', async (req, res) => {
  try {
    const responce = await sendCodeVerifyLogin(req.body);
    res.send(responce);
  }
  catch (err) {
    console.log(err);
    res.send('err');
  }
});

app.get('/', (req, res) => {
  req.session['email'] = "moussaouifilm16@gmail.com";
  req.session.save((err) => {
    res.send('CHECK SESSION DATABASE')
  })
});









app.listen(3000, () => console.log('Server Runing On Port ...'));