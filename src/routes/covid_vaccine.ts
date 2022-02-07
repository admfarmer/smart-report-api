/// <reference path="../../typings.d.ts" />

import * as knex from 'knex';
import * as fastify from 'fastify';
import * as HttpStatus from 'http-status-codes';
import * as moment from 'moment-timezone';

import { CovidVaccineModel } from '../models/covid_vaccine'
import { GetTokenModel } from '../models/get_token'

const covidVaccineModel = new CovidVaccineModel();
const getTokenModel = new GetTokenModel();

const router = (fastify, { }, next) => {
  var db: knex = fastify.dbHIS;

  fastify.post('/', async (req: fastify.Request, reply: fastify.Reply) => {
    reply.code(200).send({ message: 'Welcome to SMART HIS API SMART REPORT HIS!', version: '1.0 build 20190820-1' })
  });

  fastify.get('/getToken', async (req: fastify.Request, reply: fastify.Reply) => {
    const user = req.query.user
    const password_hash = req.query.password_hash
    const hospital_code = req.query.hospital_code
try {
    const rs: any = await getTokenModel.select(user,password_hash,hospital_code);
    reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, info: rs });
  } catch (error) {
    fastify.log.error(error);
    reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
  }

});

  fastify.get('/info', async (req: fastify.Request, reply: fastify.Reply) => {
      console.log('viewVisit19');
      
      const hn = req.query.hn
      const vn = req.query.vn

      let objVaccine:any = {};
      let visit:any={};
      let schedule:any={};


      let hospital:any = {};
      let patient:any = {};
      let lab:any = [];
      let immunization_plan:any = [];
      let visit_observation:any = {};
      


    try {
      const rs_hospital: any = await covidVaccineModel.hospital(db);
      if(rs_hospital){
        objVaccine.hospital = rs_hospital[0][0];

      }else{
        objVaccine.hospital = {};
      }
      const rs_patient: any = await covidVaccineModel.patient(db,hn);
      if(rs_patient){
            objVaccine.patient = rs_patient[0][0];
        }else{
            objVaccine.patient = {};
        }

        const rs_lab: any = await covidVaccineModel.lab(db,hn);
        if(rs_lab[0][0]){
            objVaccine.lab = rs_lab[0][0];
        }else{
            objVaccine.lab = {
                "report_datetime" : "", // วันที่-เวลา รายงาน
                "patient_lab_ref_code" :  "", // รหัสอ้างอิงฝั่ง HIS
                "patient_lab_name_ref" : "", // ชื่อรายการ Lab ฝั่ง HIS
                "patient_lab_normal_value_ref" :  "", //ค่าปกติของผล Lab
                "tmlt_code" :  "", // รหัส TMLT
                "patient_lab_result_text" :  "", // ผลของการตรวจครั้งนี้ (ต้องมีส่วนของข้อความเป็น Positive หรือ Negative)
                "authorized_officer_name" : "",
                "lab_atk_fda_reg_no" :  ""    
            };
        }
  
        const rs_immunization_plan: any = await covidVaccineModel.immunizationPlan(db,hn);
        if(rs_immunization_plan){
            objVaccine.immunization_plan = rs_immunization_plan[0][0];
        }else{
            objVaccine.immunization_plan = {};
        }

        const rs_schedule: any = await covidVaccineModel.schedule(db,vn);
        if(rs_schedule){
            objVaccine.schedule= rs_schedule[0];
        }else{
            objVaccine.schedule=[];
        }


        const rs_visit_observation: any = await covidVaccineModel.observation(db,vn);
        if(rs_visit_observation){
            objVaccine.visit_observation = rs_visit_observation[0][0];
        }else{
            objVaccine.visit_observation = {};
        }

        const rs_visit_immunization: any = await covidVaccineModel.visitImmunization(db,vn);
        if(rs_visit_immunization){
            objVaccine.visit_immunization = rs_visit_immunization[0][0];
        }else{
            objVaccine.visit_immunization = {};
        }

        const rs_visit_immunization_reaction: any = await covidVaccineModel.visitImmunizationReaction(db,vn);
        if(rs_visit_immunization_reaction){
            objVaccine.visit_immunization_reaction = rs_visit_immunization_reaction[0][0];
        }else{
            objVaccine.visit_immunization_reaction = {};
        }

        const rs_appointment: any = await covidVaccineModel.appointment(db,vn);        
        if(rs_appointment){
            objVaccine.appointment = rs_appointment[0][0];
        }else{
            objVaccine.appointment = {};
        }

        const rs_practitioner: any = await covidVaccineModel.practitioner(db,vn);
        if(rs_practitioner){
            objVaccine.practitioner = rs_practitioner[0][0];
        }else{
            objVaccine.practitioner = {};
        }

        const rs_visit: any = await covidVaccineModel.visit(db,vn);
        if(rs_visit){
            objVaccine.visit = rs_visit[0][0];
        }else{
            objVaccine.visit = {};
        }

        let immunization_reaction:any;
        if(rs_visit_immunization_reaction[0][0]){
            immunization_reaction=[{
                "visit_immunization_reaction_ref_code":objVaccine.visit_immunization_reaction.visit_immunization_reaction_ref_code|| "" ,
                "visit_immunization_ref_code":objVaccine.visit_immunization_reaction.visit_immunization_ref_code|| "" ,
                "report_datetime":objVaccine.visit_immunization_reaction.report_datetime|| "" ,
                "reaction_detail_text":objVaccine.visit_immunization_reaction.reaction_detail_text|| "" ,
                "vaccine_reaction_type_id":objVaccine.visit_immunization_reaction.vaccine_reaction_type_id|| "" ,
                "reaction_date":moment(objVaccine.visit_immunization_reaction.reaction_date).tz('Asia/Bangkok').format('YYYY-MM-DD')|| "" ,
                "vaccine_reaction_stage_id":objVaccine.visit_immunization_reaction.vaccine_reaction_stage_id|| "" ,
                "vaccine_reaction_symptom_id":objVaccine.visit_immunization_reaction.vaccine_reaction_symptom_id|| "" 
             }]
        }else{
            immunization_reaction=[]
        }

        let appointment:any;
        if(rs_appointment[0][0]){
            appointment=[
                {
                   "appointment_ref_code":objVaccine.appointment.appointment_ref_code|| "",
                   "appointment_datetime":objVaccine.appointment.appointment_datetime|| "",
                   "appointment_note":objVaccine.appointment.appointment_note|| "",
                   "appointment_cause":objVaccine.appointment.appointment_cause|| "",
                   "provis_aptype_code":objVaccine.appointment.provis_aptype_code|| "",
                   "practitioner":objVaccine.practitioner || {},
                }
             ]
        }else{
            appointment=[]
        }

        let info = {
            "hospital":{
                "hospital_code":objVaccine.hospital.hospital_code,
                "hospital_name":objVaccine.hospital.hospital_name,
                "his_identifier" : objVaccine.hospital.his_identifier
             },
            "patient":{
                "CID":objVaccine.patient.cid|| "",
                "hn":objVaccine.patient.hn|| "",
                "patient_guid":objVaccine.patient.patient_guid|| "",
                "prefix":objVaccine.patient.prefix|| "",
                "first_name":objVaccine.patient.first_name|| "",
                "last_name":objVaccine.patient.last_name|| "",
                "prefix_eng":objVaccine.patient.prefix_eng|| "",
                "first_name_eng":objVaccine.patient.first_name_eng|| "",
                "last_name_eng":objVaccine.patient.last_name_eng|| "",
                "gender":objVaccine.patient.gender|| "",
                "birth_date":moment(objVaccine.patient.birth_date).tz('Asia/Bangkok').format('YYYY-MM-DD')|| "",
                "marital_status_id":objVaccine.patient.marital_status_id|| "",
                "address":objVaccine.patient.address|| "",
                "moo":objVaccine.patient.moo|| "",
                "road":objVaccine.patient.road|| "",
                "chw_code":objVaccine.patient.chw_code|| "",
                "amp_code":objVaccine.patient.amp_code|| "",
                "tmb_code":objVaccine.patient.tmb_code|| "",
                "installed_line_connect":objVaccine.patient.installed_line_connect|| "",
                "home_phone":objVaccine.patient.home_phone|| "",
                "mobile_phone":objVaccine.patient.mobile_phone|| "",
                "ncd":[
                
                ]
            },
            "lab":objVaccine.lab,
            "immunization_plan":[
                {
                   "vaccine_code":objVaccine.immunization_plan.vaccine_code || "",
                   "immunization_plan_ref_code":objVaccine.immunization_plan.immunization_plan_ref_code|| "",
                   "treatment_plan_name":objVaccine.immunization_plan.treatment_plan_name,
                   "practitioner_license_number":objVaccine.immunization_plan.practitioner_license_number|| "",
                   "practitioner_name":objVaccine.immunization_plan.practitioner_name|| "",
                   "practitioner_role":objVaccine.immunization_plan.practitioner_role|| "",
                   "vaccine_ref_name":objVaccine.immunization_plan.vaccine_ref_name|| "",
                   "schedule":objVaccine.schedule || []
                }
            ],
            "visit":{
                "visit_guid":objVaccine.visit.visit_guid|| "",
                "visit_ref_code":objVaccine.visit.visit_ref_code|| "",
                "visit_datetime":moment(objVaccine.visit.visit_datetime).tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss')|| "",
                "claim_fund_pcode":objVaccine.visit.claim_fund_pcode|| "",
                "visit_observation":objVaccine.visit_observation|| "",
                "visit_immunization":[
                   {
                      "visit_immunization_ref_code":objVaccine.visit_immunization.visit_immunization_ref_code|| "",
                      "immunization_datetime":moment(objVaccine.visit_immunization.immunization_datetime).tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss')|| "",
                      "vaccine_code":objVaccine.visit_immunization.vaccine_code|| "",
                      "lot_number":objVaccine.visit_immunization.lot_number|| "",
                      "expiration_date":moment(objVaccine.visit_immunization.expiration_date).tz('Asia/Bangkok').format('YYYY-MM-DD')|| "",
                      "vaccine_note":objVaccine.visit_immunization.vaccine_note|| "",
                      "vaccine_ref_name":objVaccine.visit_immunization.vaccine_ref_name|| "",
                      "serial_no":objVaccine.visit_immunization.serial_no|| "",
                      "vaccine_manufacturer" : objVaccine.visit_immunization.vaccine_manufacturer|| "" ,
                      "vaccine_plan_no":objVaccine.visit_immunization.vaccine_plan_no|| "" ,
                      "vaccine_route_name":objVaccine.visit_immunization.vaccine_route_name|| "" ,
                      "practitioner":objVaccine.practitioner || {},
                      "immunization_plan_ref_code":objVaccine.visit_immunization.immunization_plan_ref_code|| "" ,
                      "immunization_plan_schedule_ref_code":objVaccine.visit_immunization.immunization_plan_schedule_ref_code|| "" 
                   }
                ],
                "visit_immunization_reaction":immunization_reaction,
                "appointment":appointment
             }
        }

        const _token: any = await getTokenModel.select_setup(db);
        const hcode: any = await getTokenModel.select_hcode(db);
        let token : any;
        let info_visit : any;

        // console.log(_token[0][0]);
        // console.log(hcode.hcode);
        
        if(_token){
            let user = _token[0][0].value1;
            let password_hash = _token[0][0].values4;
            let hospital_code = hcode[0][0].hcode;
            token = await getTokenModel.select(user,password_hash,hospital_code);
            // console.log(token);
          
            info_visit = await getTokenModel.insert_covid(token,info);

        }else{
            objVaccine.visit = {};
        }

      reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, info:info,info_visit:info_visit});
    } catch (error) {
      fastify.log.error(error);
      reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }

  });

  fastify.post('/moph-ic', async (req: fastify.Request, reply: fastify.Reply) => {
    console.log('viewVisit19-moph-ic');
    
    const hn = req.body.hn
    const vn = req.body.vn
    const token = req.body.token

    let objVaccine:any = {};
    let visit:any={};
    let schedule:any={};


    let hospital:any = {};
    let patient:any = {};
    let lab:any = [];
    let immunization_plan:any = [];
    let visit_observation:any = {};
    


  try {
    const rs_hospital: any = await covidVaccineModel.hospital(db);
    if(rs_hospital){
      objVaccine.hospital = rs_hospital[0][0];

    }else{
      objVaccine.hospital = {};
    }
    const rs_patient: any = await covidVaccineModel.patient(db,hn);
    if(rs_patient){
          objVaccine.patient = rs_patient[0][0];
      }else{
          objVaccine.patient = {};
      }

      const rs_lab: any = await covidVaccineModel.lab(db,hn);
      if(rs_lab[0][0]){
          objVaccine.lab = rs_lab[0];
      }else{
          objVaccine.lab = {
            "report_datetime" : "", // วันที่-เวลา รายงาน
            "patient_lab_ref_code" :  "", // รหัสอ้างอิงฝั่ง HIS
            "patient_lab_name_ref" : "", // ชื่อรายการ Lab ฝั่ง HIS
            "patient_lab_normal_value_ref" :  "", //ค่าปกติของผล Lab
            "tmlt_code" :  "", // รหัส TMLT
            "patient_lab_result_text" :  "", // ผลของการตรวจครั้งนี้ (ต้องมีส่วนของข้อความเป็น Positive หรือ Negative)
            "authorized_officer_name" : "",
            "lab_atk_fda_reg_no" :  ""
          };
      }

      const rs_immunization_plan: any = await covidVaccineModel.immunizationPlan(db,hn);
      if(rs_immunization_plan){
          objVaccine.immunization_plan = rs_immunization_plan[0][0];
      }else{
          objVaccine.immunization_plan = {};
      }

      const rs_schedule: any = await covidVaccineModel.schedule(db,vn);
      if(rs_schedule){
          objVaccine.schedule= rs_schedule[0];
      }else{
          objVaccine.schedule=[];
      }

      const rs_visit_observation: any = await covidVaccineModel.observation(db,vn);
      if(rs_visit_observation){
          objVaccine.visit_observation = rs_visit_observation[0][0];
      }else{
          objVaccine.visit_observation = {};
      }

      const rs_visit_immunization: any = await covidVaccineModel.visitImmunization(db,vn);
      if(rs_visit_immunization){
          objVaccine.visit_immunization = rs_visit_immunization[0][0];
      }else{
          objVaccine.visit_immunization = {};
      }

      const rs_visit_immunization_reaction: any = await covidVaccineModel.visitImmunizationReaction(db,vn);
      if(rs_visit_immunization_reaction){
          objVaccine.visit_immunization_reaction = rs_visit_immunization_reaction[0][0];
      }else{
          objVaccine.visit_immunization_reaction = {};
      }

      const rs_appointment: any = await covidVaccineModel.appointment(db,vn);        
      if(rs_appointment){
          objVaccine.appointment = rs_appointment[0][0];
      }else{
          objVaccine.appointment = {};
      }

      const rs_practitioner: any = await covidVaccineModel.practitioner(db,vn);
      if(rs_practitioner){
          objVaccine.practitioner = rs_practitioner[0][0];
      }else{
          objVaccine.practitioner = {};
      }

      const rs_visit: any = await covidVaccineModel.visit(db,vn);
      if(rs_visit){
          objVaccine.visit = rs_visit[0][0];
      }else{
          objVaccine.visit = {};
      }

      let immunization_reaction:any;
      if(rs_visit_immunization_reaction[0][0]){
          immunization_reaction=[{
              "visit_immunization_reaction_ref_code":objVaccine.visit_immunization_reaction.visit_immunization_reaction_ref_code|| "" ,
              "visit_immunization_ref_code":objVaccine.visit_immunization_reaction.visit_immunization_ref_code|| "" ,
              "report_datetime":objVaccine.visit_immunization_reaction.report_datetime|| "" ,
              "reaction_detail_text":objVaccine.visit_immunization_reaction.reaction_detail_text|| "" ,
              "vaccine_reaction_type_id":objVaccine.visit_immunization_reaction.vaccine_reaction_type_id|| "" ,
              "reaction_date":moment(objVaccine.visit_immunization_reaction.reaction_date).tz('Asia/Bangkok').format('YYYY-MM-DD')|| "" ,
              "vaccine_reaction_stage_id":objVaccine.visit_immunization_reaction.vaccine_reaction_stage_id|| "" ,
              "vaccine_reaction_symptom_id":objVaccine.visit_immunization_reaction.vaccine_reaction_symptom_id|| "" 
           }]
      }else{
          immunization_reaction=[]
      }

      let appointment:any;
      if(rs_appointment[0][0]){
          appointment=[
              {
                 "appointment_ref_code":objVaccine.appointment.appointment_ref_code|| "",
                 "appointment_datetime":objVaccine.appointment.appointment_datetime|| "",
                 "appointment_note":objVaccine.appointment.appointment_note|| "",
                 "appointment_cause":objVaccine.appointment.appointment_cause|| "",
                 "provis_aptype_code":objVaccine.appointment.provis_aptype_code|| "",
                 "practitioner":objVaccine.practitioner || {},
              }
           ]
      }else{
          appointment=[]
      }

      let info = {
          "hospital":{
              "hospital_code":objVaccine.hospital.hospital_code,
              "hospital_name":objVaccine.hospital.hospital_name,
              "his_identifier" : objVaccine.hospital.his_identifier
           },
          "patient":{
            "CID":objVaccine.patient.cid|| "",
            "hn":objVaccine.patient.hn|| "",
            "patient_guid":objVaccine.patient.patient_guid|| "",
            "prefix":objVaccine.patient.prefix|| "",
            "first_name":objVaccine.patient.first_name|| "",
            "last_name":objVaccine.patient.last_name|| "",
            "prefix_eng":objVaccine.patient.prefix_eng|| "",
            "first_name_eng":objVaccine.patient.first_name_eng|| "",
            "last_name_eng":objVaccine.patient.last_name_eng|| "",
            "gender":objVaccine.patient.gender|| "",
            "birth_date":moment(objVaccine.patient.birth_date).tz('Asia/Bangkok').format('YYYY-MM-DD')|| "",
            "marital_status_id":objVaccine.patient.marital_status_id|| "",
            "address":objVaccine.patient.address|| "",
            "moo":objVaccine.patient.moo|| "",
            "road":objVaccine.patient.road|| "",
            "chw_code":objVaccine.patient.chw_code|| "",
            "amp_code":objVaccine.patient.amp_code|| "",
            "tmb_code":objVaccine.patient.tmb_code|| "",
            "installed_line_connect":objVaccine.patient.installed_line_connect|| "",
            "home_phone":objVaccine.patient.home_phone|| "",
            "mobile_phone":objVaccine.patient.mobile_phone|| "",
            "ncd":[
            
            ]
      },
          "lab":objVaccine.lab,
          "immunization_plan":[
              {
                 "vaccine_code":objVaccine.immunization_plan.vaccine_code || "",
                 "immunization_plan_ref_code":objVaccine.immunization_plan.immunization_plan_ref_code|| "",
                 "treatment_plan_name":objVaccine.immunization_plan.treatment_plan_name,
                 "practitioner_license_number":objVaccine.immunization_plan.practitioner_license_number|| "",
                 "practitioner_name":objVaccine.immunization_plan.practitioner_name|| "",
                 "practitioner_role":objVaccine.immunization_plan.practitioner_role|| "",
                 "vaccine_ref_name":objVaccine.immunization_plan.vaccine_ref_name|| "",
                 "schedule":objVaccine.schedule || []
              }
          ],
          "visit":{
              "visit_guid":objVaccine.visit.visit_guid|| "",
              "visit_ref_code":objVaccine.visit.visit_ref_code|| "",
              "visit_datetime":moment(objVaccine.visit.visit_datetime).tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss')|| "",
              "claim_fund_pcode":objVaccine.visit.claim_fund_pcode|| "",
              "visit_observation":objVaccine.visit_observation|| "",
              "visit_immunization":[
                 {
                    "visit_immunization_ref_code":objVaccine.visit_immunization.visit_immunization_ref_code|| "",
                    "immunization_datetime":moment(objVaccine.visit_immunization.immunization_datetime).tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss')|| "",
                    "vaccine_code":objVaccine.visit_immunization.vaccine_code|| "",
                    "lot_number":objVaccine.visit_immunization.lot_number|| "",
                    "expiration_date":moment(objVaccine.visit_immunization.expiration_date).tz('Asia/Bangkok').format('YYYY-MM-DD')|| "",
                    "vaccine_note":objVaccine.visit_immunization.vaccine_note|| "",
                    "vaccine_ref_name":objVaccine.visit_immunization.vaccine_ref_name|| "",
                    "serial_no":objVaccine.visit_immunization.serial_no|| "",
                    "vaccine_manufacturer" : objVaccine.visit_immunization.vaccine_manufacturer|| "" ,
                    "vaccine_plan_no":objVaccine.visit_immunization.vaccine_plan_no|| "" ,
                    "vaccine_route_name":objVaccine.visit_immunization.vaccine_route_name|| "" ,
                    "practitioner":objVaccine.practitioner || {},
                    "immunization_plan_ref_code":objVaccine.visit_immunization.immunization_plan_ref_code|| "" ,
                    "immunization_plan_schedule_ref_code":objVaccine.visit_immunization.immunization_plan_schedule_ref_code|| "" 
                 }
              ],
              "visit_immunization_reaction":immunization_reaction,
              "appointment":appointment
           }
      }

    //   const _token: any = await getTokenModel.select_setup(db);
      const hcode: any = await getTokenModel.select_hcode(db);
    //   let token : any;
      let info_visit : any;
      
      if(token){
        info_visit = await getTokenModel.insert_covid(token,info);
      }else{
        info_visit = {};
      }

    reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, info:info,info_visit:info_visit});
  } catch (error) {
    fastify.log.error(error);
    reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
  }

});



