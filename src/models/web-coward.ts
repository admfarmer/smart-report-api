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
    return knex(this.tableName)
      .insert(info);
  }
}