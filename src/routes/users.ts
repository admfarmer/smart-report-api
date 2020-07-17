/// <reference path="../../typings.d.ts" />

import * as Knex from 'knex';
import * as fastify from 'fastify';
import * as HttpStatus from 'http-status-codes';
import * as crypto from 'crypto';

import { UserModel } from '../models/user';

const userModel = new UserModel();

const router = (fastify, { }, next) => {

  var db: Knex = fastify.db;

  fastify.get('/', async (req: fastify.Request, reply: fastify.Reply) => {
    reply.code(200).send({ message: 'Welcome to SMART HIS API SMART REPORT HIS!', version: '1.0 build 20190820-1' })
  });

  next();

  fastify.get('/info', { preHandler: [fastify.authenticate] }, async (req: fastify.Request, reply: fastify.Reply) => {

    try {
      const rs: any = await userModel.list(db);
      reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, info: rs, });
    } catch (error) {
      fastify.log.error(error);
      reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  })

  fastify.post('/', { preHandler: [fastify.authenticate] }, async (req: fastify.Request, reply: fastify.Reply) => {
    const username = req.body.username;

    const password = req.body.password;
    const encPassword = crypto.createHash('md5').update(password).digest('hex');

    const cid = req.body.cid;
    const fullname = req.body.fullname;
    const level_id = req.body.level_id;
    const is_accept = req.body.is_accept;
    const user_type = req.body.user_type;

    const data: any = {
      username: username,
      password: encPassword,
      cid: cid,
      fullname: fullname,
      level_id: level_id,
      is_accept: is_accept,
      user_type: user_type
    };

    try {
      await userModel.save(db, data);
      reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK })
    } catch (error) {
      fastify.log.error(error);
      reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  })

  fastify.put('/:userId', { preHandler: [fastify.authenticate] }, async (req: fastify.Request, reply: fastify.Reply) => {
    const userId = req.params.userId;
    const cid = req.body.cid;
    const fullname = req.body.fullname;
    const level_id = req.body.level_id;
    const is_accept = req.body.is_accept;
    const user_type = req.body.user_type;
    const password = req.body.password;

    const info: any = {
      cid: cid,
      fullname: fullname,
      level_id: level_id,
      is_accept: is_accept,
      user_type: user_type
    };

    if (password) {
      var encPass = crypto.createHash('md5').update(password).digest('hex');
      info.password = encPass;
    }

    try {
      await userModel.update(db, userId, info);
      reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK })
    } catch (error) {
      fastify.log.error(error);
      reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  })

  fastify.put('/changepass/:userId', { preHandler: [fastify.authenticate] }, async (req: fastify.Request, reply: fastify.Reply) => {
    const userId = req.params.userId;
    const password = req.body.password;
    const encPassword = crypto.createHash('md5').update(password).digest('hex');

    const info: any = {
      password: encPassword
    };

    try {
      await userModel.update(db, userId, info);
      reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK })
    } catch (error) {
      fastify.log.error(error);
      reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  })


}

module.exports = router;