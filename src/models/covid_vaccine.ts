// import * as knex from 'knex';
import knex = require('knex');

export class CovidVaccineModel {

  async patient(dbHIS: knex, hn: any) {

    let sql = `
    select 
    if(pt.ntnlty=99, pt.pop_id,pt.cidmophic)  as cid
    ,passport as passport_no
    ,hn
    , concat('{',pt_guid,'}') as patient_guid
    ,IF(pt.pname!='',pt.pname,getPname(pt.male,timestampdiff(year,pt.brthdate,now()),pt.mrtlst)) as prefix
    ,fname as first_name
    ,lname as last_name
    ,engpname as prefix_eng
    ,engfname as first_name_eng
    ,'' as middle_name_eng
    ,englname as last_name_eng
    ,male as gender
    ,brthdate as birth_date
    ,addrpart as address
    ,moopart AS moo
    ,'' as road
    ,tmbpart as tmb_code
    ,amppart as amp_code
    ,chwpart as chw_code
    ,hometel as mobile_phone
    ,concat(addrpart,getAddress(moopart,tmbpart,amppart,chwpart)) as address_full_thai
    ,'' as address_full_eng
    ,nation as nationality,'' as drug_allergy
    from 
    pt 
    LEFT JOIN ntnlty on pt.ntnlty=ntnlty.ntnlty
    where pt.hn='${hn}'
    `;

    return await dbHIS.raw(sql)
  }

  async hospital(dbHIS: knex) {

    let sql = `
    SELECT 
    hcode as hospital_code,
    hi_hsp_nm as hospital_name,
    'HI for Win Version6.2' as his_identifier
    from setup
    limit 1;
    `;

    return await dbHIS.raw(sql)
  }
  
  async drugAllergy(dbHIS: knex, hn: any) {

    let sql = `
    SELECT  p.hn,
    a.entrydate as report_date
    ,a.namedrug as medication_name
    ,a.detail as symptom
    from 
    pt as p
    inner join 
    allergy as a on p.hn=a.hn
    where p.hn='${hn}'
    `;

    return await dbHIS.raw(sql)
  }

  async immunizationPlan(dbHIS: knex, hn: any) {

    let sql = `
    SELECT
    'C19' as vaccine_code
    ,plan_id as immunization_plan_ref_code
    ,plan_name as treatment_plan_name
    ,h.namehpt as vaccine_name
    ,d.lcno as practitioner_license_number
    ,concat(d.fname,' ',d.lname) aspractitioner_name
    ,d.council as practitioner_role
    FROM
    plan_treat as p
    inner join 
    ovst as o on p.hn=o.hn
    inner join 
    epi as e on o.vn=e.vn  
    inner join 
    hpt as h on e.vac=h.codehpt 
		-- and h.vac in ('CA1','CA2','CN1','CN2','CJ1','CJ2','CG1','CG2','CM1','CM2','CP1','CP2','CS1','CS2','CI1','CI2')
    and h.icd10 = 'U119'
    inner join 
    dct as d on d.cid=p.provider 
    where p.hn='${hn}'
    `;

    return await dbHIS.raw(sql)
  }

  async schedule(dbHIS: knex, vn: any) {

    let sql = `
    select
    a.schedule_id as immunization_plan_schedule_ref_code
    ,concat(a.fudate,'T007:00:00.000') as schedule_date
    ,a.treat_no as treatment_number
	,b.plan_name as schedule_description
	,IF(a.treat_no=1,'Y','N') as complete
	,IF(a.treat_no=1,a.fudate,'') as visit_date
    from schedules AS a 
    INNER JOIN plan_treat AS b ON a.plan_id=b.plan_id
    where 
    b.vn='${vn}'
    `;

    return await dbHIS.raw(sql)
  }

  async visit(dbHIS: knex, vn: any) {

    let sql = `
    SELECT
    concat('{', e.visit_uuid,'}')  as visit_guid
    ,if(length(o.vn)<7,CONCAT(64,o.vn),o.vn) as visit_ref_code
    ,date_format(o.vstdttm,'%Y-%m-%dT%H:%i:%s.000') as visit_datetime
    ,t.stdcode as claim_fund_pcode
    , 1 as visit_observation
    ,1 as visit_immunization
    , 1 as visit_immunization_reaction
    , 1 as appointment
    FROM
    ovst as o
    inner join epi as e on o.vn = e.vn
    inner join pttype as t on o.pttype=t.pttype
    where o.vn='${vn}'
    `;

    return await dbHIS.raw(sql)
  }

