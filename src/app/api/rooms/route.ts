import { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

const pool = new Pool({
  user: 'anyelopetit',
  host: 'localhost',
  database: 'rankmipoker_development',
  password: '1234',
  port: 5432,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name } = req.body;
    const result = await pool.query(`INSERT INTO rooms (name) VALUES ($1) RETURNING *`, [name]);
    const roomId = result.rows[0].id;
    res.json({ roomId });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
