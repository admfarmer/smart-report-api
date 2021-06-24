import Knex = require('knex');

export class AdmissionModels {
  tableName: string = 'admission';

  insert(knex: Knex, info: any) {
    return knex(this.tableName)
      .insert(info);
  }

  async viewAdmissionAN(knex: Knex) {

    let sql = `
      SELECT an FROM admission ORDER BY an DESC  limit 1
    `;
    return await knex.raw(sql)
  }

  async insertAdmission(knex: Knex,info: any) {

    let sql = `
    insert into admission (an,pname,fname,lname,gender,dob,cid,address,contact_number,contact_name,phistory,med_reconcile,cc,covid_register,allergy,hn,age) 
    VALUES ('${info.an}','${info.pname}','${info.fname}','${info.lname}','${info.gender}','${info.dob}','${info.cid}','${info.address}','${info.contact_number}','${info.contact_name}','${info.med_reconcile}','${info.cc}','${info.covid_register}','${info.allergy}','${info.hn}','${info.age}') 
    ON DUPLICATE KEY UPDATE an = '${info.an}',pname = '${info.pname}',fname = '${info.fname}',lname = '${info.lname}',gender = '${info.gender}',dob = '${info.dob}',cid = '${info.cid}',address = '${info.address}',contact_number = '${info.contact_number}',contact_name = '${info.contact_name}',med_reconcile = '${info.med_reconcile}',cc = '${info.cc}',covid_register = '${info.covid_register}',allergy = '${info.allergy}',hn = '${info.hn}',age = '${info.age}'
    `;
    return await knex.raw(sql)
  }
}