import Knex = require('knex');

export class UserTypeModels {
  tableName: string = 'rep_user_type';

  info(knex: Knex) {
    return knex(this.tableName)
  }

  seve(knex: Knex, data: any) {
    return knex(this.tableName)
      .insert(data);
  }

  update(knex: Knex, type_id: any, data: any) {
    return knex(this.tableName)
      .where('type_id', type_id)
      .update(data);
  }

  del(knex: Knex, type_id: any) {
    return knex(this.tableName)
      .where('type_id', type_id)
      .del();
  }

}