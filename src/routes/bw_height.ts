/// <reference path="../../typings.d.ts" />

import * as knex from 'knex';
import * as fastify from 'fastify';
import * as HttpStatus from 'http-status-codes';
import * as moment from 'moment';
import { Hl7Models } from '../models/hl72x';
const hl7Models = new Hl7Models();

const router = (fastify, { }, next) => {
  var db: knex = fastify.dbHIS;

  //bw_height/info?hn=xxx
  fastify.post('/info', async (req: fastify.Request, reply: fastify.Reply) => {


    let info = req.body.rows;
    let vn: any[] = [];
    let bmi = info.WEIGHT / ((info.HEIGHT / 100) * (info.HEIGHT / 100));
    console.log(info);
    console.log(bmi);

    let _info = {
      WEIGHT: info.WEIGHT,
      HEIGHT: info.HEIGHT,
      BMI: bmi
    }

    try {
      const rs: any = await hl7Models.getVn(db, info.HN);

      if (rs[0]) {
        console.log(rs);

        rs.forEach(async (v: any) => {
          vn.push(v.vn);
          console.log(vn);

          const rs: any = await hl7Models.updateBW(db, v.vn, _info);

        });

        reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, info: _info });
      } else {
        reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, info: false });
      }

    } catch (error) {
      fastify.log.error(error);
      reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }

  });

  next();

}

module.exports = router;