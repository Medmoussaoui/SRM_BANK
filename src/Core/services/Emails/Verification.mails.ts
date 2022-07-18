import fetch from "node-fetch";
import { mailerServiceURL } from ".";
import { postMethode } from "../../functions/Post_Methode";

export async function sendCodeVerifyLogin(data:{}) : Promise<any> { 
  const options = postMethode(data);
  const res  = await fetch(`${mailerServiceURL}/verify/login`, options);

  const resData = {
    statusCode: res.status,
    data:       undefined
  }

  resData.data = await res.text();
  return resData;
}