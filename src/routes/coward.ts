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
    // try {
      const rs: any = await viewsAdmitModel.viewCoWard(dbHIS);
      let info = rs[0];
      let _info = [];
      let rs_info: any;
      let _rs_info = [];
      if(info){
        info.forEach(async (v: any) => {
            console.log(v);
            rs_info = await admissionModels.insert(dbCO,v);
            console.log(rs_info);
            _rs_info.push(rs_info[0])
            _info.push(v);
        })
        if(_rs_info[0]){
            reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, info: _info,rs_info: rs_info });
        }else{
            reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })           
        }
      }

    // } catch (error) {
    //   fastify.log.error(error);
    //   reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    // }

  });

  cron.schedule('*/15 * * * *', async function () {
    console.log('running a task every minute');
    const rs: any = await viewsAdmitModel.viewCoWard(dbHIS);
    let info = rs[0];
    let _info = [];
    let rs_info: any;
    let _rs_info = [];

    if(info){
      info.forEach(async (v: any) => {
          console.log(v);
          rs_info = await admissionModels.insert(dbCO,v);
          console.log(rs_info);
          _rs_info.push(rs_info[0])
          _info.push(v);
      })
    }

  })

  next();

}

module.exports = router;