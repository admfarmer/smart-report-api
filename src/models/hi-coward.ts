// import * as knex from 'knex';
import knex = require('knex');

export class ViewsAdmitModel {

  async viewCoWard(dbHIS: knex) {

    let sql = `
    select 
    i.an
    ,if(p.pname='',getPname(p.male,timestampdiff(year,p.brthdate,now()),p.mrtlst),p.pname) as pname
    ,p.fname
    ,p.lname
    ,p.male as gender
    ,p.brthdate as dob
    ,p.pop_id as cid
    ,concat(p.addrpart,ifnull(getAddress(p.moopart,p.tmbpart,p.amppart,p.chwpart),'')) as address
    ,replace(p.hometel,'-','') as contact_number
    ,concat(p.infmname,' (',p.infmtel,')') as contact_name
    ,group_concat(l.pillness order by l.id SEPARATOR ' ') as phistory 
    ,'' as med_reconcile
    ,group_concat(s.symptom order by s.id SEPARATOR ' ') as cc
    ,'' as covid_register
    ,p.allergy
    ,p.hn
    ,timestampdiff(year,p.brthdate,now()) as age
    ,'0' as is_admit
    ,'' as bed
    ,if(p.male=1,2,1) as ward_id
    from hi.ipt as i 
    inner join hi.pt as p on i.hn=p.hn 
    left join hi.pillness as l on i.vn=l.vn 
    left join hi.symptm as s on s.vn=i.vn
    where i.an > 64000585 -- an ล่าสุดที่ admit 
    group by an
    `;
    return await dbHIS.raw(sql)
  }

}