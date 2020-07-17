import * as knex from 'knex';

export class QueryViewsModel {

  viewReport(dbHIS: knex, query: any, params: any) {
    let sql = query;
    return dbHIS.raw(sql, params)
  }

  viewReportNoParam(dbHIS: knex, query: any) {
    let sql = query;
    return dbHIS.raw(sql)
  }

}