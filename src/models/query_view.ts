// import * as knex from 'knex';
import knex = require('knex');

export class QueryViewsModel {

  async viewReport(dbHIS: knex, query: string, params: any) {
    let sql = `set @datestart = ?; set @dateend =? ;  set @icd10 = ?; SELECT icd10,count(o.vn) as total from ovst as o inner join ovstdx as x on o.vn=x.vn where date(o.vstdttm) between @datestart and @dateend and x.icd10 = @icd10`;

    // let sql = query;
    return await dbHIS.raw(sql, params)
  }

  async viewReportNoParam(dbHIS: knex, query: any) {
    let sql = query;
    return await dbHIS.raw(sql)
  }

}