/// <reference path="../../typings.d.ts" />

import * as knex from 'knex';
import * as fastify from 'fastify';
import * as HttpStatus from 'http-status-codes';

import { ViewsVisitModel } from '../models/covid_19_visit'
const viewsVisitModel = new ViewsVisitModel();

const router = (fastify, { }, next) => {
  var db: knex = fastify.dbHIS;

  fastify.get('/', async (req: fastify.Request, reply: fastify.Reply) => {
    reply.code(200).send({ message: 'Welcome to SMART HIS API SMART REPORT HIS!', version: '1.0 build 20190820-1' })
  });

  fastify.get('/info', async (req: fastify.Request, reply: fastify.Reply) => {
      const todate = req.query.todate
      const treat_no = req.query.treat_no
    try {
      const rs: any = await viewsVisitModel.viewVisit19(db,todate,treat_no);
      reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, info: rs[0] });
    } catch (error) {
      fastify.log.error(error);
      reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }

  });

  next();

}

module.exports = router;