import { query } from '../../src/db_utils';

export async function createRecords(numRecords) {
  const insertQuery =
    'INSERT INTO `cat` (`id`, `name`, `username`, `password`, `breed`, `imageUrl`, `addedAt`, `lastSeenAt`, `birthDate`, `weight`) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW(), ?, ?)';
  const name = 'temp';
  const username = 'test';
  const password = 'password';
  const weight = 5.4;
  for (let i = 0; i < numRecords; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await query({
      sql: insertQuery,
      values: [i, name + i, username + i, password + i, '', '', null, weight]
    });
  }
}

export async function deleteRecords() {
  await query({ sql: 'DELETE FROM cat' });
}