fastify.post('/moph-ic-lab', async (req: fastify.Request, reply: fastify.Reply) => {
    console.log('viewVisit19-moph-ic-lab');
    
    const hn = req.body.hn
    const vn = req.body.vn
    const token = req.body.token

    let objVaccine:any = {};
    let visit:any={};
    let schedule:any={};


    let hospital:any = {};
    let patient:any = {};
    let lab:any = [];
    let immunization_plan:any = [];
    let visit_observation:any = {};

  try {
    const rs_hospital: any = await covidVaccineModel.hospital(db);
    if(rs_hospital){
      objVaccine.hospital = rs_hospital[0][0];

    }else{
      objVaccine.hospital = {};
    }
    const rs_patient: any = await covidVaccineModel.patient_lab(db,hn);
    if(rs_patient){
          objVaccine.patient = rs_patient[0][0];
      }else{
          objVaccine.patient = {};
      }

      const rs_lab: any = await covidVaccineModel.lab(db,hn);
      if(rs_lab[0][0]){
          objVaccine.lab = rs_lab[0];
      }else{
          objVaccine.lab = {
            "report_datetime" : "", // วันที่-เวลา รายงาน
            "patient_lab_ref_code" :  "", // รหัสอ้างอิงฝั่ง HIS
            "patient_lab_name_ref" : "", // ชื่อรายการ Lab ฝั่ง HIS
            "patient_lab_normal_value_ref" :  "", //ค่าปกติของผล Lab
            "tmlt_code" :  "", // รหัส TMLT
            "patient_lab_result_text" :  "", // ผลของการตรวจครั้งนี้ (ต้องมีส่วนของข้อความเป็น Positive หรือ Negative)
            "authorized_officer_name" : "",
            "lab_atk_fda_reg_no" :  ""

          };
      }

    //   console.log(rs_lab);
      
      let info = {
          "hospital":{
              "hospital_code":objVaccine.hospital.hospital_code,
              "hospital_name":objVaccine.hospital.hospital_name,
              "his_identifier" : objVaccine.hospital.his_identifier
           },
          "patient":{
            "CID":objVaccine.patient.cid|| "",
            "hn":objVaccine.patient.hn|| "",
            "patient_guid":objVaccine.patient.patient_guid|| "",
            "prefix":objVaccine.patient.prefix|| "",
            "first_name":objVaccine.patient.first_name|| "",
            "last_name":objVaccine.patient.last_name|| "",
            "prefix_eng":objVaccine.patient.prefix_eng|| "",
            "first_name_eng":objVaccine.patient.first_name_eng|| "",
            "last_name_eng":objVaccine.patient.last_name_eng|| "",
            "gender":objVaccine.patient.gender|| "",
            "birth_date":moment(objVaccine.patient.birth_date).tz('Asia/Bangkok').format('YYYY-MM-DD')|| "",
            "marital_status_id":objVaccine.patient.marital_status_id|| "",
            "address":objVaccine.patient.address|| "",
            "moo":objVaccine.patient.moo|| "",
            "road":objVaccine.patient.road|| "",
            "chw_code":objVaccine.patient.chw_code|| "",
            "amp_code":objVaccine.patient.amp_code|| "",
            "tmb_code":objVaccine.patient.tmb_code|| "",
            "installed_line_connect":objVaccine.patient.installed_line_connect|| "",
            "home_phone":objVaccine.patient.home_phone|| "",
            "mobile_phone":objVaccine.patient.mobile_phone|| "",
            "ncd":[
            
            ]
      },
          "lab":objVaccine.lab,
        //   [
        //       {
        //     "report_datetime" : objVaccine.lab.report_datetime|| "", // วันที่-เวลา รายงาน
        //     "patient_lab_ref_code" : objVaccine.lab.patient_lab_ref_code|| "", // รหัสอ้างอิงฝั่ง HIS
        //     "patient_lab_name_ref" : objVaccine.lab.patient_lab_name_ref|| "", // ชื่อรายการ Lab ฝั่ง HIS
        //     "patient_lab_normal_value_ref" : objVaccine.lab.patient_lab_normal_value_ref|| "", //ค่าปกติของผล Lab
        //     "tmlt_code" : objVaccine.lab.tmlt_code|| "", // รหัส TMLT
        //     "patient_lab_result_text" : objVaccine.lab.patient_lab_result_text|| "", // ผลของการตรวจครั้งนี้ (ต้องมีส่วนของข้อความเป็น Positive หรือ Negative)
        //     "authorized_officer_name" : objVaccine.lab.authorized_officer_name|| "",
        //     "lab_atk_fda_reg_no" : objVaccine.lab.lab_atk_fda_reg_no|| ""
        //   }
        // ],
    
      }

    //   const _token: any = await getTokenModel.select_setup(db);
      const hcode: any = await getTokenModel.select_hcode(db);
    //   let token : any;
      let info_visit : any;
      
      if(token){
        info_visit = await getTokenModel.insert_lab(token,info);
      }else{
        info_visit = {};
      }

    reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, info:info,info_visit:info_visit});
  } catch (error) {
    fastify.log.error(error);
    reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
  }

});


