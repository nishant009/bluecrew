import { query } from '../db_utils';

export default async (req, res) => {
  const results = await query({
    sql: 'SELECT `username` FROM `cat` WHERE `name` = ?',
    values: ['fluffy']
  });
  res.json({ username: results.username });
};
