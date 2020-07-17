/// <reference path="../../typings.d.ts" />

import * as knex from 'knex';
import * as fastify from 'fastify';
import * as HttpStatus from 'http-status-codes';
import * as moment from 'moment';
import { Hl7Models } from '../models/hl72x';
const hl7Models = new Hl7Models();

const router = (fastify, { }, next) => {
  var db: knex = fastify.dbHIS;

  fastify.get('/', async (req: fastify.Request, reply: fastify.Reply) => {
    const hl7v2 = require('@redoxengine/redox-hl7-v2');
    const parser = new hl7v2.Parser();
    var hl7Message = `MSH|^~\&|LABOLINK||HIS||20151013104430||ORU^R01|1001|P|2.3\rPID|1||000\rOBR|1|||||20151013104427||||||||20151013104430\rOBX|1|NM|SYSTOLIC||100|mmHg|||||F|||20151013104427\rOBX|2|NM|DIASTOLIC||100|mmHg|||||F|||20151013104427\rOBX|3|NM|PULSE||100|bpm|||||F|||20151013104427\rOBX|4|NM|HEIGHT||150.0|cm|||||F|||20151013104428\rOBX|5|NM|WEIGHT||50.0|kg|||||F|||20151013104428\rOBX|6|NM|BMI||22.22222222222222|kg/m2|||||F|||20151013104428\rOBX|7|NM|SPO2||95.0|%|||||F|||20151013104429\rOBX|8|NM|TEMP||25.0|C|||||F|||20151013104429`;

    const jsonData = parser.parse(hl7Message);
    let pid = jsonData.PATIENT_RESULT[0].PATIENT.PID[3];
    let order = jsonData.PATIENT_RESULT[0].ORDER_OBSERVATION;
    let colum = jsonData.MSH[3][1];
    let row = jsonData.MSH[7][1];
    var msh = {
      msh: [colum, row],
    }
    reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, MSH: msh, PID: pid, ORDERE: order });

  });

  fastify.post('/', async (req: fastify.Request, reply: fastify.Reply) => {
    const hl7v2 = require('@redoxengine/redox-hl7-v2');
    const parser = new hl7v2.Parser();
    var isodate = new Date().toISOString();
    const thDate = `${(moment(isodate).get('year') + 543) - 2500}`;

    var table = 'o' + moment(isodate).format('DDMM') + thDate;
    const jsonData = parser.parse(req.body.hl7);
    var not_pid = jsonData.PATIENT_RESULT[0].PATIENT.PID[4]
    console.log(not_pid);

    var info: any;
    var _hn: any;
    var _pid = not_pid || '';
    // console.log(jsonData.PATIENT_RESULT[0].PATIENT.PID[1]);
    if (!_pid) {
      _hn = 'HN';
      info = {
        MSH: [jsonData.MSH[3][1], jsonData.MSH[7][1]],
        PID: [
          jsonData.PATIENT_RESULT[0].PATIENT.PID[3][0][1]
        ],
        OBR: [
          jsonData.PATIENT_RESULT[0].ORDER_OBSERVATION[0].OBR[6][1],
          jsonData.PATIENT_RESULT[0].ORDER_OBSERVATION[0].OBR[14][1]
        ],
        OBSERVATION: {
          OBX0:
            [
              jsonData.PATIENT_RESULT[0].ORDER_OBSERVATION[0].OBSERVATION[0].OBX[3][1],
              jsonData.PATIENT_RESULT[0].ORDER_OBSERVATION[0].OBSERVATION[0].OBX[5][0],
              jsonData.PATIENT_RESULT[0].ORDER_OBSERVATION[0].OBSERVATION[0].OBX[6][1],
              jsonData.PATIENT_RESULT[0].ORDER_OBSERVATION[0].OBSERVATION[0].OBX[14][1]
            ]
          ,
          OBX1: [
            jsonData.PATIENT_RESULT[0].ORDER_OBSERVATION[0].OBSERVATION[1].OBX[3][1],
            jsonData.PATIENT_RESULT[0].ORDER_OBSERVATION[0].OBSERVATION[1].OBX[5][0],
            jsonData.PATIENT_RESULT[0].ORDER_OBSERVATION[0].OBSERVATION[1].OBX[6][1],
            jsonData.PATIENT_RESULT[0].ORDER_OBSERVATION[0].OBSERVATION[1].OBX[14][1]
          ],
          OBX2: [
            jsonData.PATIENT_RESULT[0].ORDER_OBSERVATION[0].OBSERVATION[2].OBX[3][1],
            jsonData.PATIENT_RESULT[0].ORDER_OBSERVATION[0].OBSERVATION[2].OBX[5][0],
            jsonData.PATIENT_RESULT[0].ORDER_OBSERVATION[0].OBSERVATION[2].OBX[6][1],
            jsonData.PATIENT_RESULT[0].ORDER_OBSERVATION[0].OBSERVATION[2].OBX[14][1]
          ]
        },
      }

    } else {
      _hn = 'CID';
      info = {
        MSH: [jsonData.MSH[3][1], jsonData.MSH[7][1]],
        PID: [
          jsonData.PATIENT_RESULT[0].PATIENT.PID[4][0][1]
        ],
        OBR: [
          jsonData.PATIENT_RESULT[0].ORDER_OBSERVATION[0].OBR[6][1],
          jsonData.PATIENT_RESULT[0].ORDER_OBSERVATION[0].OBR[14][1]
        ],
        OBSERVATION: {
          OBX0:
            [
              jsonData.PATIENT_RESULT[0].ORDER_OBSERVATION[0].OBSERVATION[0].OBX[3][1],
              jsonData.PATIENT_RESULT[0].ORDER_OBSERVATION[0].OBSERVATION[0].OBX[5][0],
              jsonData.PATIENT_RESULT[0].ORDER_OBSERVATION[0].OBSERVATION[0].OBX[6][1],
              jsonData.PATIENT_RESULT[0].ORDER_OBSERVATION[0].OBSERVATION[0].OBX[14][1]
            ]
          ,
          OBX1: [
            jsonData.PATIENT_RESULT[0].ORDER_OBSERVATION[0].OBSERVATION[1].OBX[3][1],
            jsonData.PATIENT_RESULT[0].ORDER_OBSERVATION[0].OBSERVATION[1].OBX[5][0],
            jsonData.PATIENT_RESULT[0].ORDER_OBSERVATION[0].OBSERVATION[1].OBX[6][1],
            jsonData.PATIENT_RESULT[0].ORDER_OBSERVATION[0].OBSERVATION[1].OBX[14][1]
          ],
          OBX2: [
            jsonData.PATIENT_RESULT[0].ORDER_OBSERVATION[0].OBSERVATION[2].OBX[3][1],
            jsonData.PATIENT_RESULT[0].ORDER_OBSERVATION[0].OBSERVATION[2].OBX[5][0],
            jsonData.PATIENT_RESULT[0].ORDER_OBSERVATION[0].OBSERVATION[2].OBX[6][1],
            jsonData.PATIENT_RESULT[0].ORDER_OBSERVATION[0].OBSERVATION[2].OBX[14][1]
          ]
        },
      }

    }

    let status = info.MSH[0];
    let PID: any;
    console.log(info);
    console.log(info.PID[0]);

    if (_hn == 'CID') {
      let CID = info.PID[0];
      let rs = await hl7Models.getPID(db, CID);
      PID = rs[0].hn;
      console.log('1HN :', PID);
    } else if (_hn == 'HN') {
      PID = info.PID[0];
      console.log('2HN :', PID);

    }

    let _info: any;
    let _vn: any = [];


    let rsx = await hl7Models.getLastVn(db, PID);
    _vn = rsx[0].vn;
    console.log(rsx[0].vn);


    if (status == 'LABOLINK01') {
      _info = {
        SYSTOLIC: info.OBSERVATION.OBX0[1],
        PULSE: info.OBSERVATION.OBX1[1],
        DIASTOLIC: info.OBSERVATION.OBX2[1]
      }
      if (_vn) {
        let rsbp = await hl7Models.updateBP(db, _vn, _info);
        // let rsbp_o = await hl7Models.updateBP_o(db, _vn, _info, table);
        reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, info: _info })
      } else {
        reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, info: 'ไม่พบผู้รับบริการในวันนี้', datas: _info, PID: PID });
      }

    } else if (status == 'LABOLINK02') {
      _info = {
        BMI: info.OBSERVATION.OBX0[1],
        WEIGHT: info.OBSERVATION.OBX1[1],
        HEIGHT: info.OBSERVATION.OBX2[1]
      }

      if (_vn) {
        let rsbp = await hl7Models.updateBW(db, _vn, _info);
        // let rsbp_o = await hl7Models.updateBW_o(db, _vn, _info, table);
        reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, info: _info })
      } else {
        reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, info: 'ไม่พบผู้รับบริการในวันนี้', datas: _info, PID: PID });
      }
    } else {
      reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, info: 'ข้อมูลที่ส่งมาไม่ตรงตาม format ที่ต้องการ', MSH: status });
    }
    reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, info: _info, PID: PID, datas: info });
  });

  next();

}

module.exports = router;