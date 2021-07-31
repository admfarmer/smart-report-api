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

  async viewAdmissionHn(knex: Knex) {
    let sql = `
    SELECT an,hn FROM admission WHERE ward_id = 5 ORDER BY an DESC  limit 1
    `;
    return await knex.raw(sql)
  }

  async viewAdmission_is_admit(knex: Knex,hn:any) {
    let sql = `
    SELECT hn  FROM admission WHERE ward_id = 5 and hn = ${hn} and is_admit = 1 ORDER BY an DESC  limit 1
    `;
    return await knex.raw(sql)
  }

  async insertAdmission(knex: Knex,info: any) {
    return knex(this.tableName)
      .insert(info);
  }
  
  async insertXrayOpd(knex: Knex,info: any) {
    return knex('ptsign')
      .insert(info)
  }

}