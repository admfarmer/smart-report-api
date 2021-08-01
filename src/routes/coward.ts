/// <reference path="../../typings.d.ts" />

import * as knex from 'knex';
import * as fastify from 'fastify';
import * as HttpStatus from 'http-status-codes';

import { ViewsAdmitModel } from '../models/hi-coward'
import { AdmissionModels } from '../models/web-coward'

var cron = require('node-cron');

const viewsAdmitModel = new ViewsAdmitModel();
const admissionModels = new AdmissionModels();
const router = (fastify, { }, next) => {
    var dbHIS: knex = fastify.dbHIS;
    var dbCO: knex = fastify.dbCO;

  fastify.get('/', async (req: fastify.Request, reply: fastify.Reply) => {
    reply.code(200).send({ message: 'Welcome to SMART HIS API SMART REPORT HIS!', version: '1.0 build 20190820-1' })
  });

  fastify.get('/info', async (req: fastify.Request, reply: fastify.Reply) => {
    let dbco_type = process.env.DBCO_TYPE || '0';
    let an:any;
    let rs_an:any;

    if(dbco_type == '1'){
      rs_an = await admissionModels.viewAdmissionAN(dbCO);
      // console.log(rs_an[0]);
      an = rs_an[0][0];
      console.log('an :',an.an);
    
        const rs: any = await viewsAdmitModel.viewCoWard(dbHIS,an.an);
        let info = rs[0];
        let _info = [];
        let rs_info: any;
        let _rs_info = [];
    
        if(info){
          info.forEach(async (v: any) => {
              console.log(v);
            try {
                    rs_info = await admissionModels.insert(dbCO,v);
                } catch (error) {
                fastify.log.error(error);
                // reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
                }
              console.log(rs_info);
              _rs_info.push(rs_info[0])
              _info.push(v);
    
          })
          reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, info: _info,rs_info: rs_info });
    
        }
    }else{
        console.log('running Not');
        
    }

  });

  cron.schedule('*/1 * * * *', async function (req: fastify.Request, reply: fastify.Reply) {
    console.log('running a task every minute');
    let dbco_type = process.env.DBCO_TYPE || '0';
    let dbco_type_ci = process.env.DBCO_TYPE_CI || '0';
    let an:any;
    let rs_an:any;
    let hn:any;
    let rs_hn:any;

    if(dbco_type == '1'){
      console.log('running dbco_type');

        rs_an = await admissionModels.viewAdmissionAN(dbCO);
        an = rs_an[0][0];
        const rs: any = await viewsAdmitModel.viewCoWard(dbHIS,an.an);
        let info = rs[0];
        let _info = [];
        let rs_info: any;
        let _rs_info = [];
    
        if(info){
          info.forEach(async (v: any) => {
              console.log(v);
            try {
              rs_info = await admissionModels.insertAdmission(dbCO,v);
              // rs_info = await admissionModels.insert(dbCO,v);
            } catch (error) {
                fastify.log.error(error);
                // reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
                }
              // console.log(rs_info);
              // _rs_info.push(rs_info[0])
              // _info.push(v);
          })
          // reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, info: _info,rs_info: rs_info });
        }else{
          console.log('running Not info');
        }
    }else{
      console.log('running Not dbco_type');
    }

    if(dbco_type_ci == '1'){
      console.log('running dbco_type_ci');
      rs_hn = await admissionModels.viewAdmissionHn(dbCO);
      hn = rs_hn[0][0].hn;
      let _an_:number = rs_hn[0][0].an;
      const rs_vn: any = await viewsAdmitModel.viewCoWardVn(dbHIS,hn);
      console.log(_an_);
      let _vn = rs_vn[0][0];
      // console.log(_vn);
      let _vn_ = _vn.vn
      // console.log(_vn_);
      if(rs_vn[0]){
        const rs: any = await viewsAdmitModel.viewCoWardOpd(dbHIS,_vn_);
        let info = rs[0];
        let _info = [];
        let rs_info: any;
        let _rs_info = [];
        // console.log(info);
    
        if(info){
          info.forEach(async (v: any) => {
            let _an = +_an_++
              console.log(v);
              let data = {
                an:_an,
                pname:v.pname,
                fname:v.fname,
                lname:v.lname,
                gender:v.gender,
                dob:v.dob,
                cid:v.cid,
                address:v.address,
                contact_number:v.contact_number,
                contact_name:v.contact_name,
                phistory:v.phistory,
                med_reconcile:v.med_reconcile,
                cc:v.cc,
                covid_register:v.covid_register,
                allergy:v.allergy,
                hn:v.hn,
                age:v.age,
                is_admit:v.is_admit,
                bed:v.bed,
                ward_id:v.ward_id
              }

              let i = {
                an:_an,
                cxr_date:v.vstdttm
              }

            try {
              
              let rs_ = await admissionModels.viewAdmission_is_admit(dbCO,v.hn);
              
              if(!rs_[0][0]){
                rs_info = await admissionModels.insertAdmission(dbCO,data);
                let rs_xray = await admissionModels.insertXrayOpd(dbCO,i);
              }
              // rs_info = await admissionModels.insert(dbCO,v);
            } catch (error) {
                fastify.log.error(error);
                // reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
                }
              // console.log(rs_info);
              // _rs_info.push(rs_info[0])
              // _info.push(v);
    
          })
          // reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, info: _info,rs_info: rs_info });
        }
      }else{
        console.log('running Not rs_vn');
      }
    }else{
      console.log('running Not dbco_type_ci');
    }
  })

  next();

}

module.exports = router;