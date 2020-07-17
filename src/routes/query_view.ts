/// <reference path="../../typings.d.ts" />

import * as knex from 'knex';
import * as fastify from 'fastify';
import * as HttpStatus from 'http-status-codes';
import { QueryViewsModel } from '../models/query_view'
const queryViewsModel = new QueryViewsModel();

const router = (fastify, { }, next) => {
  var dbHIS: knex = fastify.dbHIS;

  fastify.get('/', async (req: fastify.Request, reply: fastify.Reply) => {
    reply.code(200).send({ message: 'Welcome to SMART HIS API SMART REPORT HIS!', version: '1.0 build 20190820-1' })
  });

  fastify.post('/query', { preHandler: [fastify.authenticate] }, async (req: fastify.Request, reply: fastify.Reply) => {
    let sql = req.body.query_sql;
    let paramtype = req.body.query_params;
    if (paramtype) {
      let params: any[] = paramtype;
      try {
        const rs: any = await queryViewsModel.viewReport(dbHIS, sql, params);
        reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, info: rs, });
      } catch (error) {
        fastify.log.error(error);
        reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
      }
    } else {
      try {
        const rs: any = await queryViewsModel.viewReportNoParam(dbHIS, sql);
        reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, info: rs, });
      } catch (error) {
        fastify.log.error(error);
        reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
      }
    }
  });

  next();

}

module.exports = router;