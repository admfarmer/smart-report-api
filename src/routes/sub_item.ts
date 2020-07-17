/// <reference path="../../typings.d.ts" />

import * as Knex from 'knex';
import * as fastify from 'fastify';
import * as HttpStatus from 'http-status-codes';

import { SubMenuItemModels } from '../models/sub_item';

const subMenuItemModels = new SubMenuItemModels();

const router = (fastify, { }, next) => {

  var db: Knex = fastify.db;

  fastify.get('/', async (req: fastify.Request, reply: fastify.Reply) => {
    reply.code(200).send({ message: 'Welcome to SMART HIS API SMART REPORT HIS!', version: '1.0 build 20190820-1' })
  });

  next();

  fastify.get('/info', { preHandler: [fastify.authenticate] }, async (req: fastify.Request, reply: fastify.Reply) => {

    try {
      const rs: any = await subMenuItemModels.listall(db);
      reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, info: rs, });
    } catch (error) {
      fastify.log.error(error);
      reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  })

  fastify.get('/selectItem/:query_id', { preHandler: [fastify.authenticate] }, async (req: fastify.Request, reply: fastify.Reply) => {
    const query_id = req.params.query_id;

    try {
      const rs: any = await subMenuItemModels.listone(db, query_id);
      reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, info: rs, });
    } catch (error) {
      fastify.log.error(error);
      reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  })
  fastify.get('/select/:item_id/:userLevel', { preHandler: [fastify.authenticate] }, async (req: fastify.Request, reply: fastify.Reply) => {
    const item_id = req.params.item_id;
    const userLevel = req.params.userLevel;

    try {
      var rs: any;
      if (userLevel > '4') {
        const rs: any = await subMenuItemModels.selectlevel(db, item_id, userLevel);
        reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, info: rs, });
      } else {
        const rs: any = await subMenuItemModels.listtwo(db, item_id, userLevel);
        reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, info: rs, });
      }
    } catch (error) {
      fastify.log.error(error);
      reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  })

  fastify.post('/', { preHandler: [fastify.authenticate] }, async (req: fastify.Request, reply: fastify.Reply) => {
    const item_id = req.body.item_id;
    const query_name = req.body.query_name;
    const query_sql = req.body.query_sql;
    const query_params = req.body.query_params;
    const template = req.body.template;
    const comment = req.body.comment;
    const level_id = req.body.level_id;

    const info: any = {
      item_id: item_id,
      query_name: query_name,
      query_sql: query_sql,
      query_params: query_params,
      template: template,
      comment: comment,
      level_id: level_id
    };

    try {
      await subMenuItemModels.save(db, info);
      reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK })
    } catch (error) {
      fastify.log.error(error);
      reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  })

  fastify.put('/:query_id', { preHandler: [fastify.authenticate] }, async (req: fastify.Request, reply: fastify.Reply) => {
    const query_id = req.params.query_id;
    const item_id = req.body.item_id;
    const query_name = req.body.query_name;
    const query_sql = req.body.query_sql;
    const query_params = req.body.query_params;
    const template = req.body.template;
    const comment = req.body.comment;
    const level_id = req.body.level_id;

    const info: any = {
      item_id: item_id,
      query_name: query_name,
      query_sql: query_sql,
      query_params: query_params,
      template: template,
      comment: comment,
      level_id: level_id
    };

    try {
      await subMenuItemModels.update(db, query_id, info);
      reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK })
    } catch (error) {
      fastify.log.error(error);
      reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  })

}

module.exports = router;