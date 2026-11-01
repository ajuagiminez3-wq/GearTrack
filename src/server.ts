import 'dotenv/config';
import app from './app';
import { pool } from './config/database';

async function start(): Promise<void> {
  await pool.query('SELECT 1');
  const port = Number(process.env.PORT ?? 5051);
  if (!Number.isSafeInteger(port) || port < 1 || port > 65535) throw new Error('Invalid PORT.');
  app.listen(port, () => {
    console.log(`GearTrack API running at http://localhost:${port}`);
  });
}

start().catch(error => {
  console.error('Unable to start GearTrack API. Check MAMP, .env and MySQL database.', error);
  process.exitCode = 1;
});
