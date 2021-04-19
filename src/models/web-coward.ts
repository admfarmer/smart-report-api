import Knex = require('knex');

export class AdmissionModels {
  tableName: string = 'admission';
  insert(knex: Knex, info: any) {
    return knex(this.tableName)
      .insert(info);
  }

}