  async observation(dbHIS: knex, vn: any) {

    let sql = `
    SELECT 
    if(o.sbp=0,120,o.sbp) as systolic_blood_pressure
    ,if(o.dbp=0,80,o.dbp) as diastolic_blood_pressure
    ,o.bw as body_weight_kg
    ,o.height as body_height_cm
    ,if(o.tt=0,36.5,o.tt) as temperature
    FROM ovst as o
    inner join epi as e on o.vn = e.vn
    inner join pttype as t on o.pttype=t.pttype
    where o.vn='${vn}'
    `;

    return await dbHIS.raw(sql)
  }

  async visitImmunization(dbHIS: knex, vn: any) {

    let sql = `
    SELECT
    if(length(o.vn)<7,CONCAT(64,o.vn),o.vn) as visit_immunization_ref_code
    ,date_format(o.vstdttm,'%Y-%m-%dT%H:%i:%s.000') as immunization_datetime
    ,'C19' as vaccine_code
    ,e.lotno as lot_number
    ,e.ex_date as expiration_date
    ,'' as vaccine_note
    ,h.namehpt as vaccine_ref_name
    ,e.serial_no as serial_no
    ,s.treat_no as vaccine_plan_no
    ,(case when h.vac in ('CA1','CA2','CA3') then 1 
		when h.vac in ('CN1','CN2','CN3') then 2
		when h.vac in ('CJ1','CJ2','CJ3') then 3
		when h.vac in ('CG1','CG2','CG3') then 4
		when h.vac in ('CM1','CM2','CM3') then 5
		when h.vac in ('CP1','CP2','CP3') then 6
		when h.vac in ('CS1','CS2','CS3') then 7
    when h.vac in ('CI1','CI2','CI3') then 8
    end) as vaccine_manufacturer_id
    ,(case when h.vac in ('CA1','CA2','CA3') then 'AstraZeneca' 
		when h.vac in ('CN1','CN2','CN3') then 'Novavax'
		when h.vac in ('CJ1','CJ2','CJ3') then 'Johnson & Johnson' 
		when h.vac in ('CG1','CG2','CG3') then 'Sanofi, GlaxoSmithKline' 
		when h.vac in ('CM1','CM2','CM3') then 'Moderna' 
		when h.vac in ('CP1','CP2','CP3') then 'Pfizer, BioNTech' 
		when h.vac in ('CS1','CS2','CS3') then 'Sinovac Life Sciences' 
    when h.vac in ('CI1','CI2','CI3') then 'Sinopharm' 
    end) as vaccine_manufacturer
    ,p.plan_id as immunization_plan_ref_code
    ,s.schedule_id as immunization_plan_schedule_ref_code
    ,'Inject Muscular' as vaccine_route_name
    FROM
    ovst as o
    inner join 
    epi as e on o.vn = e.vn
    inner join 
    hpt as h on e.vac=h.codehpt 
    -- and h.vac in ('CA1','CA2','CN1','CN2','CJ1','CJ2','CG1','CG2','CM1','CM2','CP1','CP2','CS1','CS2','CI1','CI2')
    and h.icd10 = 'U119'
    inner join
    plan_treat as p on o.vn=p.vn  
    inner join 
    schedules as s on p.plan_id=s.plan_id  
    where o.vn='${vn}'  
		limit 1
    `;

    return await dbHIS.raw(sql)
  }
  async practitioner(dbHIS: knex, vn: any) {

    let sql = `
    SELECT
    d.lcno as license_number
    ,concat(d.fname,' ',d.lname) as name
    ,d.council as role
    FROM epi as e 
    inner join dct as d on (case length(e.dct) when 4 then substr(e.dct,1,2)=d.dct when 5 then e.dct=d.lcno end)
    where e.vn='${vn}'
    `;

    return await dbHIS.raw(sql)
  }

  async visitImmunizationReaction(dbHIS: knex, vn: any) {

    let sql = `
    select 
    v.id as visit_immunization_reaction_ref_code
    ,if(length(e.vn)<7,CONCAT(64,e.vn),e.vn) as visit_immunization_ref_code
    ,date_format(now(),'%Y-%m-%dT%H:%i:%s.000') as report_datetime
    , if(v.vacc_symtp =10, v.pronote,s.vaccine_reaction_symptom_name) as reaction_detail_text
    ,0 as vaccine_reaction_type_id
    ,date_format(now(),'%Y-%m-%d') as reaction_date
    ,v.vacc_stage as vaccine_reaction_stage_id
    ,v.vacc_symtp as vaccine_reaction_symptom_id
    from epi as e 
    inner join vaccine_allergy as v on e.vn=v.vn
    left join l_vaccine_reaction_symptom as s on v.vacc_symtp=s.vaccine_reaction_symptom_id
    where e.vn='${vn}'
    `;

    return await dbHIS.raw(sql)
  }

