import * as connection from '../Core/Helper/MySQL_Functions';

export interface ClientCredentials {
  email:    string,
  password: string
}

interface FormSignUp {
  email:    string,
  password: string,
  fullname: string,
  birthDay: string
}

export class ClientModule {

  async getUserByEmail(email: string) : Promise<ClientCredentials> {
    const  client = await connection.query(`SELECT email, password FROM clients where email = "${email}"`);
    return client[0];
  }

  async getEmail(email: string):Promise<any> {
    const  findEmail = await connection.query(`SELECT email FROM clients where email = "${email}"`);
    return findEmail[0];
  }

  async addNewAccount(form: FormSignUp) : Promise<any> {
    try {
      await connection.query(`INSERT INTO clients(email,password) VALUES ("${form.email}" , "${form.password}")`);
      return true;
    } 
    catch(err) {
      return err;
    }
  }
}