fastify.get('/mophic-lab/:cid', async (req: fastify.Request, reply: fastify.Reply) => {
  console.log('viewVisit19-moph-ic-lab');
  
  const cid = req.params.cid
  // const vn = req.body.vn
  // const token = req.body.token

  let objVaccine:any = {};
  let visit:any={};
  let schedule:any={};


  let hospital:any = {};
  let patient:any = {};
  let lab:any = [];
  let immunization_plan:any = [];
  let visit_observation:any = {};

try {
  
  const token_: any = await getTokenModel.select_Token(db);
  // console.log(token_[0][0].values5);
  const token: any = token_[0][0].values5;
  const rs_hospital: any = await covidVaccineModel.hospital(db);
  const rs_hn: any = await covidVaccineModel.select_hn(db,cid);
  const hn: any = rs_hn[0][0].hn;

  if(rs_hospital){
    objVaccine.hospital = rs_hospital[0][0];

  }else{
    objVaccine.hospital = {};
  }
  const rs_patient: any = await covidVaccineModel.patient_lab(db,hn);
  if(rs_patient){
        objVaccine.patient = rs_patient[0][0];
    }else{
        objVaccine.patient = {};
    }

    const rs_lab: any = await covidVaccineModel.lab(db,hn);
    if(rs_lab[0][0]){
      // objVaccine.lab = rs_lab[0];
      objVaccine.lab = {
        "report_datetime" : moment(rs_lab[0].report_datetime).tz('Asia/Bangkok').format('YYYY-MM-DD'),
        "patient_lab_ref_code" :  rs_lab[0].patient_lab_ref_code,
        "patient_lab_name_ref" : rs_lab[0].patient_lab_name_ref,
        "patient_lab_normal_value_ref" :  rs_lab[0].patient_lab_normal_value_ref,
        "tmlt_code" :  rs_lab[0].tmlt_code,
        "patient_lab_result_text" :  rs_lab[0].patient_lab_result_text,
        "authorized_officer_name" : rs_lab[0].authorized_officer_name,
        "lab_atk_fda_reg_no" :  rs_lab[0].lab_atk_fda_reg_no
      }
    }else{
        objVaccine.lab = {
          "report_datetime" : "", // วันที่-เวลา รายงาน
          "patient_lab_ref_code" :  "", // รหัสอ้างอิงฝั่ง HIS
          "patient_lab_name_ref" : "", // ชื่อรายการ Lab ฝั่ง HIS
          "patient_lab_normal_value_ref" :  "", //ค่าปกติของผล Lab
          "tmlt_code" :  "", // รหัส TMLT
          "patient_lab_result_text" :  "", // ผลของการตรวจครั้งนี้ (ต้องมีส่วนของข้อความเป็น Positive หรือ Negative)
          "authorized_officer_name" : "",
          "lab_atk_fda_reg_no" :  ""
        };
    }

    let info = {
        "hospital":{
            "hospital_code":objVaccine.hospital.hospital_code,
            "hospital_name":objVaccine.hospital.hospital_name,
            "his_identifier" : objVaccine.hospital.his_identifier
         },
        "patient":{
          "CID":objVaccine.patient.cid|| "",
          "hn":objVaccine.patient.hn|| "",
          "patient_guid":objVaccine.patient.patient_guid|| "",
          "prefix":objVaccine.patient.prefix|| "",
          "first_name":objVaccine.patient.first_name|| "",
          "last_name":objVaccine.patient.last_name|| "",
          "prefix_eng":objVaccine.patient.prefix_eng|| "",
          "first_name_eng":objVaccine.patient.first_name_eng|| "",
          "last_name_eng":objVaccine.patient.last_name_eng|| "",
          "gender":objVaccine.patient.gender|| "",
          "birth_date":moment(objVaccine.patient.birth_date).tz('Asia/Bangkok').format('YYYY-MM-DD')|| "",
          "marital_status_id":objVaccine.patient.marital_status_id|| "",
          "address":objVaccine.patient.address|| "",
          "moo":objVaccine.patient.moo|| "",
          "road":objVaccine.patient.road|| "",
          "chw_code":objVaccine.patient.chw_code|| "",
          "amp_code":objVaccine.patient.amp_code|| "",
          "tmb_code":objVaccine.patient.tmb_code|| "",
          "installed_line_connect":objVaccine.patient.installed_line_connect|| "",
          "home_phone":objVaccine.patient.home_phone|| "",
          "mobile_phone":objVaccine.patient.mobile_phone|| "",
          "ncd":[
          
          ]
    },
        "lab":objVaccine.lab,
  
    }

  //   const _token: any = await getTokenModel.select_setup(db);
    const hcode: any = await getTokenModel.select_hcode(db);
  //   let token : any;
    let info_visit : any;
    
    if(token){
      info_visit = await getTokenModel.insert_lab(token,info);
    }else{
      info_visit = {};
    }

  reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, info:info,info_visit:info_visit});
} catch (error) {
  fastify.log.error(error);
  reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
}

});
  next();

}

module.exports = router;