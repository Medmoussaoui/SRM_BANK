import mysql from "mysql";
import { connectionOptions } from "../Config/db.config";


// Create db Connection Instance
let sql = mysql.createConnection(connectionOptions);

// --> Initial Async functions

// Open connection with database
async function connect() : Promise<boolean> {
  return new Promise((resolve, reject) => {
    sql.connect((err) => {
      if(err) return reject(err);
      resolve(true);
    });
  });
}

// End Connection With Database
async function endConnect() : Promise<boolean> {
  return new Promise((resolve, reject) => {
    sql.end((err) => {
      if(err) reject(err);
      sql = mysql.createConnection(connectionOptions); 
      resolve(true);
    });
  });
}

// make sure to call this function after call connect() function 
function query(query: string) : Promise<any> {
  return new Promise((resolve, reject) => {
    sql.query(query,(err,result,failds) => {
      if(err) return reject(err);
      resolve(result);
    });
  });
}

// Export the Connection Instance
export {
  query,
  endConnect,
  connect,
  sql
};
