import Knex = require('knex');

export class AdmissionModels {
  tableName: string = 'admission_copy1';
  insert(knex: Knex, info: any) {
    return knex(this.tableName)
      .insert(info);
  }

}