// import * as knex from 'knex';
import knex = require('knex');

export class ViewsVisitModel {

  async viewVisit19(dbHIS: knex, todate: any,treat_no:any) {

    let sql = `
    Select  o.vn,o.hn,
    concat(getPname(p.male, TIMESTAMPDIFF(Year, p.brthdate, Now()), p.mrtlst), p.fname,' ',p.lname) AS ptname 
    ,(SELECT hi_hsp_nm FROM setup LIMIT 1) As hospname
    ,p.hometel AS contact
    ,TIME(date_add(NOW(), interval 30 minute)) AS observ 
    ,h.namehpt
    ,e.lotno
    ,e.serial_no
    ,concat(d.fname,' ',d.lname) AS provider 
    ,DATE_FORMAT(o.vstdttm,'%Y-%m-%d') AS v1 
    ,s.fudate,'N' as staus_flg
    FROM
    hi.ovst AS o 
    INNER Join hi.epi AS e ON o.vn=e.vn 
    INNER Join hi.pt AS p ON o.hn=p.hn 
    Left Join hi.hpt AS h ON e.vac=h.codehpt 
    Left Join hi.dct AS d ON (case LENGTH(e.dct) when 5 then e.dct=d.lcno ELSE substr(e.dct,1,2)=d.dct END)
    Left Join hi.plan_treat AS t ON e.vn=t.vn
    Left Join hi.schedules AS s ON t.plan_id=s.plan_id and s.treat_no = '${treat_no}'
    WHERE Date(o.vstdttm)='${todate}' AND s.fudate IS NOT null
    `;

    return await dbHIS.raw(sql)
  }

}