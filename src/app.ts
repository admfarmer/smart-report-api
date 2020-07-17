/// <reference path="../typings.d.ts" />

import path = require('path');
import * as http from 'http'
import * as HttpStatus from 'http-status-codes';
import * as fastify from 'fastify';

require('dotenv').config({ path: path.join(__dirname, '../config') });

import { Server, IncomingMessage, ServerResponse, ServerRequest } from 'http';

import helmet = require('fastify-helmet');

const app: fastify.FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify({ logger: { level: 'info' }, bodyLimit: 5 * 1048576 });

app.register(require('fastify-formbody'));
app.register(require('fastify-cors'), {});
app.register(require('fastify-no-icon'));
app.register(
  helmet,
  { hidePoweredBy: { setTo: 'PHP 5.2.0' } }
);

app.register(require('fastify-rate-limit'), {
  max: +process.env.MAX_CONNECTION_PER_MINUTE || 1000,
  timeWindow: '1 minute'
});

app.register(require('fastify-static'), {
  root: path.join(__dirname, '../public'),
  prefix: '/html',
});

app.register(require('fastify-jwt'), {
  secret: process.env.SECRET_KEY
});

app.decorate("authenticate", async (request, reply) => {
  let token: string = null;

  if (request.headers.authorization && request.headers.authorization.split(' ')[0] === 'Bearer') {
    token = request.headers.authorization.split(' ')[1];
  } else if (request.query && request.query.token) {
    token = request.query.token;
  } else {
    token = request.body.token;
  }

  try {
    const decoded = await request.jwtVerify(token);
  } catch (err) {
    reply.status(HttpStatus.UNAUTHORIZED).send({
      statusCode: HttpStatus.UNAUTHORIZED,
      error: HttpStatus.getStatusText(HttpStatus.UNAUTHORIZED),
      message: 'Access denied!'
    })
  }
});

app.register(require('./plugins/db'), {
  connection: {
    client: 'mysql',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      port: +process.env.DB_PORT,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    pool: {
      min: 0,
      max: 7,
      afterCreate: (conn, done) => {
        conn.query('SET NAMES utf8', (err) => {
          done(err, conn);
        });
      }
    },
    debug: false,
  },
  connectionName: 'db'
});

if (process.env.DBHIS_TYPE === 'pg' || process.env.DBHIS_TYPE === 'mssql' || process.env.DBHIS_TYPE === 'oracledb') {

  if (process.env.DBHIS_TYPE === 'pg') {
    app.register(require('./plugins/db'), {
      connection: {
        client: process.env.DBHIS_TYPE,
        connection: {
          host: process.env.DBHIS_HOST,
          user: process.env.DBHIS_USER,
          port: +process.env.DBHIS_PORT,
          password: process.env.DBHIS_PASSWORD,
          database: process.env.DBHIS_NAME,
        },
        searchPath: ['public'],
        pool: {
          min: 0,
          max: 7
        },
        debug: false,
      },

      connectionName: 'dbHIS'
    });
  } else {
    app.register(require('./plugins/db'), {
      connection: {
        client: process.env.DBHIS_TYPE,
        connection: {
          host: process.env.DBHIS_HOST,
          user: process.env.DBHIS_USER,
          port: +process.env.DBHIS_PORT,
          password: process.env.DBHIS_PASSWORD,
          database: process.env.DBHIS_NAME,
        },
        pool: {
          min: 0,
          max: 7
        },
        debug: false,
      },
      connectionName: 'dbHIS'
    });
  }

} else {
  app.register(require('./plugins/db'), {
    connection: {
      client: 'mysql',
      connection: {
        host: process.env.DBHIS_HOST,
        user: process.env.DBHIS_USER,
        port: +process.env.DBHIS_PORT,
        password: process.env.DBHIS_PASSWORD,
        database: process.env.DBHIS_NAME,
      },
      pool: {
        min: 0,
        max: 7,
        afterCreate: (conn, done) => {
          conn.query('SET NAMES utf8', (err) => {
            done(err, conn);
          });
        }
      },
      debug: false,
    },
    connectionName: 'dbHIS'
  });
}


app.register(require('./routes/index'), { prefix: '/v1', logger: true });
app.register(require('./routes/login'), { prefix: '/login', logger: true });
app.register(require('./routes/users'), { prefix: '/v1/user', logger: true });
app.register(require('./routes/sub_item'), { prefix: '/v1/query', logger: true });
app.register(require('./routes/menu_item'), { prefix: '/v1/menuitem', logger: true });
app.register(require('./routes/query_view'), { prefix: '/v1/showview', logger: true });
app.register(require('./routes/user_type'), { prefix: '/v1/usertype', logger: true });
app.register(require('./routes/hl7v2x'), { prefix: '/v1/hl7', logger: true });


app.get('/', async (req: fastify.FastifyRequest<http.IncomingMessage>, reply: fastify.FastifyReply<http.ServerResponse>) => {
  reply.code(200).send({ message: 'Welcome to SMART HIS API SMART REPORT HIS!', version: '1.0 build 20190820-1' })
});

const port = +process.env.HTTP_PORT || 3005;
const host = process.env.HTTP_ADDRESS || '0.0.0.0';

app.listen(port, host, (err) => {
  if (err) throw err;
  console.log(app.server.address());
});
