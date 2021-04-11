// import * as knex from 'knex';
import knex = require('knex');
const request = require("request");

export class GetTokenModel {

    async select(user:any,password_hash:any,hospital_code:any) {
        return await new Promise((resolve: any, reject: any) => {

          var options = {
            method: 'GET',
            url: `https://cvp1.moph.go.th/token?Action=get_moph_access_token&user=${user}&password_hash=${password_hash}&hospital_code=${hospital_code}`,
            agentOptions: {
              rejectUnauthorized: false
            },
            headers:
            {
              'cache-control': 'no-cache',
              'content-type': 'application/json',
            },
            json: true
          };
          // console.log(options);
          
          request(options, function (error, response, body) {
            if (error) {
              reject(error);
            } else {
              resolve(body);
            }
          });
        });
      }
      async select_setup(dbHIS: knex) {

        let sql = `
        select * from hi_setup WHERE id = 14
        `;
    
        return await dbHIS.raw(sql)
      }
      async select_hcode(dbHIS: knex) {

        let sql = `
        select setup.hcode from setup
        `;
    
        return await dbHIS.raw(sql)
      }

      async insert_covid(token, info) {
        console.log(info);
        
        return await new Promise((resolve: any, reject: any) => {
          var options = {
            method: 'POST',
            url: `https://cvp1.moph.go.th/api/UpdateImmunization`,
            agentOptions: {
              rejectUnauthorized: false
            },
            headers:
            {
              'cache-control': 'no-cache',
              'content-type': 'application/json',
              'authorization': `Bearer ${token}`,
            },
            body: info
            ,
            json: true
          };
    
          request(options, function (error, response, body) {
            if (error) {
              reject(error);
            } else {
              resolve(body);
            }
          });
        });
      }
}