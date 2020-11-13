// import * as knex from 'knex';
import knex = require('knex');

export class QueryViewsModel {

  async viewReport(dbHIS: knex, query: string, params: any) {

    let sql = query;
    return await dbHIS.raw(sql, params)
  }

  async viewReportNoParam(dbHIS: knex, query: any) {
    let sql = query;
    return await dbHIS.raw(sql)
  }

}