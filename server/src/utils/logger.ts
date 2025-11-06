import pino from 'pino';
import fs from 'fs';
const logPath = 'docs/logs/tools/server.log';
fs.mkdirSync('docs/logs/tools', { recursive: true });
export const logger = pino(pino.transport({ target: 'pino/file', options: { destination: logPath } }));