  // async appointment(dbHIS: knex, vn: any) {

  //   let sql = `
  //   select 
  //   a.id as appointment_ref_code
  //   ,concat(a.fudate,'T007:00:00.000') as appointment_datetime
  //   ,'หมายเหตุ' as appointment_note
  //   ,a.dscrptn as Appointment_cause,
  //   'C19' as provis_aptype_code
  //   from 
  //   oapp as a 
  //   where a.vn = '${vn}'
  //   `;

  //   return await dbHIS.raw(sql)
  // }

  async appointment(dbHIS: knex, vn: any) {

    let sql = `
    SELECT  
    s.schedule_id as appointment_ref_code
    ,concat(s.fudate,'T007:00:00.000') as appointment_datetime
    ,'หมายเหตุ' as appointment_note
    ,'นัดฉีดวัคซีนเข็มที่2' as Appointment_cause,
    'C19' as provis_aptype_code
    FROM plan_treat as p 
    inner join schedules AS s on p.plan_id=s.plan_id  
    where p.vn ='${vn}' and s.treat_no = '2' 
    `;

    return await dbHIS.raw(sql)
  }

  async patient_lab(dbHIS: knex, hn: any) {

    let sql = `
    select 
    if(pt.ntnlty=99, pt.pop_id,pt.cidmophic)  as cid
    ,passport as passport_no
    ,if(length(pt.hn)<7,CONCAT((select setup.hcode from setup),pt.hn),pt.hn) as hn
    , concat('{',pt_guid,'}') as patient_guid
    ,IF(pt.pname!='',pt.pname,getPname(pt.male,timestampdiff(year,pt.brthdate,now()),pt.mrtlst)) as prefix
    ,fname as first_name
    ,lname as last_name
    ,engpname as prefix_eng
    ,engfname as first_name_eng
    ,'' as middle_name_eng
    ,englname as last_name_eng
    ,male as gender
    ,brthdate as birth_date
    ,addrpart as address
    ,moopart AS moo
    ,'' as road
    ,tmbpart as tmb_code
    ,amppart as amp_code
    ,chwpart as chw_code
    ,hometel as mobile_phone
    ,concat(addrpart,getAddress(moopart,tmbpart,amppart,chwpart)) as address_full_thai
    ,'' as address_full_eng
    ,nation as nationality,'' as drug_allergy
    from 
    pt 
    LEFT JOIN ntnlty on pt.ntnlty=ntnlty.ntnlty
    where pt.hn='${hn}'
    `;
    // console.log(sql);

    return await dbHIS.raw(sql)
  }

  async lab(dbHIS: knex, hn: any) {

    let sql = `
    SELECT 
    lb.senddate AS report_datetime
    ,lb.ln AS patient_lab_ref_code
    ,l.labname AS patient_lab_name_ref 
    ,'' AS patient_lab_normal_value_ref
    ,IF(l.tmlt = '',IF(lb.labcode in ('634','934','904','905'),'351123','351122'),l.tmlt) as tmlt_code
    ,r.labresult AS patient_lab_result_text,
    if(substr(approve,1,2) = 'NU',concat(lp.prename,d.fname,' ',d.lname),lb.approve) as authorized_officer_name,
		'' AS lab_atk_fda_reg_no
    FROM lbbk as lb
    INNER JOIN lab as l ON lb.labcode = l.labcode
		INNER JOIN lab_co_mapping co ON l.labcode=co.labcode
    INNER JOIN labresult as r ON  r.ln=lb.ln and r.lab_code_local in ('SAR','RESULT')
    left join dct as d on substr(lb.approve,3,2) = d.dct
    left join l_prename as lp on d.pname=lp.prename_code
    WHERE lb.labcode IN ('634','934','863','887','904','905')  
    AND  lb.hn = '${hn}' 
    GROUP BY lb.ln
    ORDER BY lb.vstdttm DESC;
    `;
    // console.log(sql);

    return await dbHIS.raw(sql)
  }

  async select_hn(dbHIS: knex, cid: any) {
    let sql = `
    select pt.hn from pt where pt.pop_id = ${cid}
    `;
    return await dbHIS.raw(sql)
  }
}

