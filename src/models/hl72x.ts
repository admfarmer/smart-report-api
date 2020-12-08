import Knex = require('knex');

export class Hl7Models {

  async getVn(knex: Knex, hn: any) {
    console.log(hn);
    let data = await knex.raw(`select vn from ovst where hn = ${hn} and date(vstdttm) = date(now())`)
    return data[0];
  }

  async getHn(knex: Knex, hn: any) {
    console.log(hn);
    let data = await knex.raw(`
    select pt.hn,pt.pname,pt.fname,pt.lname 
    from ovst 
    INNER JOIN pt on pt.hn = ovst.hn
    where ovst.hn = ${hn}
    and date(ovst.vstdttm) = date(now())
    ORDER BY ovst.vn DESC limit 1
    `)
    return data[0];
  }

  async getLastVn(knex: Knex, PID: any) {
    console.log(PID);
    let data = await knex.raw(`select vn from ovst where hn = ${PID} and date(vstdttm) = date(now()) limit 1`)
    return data[0];
  }

  getPID(knex: Knex, CID: any) {
    return knex('pt')
      .select('hn')
      .where('pop_id', CID)
  }

  update(knex: Knex, vn: any, data: any) {
    return knex('ovst')
      .where('vn', vn)
      .update(data);
  }

  updateBP(knex: Knex, vn: any, _info: any) {
    return knex.raw(`update ovst set dbp = ${_info.DIASTOLIC},sbp = ${_info.SYSTOLIC}, pr= ${_info.PULSE} where vn = ${vn}`);
  }

  updateBW(knex: Knex, vn: any, _info: any) {
    return knex.raw(`update ovst set bw = ${_info.WEIGHT},height = ${_info.HEIGHT}, bmi= ${_info.BMI} where vn = ${vn}`);
  }
  updateBP_o(knex: Knex, vn: any, _info: any, table: any) {
    return knex.raw(`update ${table} set dbp = ${_info.DIASTOLIC},sbp = ${_info.SYSTOLIC}, pr= ${_info.PULSE} where vn = ${vn}`);
  }

  updateBW_o(knex: Knex, vn: any, _info: any, table: any) {
    return knex.raw(`update ${table} set bw = ${_info.WEIGHT},height = ${_info.HEIGHT}, bmi= ${_info.BMI} where vn = ${vn}`);
  }
}