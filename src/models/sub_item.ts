import Knex = require('knex');

export class SubMenuItemModels {
  tableName: string = 'rep_query_item';

  listall(knex: Knex) {
    return knex(this.tableName)
      .orderBy('query_id', 'DESC');
  }


  select(knex: Knex, data: any) {
    return knex(this.tableName)
      .whereNotIn('query_id', data)

  }

  insert(knex: Knex, data: any) {
    return knex(this.tableName)
      .insert(data);

  }

  listone(knex: Knex, query_id: any) {
    return knex(this.tableName)
      .where('query_id', query_id);

  }

  selectlevel(knex: Knex, item_id: any, userLevel: any) {
    return knex(this.tableName)
      .where('item_id', item_id)
      .andWhere(function () {
        this.where('level_id', '=', userLevel)
      })
  }

  listtwo(knex: Knex, item_id: any, userLevel: any) {
    return knex(this.tableName)
      .where('item_id', item_id)
      .andWhere(function () {
        this.where('level_id', '<=', userLevel)
          .orWhere(function () {
            this.orWhere('level_id', '=', '0')
              .orWhere('level_id', '=', '')
              .orWhereNull('level_id')
          })
      })
  }

  save(knex: Knex, data: any) {
    return knex(this.tableName)
      .insert(data);
  }

  update(knex: Knex, query_id: any, data: any) {
    return knex(this.tableName)
      .where('query_id', query_id)
      .update(data);
  }

  del(knex: Knex, query_id: any) {
    return knex(this.tableName)
      .where('query_id', query_id)
      .del();
  }

}