import Knex = require('knex');

export class MenuItemModels {
  tableName: string = 'rep_menu_item';

  listall(knex: Knex) {
    return knex(this.tableName)
  }

  info(knex: Knex) {
    return knex(this.tableName)
      .where('item_status', 'Y')
  }

  selectgroup(knex: Knex, querygroups: any) {
    return knex(this.tableName)
      .whereIn('item_id', querygroups)
  }

  listone(knex: Knex, menu_id: any) {
    return knex(this.tableName)
      .where('menu_id', menu_id)
      .andWhere('item_status', 'Y');
  }

  save(knex: Knex, data: any) {
    return knex(this.tableName)
      .insert(data);
  }

  update(knex: Knex, item_id: any, data: any) {
    return knex(this.tableName)
      .where('item_id', item_id)
      .update(data);
  }

  del(knex: Knex, item_id: any) {
    return knex(this.tableName)
      .where('item_id', item_id)
      .del();
  }

}