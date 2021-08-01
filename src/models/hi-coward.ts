// import * as knex from 'knex';
import knex = require('knex');

export class ViewsAdmitModel {

  async viewCoWard(dbHIS: knex,an:any) {
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
    ,(SELECT group_concat(l.pillness order by l.id SEPARATOR ' ') from hi.pillness as l where l.vn = i.vn ) as phistory
    ,'' as med_reconcile
    ,(SELECT group_concat(s.symptom order by s.id SEPARATOR ' ') from hi.symptm as s where s.vn = i.vn ) as cc
    ,'' as covid_register
    ,p.allergy
    ,p.hn
    ,timestampdiff(year,p.brthdate,now()) as age
    ,'0' as is_admit
    ,'' as bed
    ,if(p.male=1,2,1) as ward_id
    ,i.rgtdate as admission_date
    from hi.ipt as i 
    inner join hi.iptdx as iptdx on iptdx.an = i.an 
    inner join hi.pt as p on i.hn=p.hn 
    where i.an > ${an} -- an ล่าสุดที่ admit 
    and iptdx.icd10 in ('U071')
    group by an
    `;
    return await dbHIS.raw(sql)
  }

  async viewCoWardOpd(dbHIS: knex) {
    let sql = `
    select
    o.vn as an
		,if(p.pname='',getPname(p.male,timestampdiff(year,p.brthdate,now()),p.mrtlst),p.pname) as pname
    ,p.fname
    ,p.lname
    ,p.male as gender
    ,p.brthdate as dob
    ,p.pop_id as cid
    ,concat(p.addrpart,ifnull(getAddress(p.moopart,p.tmbpart,p.amppart,p.chwpart),'')) as address
    ,replace(p.hometel,'-','') as contact_number
    ,concat(p.infmname,' (',p.infmtel,')') as contact_name
    ,(SELECT group_concat(l.pillness order by l.id SEPARATOR ' ') from hi.pillness as l where l.vn = o.vn ) as phistory
    ,'' as med_reconcile
    ,(SELECT group_concat(s.symptom order by s.id SEPARATOR ' ') from hi.symptm as s where s.vn = o.vn ) as cc
    ,'' as covid_register
    ,p.allergy
    ,p.hn
    ,timestampdiff(year,p.brthdate,now()) as age
    ,'0' as is_admit
    ,'' as bed
    ,'5' as ward_id
    ,date(o.vstdttm) as vstdttm
    from ovst as o
		inner join xryrgt on xryrgt.vn=o.vn 
    inner join xryrqt on xryrqt.vn=o.vn
    inner join ovstdx as ovstdx on ovstdx.vn = o.vn
    inner join pt as p on o.hn=p.hn 
    where o.an < 1
    and ovstdx.icd10 in ('U071','U129') 
		and (xryrgt.xrycode = '0147' or xryrqt.xrycode = '0147')
		and date(o.vstdttm) = CURRENT_DATE
    group by o.hn ORDER BY o.vn
    `;
    return await dbHIS.raw(sql)
  }

  async viewCoWardVn(dbHIS: knex,hn:any) {
    let sql = `
    SELECT vn  FROM ovst WHERE hn =  ${hn} 	ORDER BY vn desc limit 1
    `;
    return await dbHIS.raw(sql)
  }
}