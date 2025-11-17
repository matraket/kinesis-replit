import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import { checkDbConnection } from './infrastructure/db/client.js';

const PORT = process.env.PORT || '5000';

if (!PORT) {
  console.error('ERROR: process.env.PORT is not defined. Cannot start server.');
  process.exit(1);
}

console.log(`Starting server on port ${PORT}...`);

const server = Fastify({
  logger: true
});

server.get('/', async (_request: FastifyRequest, _reply: FastifyReply) => {
  return 'Kinesis monolith running';
});

server.get('/health', async (_request: FastifyRequest, _reply: FastifyReply) => {
  let dbStatus: 'ok' | 'error' | 'unknown' = 'unknown';
  let dbError: string | undefined;

  if (process.env.DATABASE_URL) {
    const dbCheck = await checkDbConnection();
    dbStatus = dbCheck.connected ? 'ok' : 'error';
    dbError = dbCheck.error;
  }

  return {
    status: 'ok',
    service: 'kinesis-api',
    database: {
      status: dbStatus,
      error: dbError
    }
  };
});

function start() {
  const portNumber = +PORT;
  server.listen({
    port: portNumber,
    host: '0.0.0.0'
  }).then(() => {
    console.log(`Server listening on 0.0.0.0:${PORT}`);
  }).catch((err: unknown) => {
    server.log.error(err);
    process.exit(1);
  });
}

start();
