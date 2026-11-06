import { q, one, run } from '../config/database.js';

export const listPublic = () => q('SELECT id,name,description,price,image_url,emoji FROM cakes ORDER BY position,id');
export const listAll = () => q('SELECT * FROM cakes ORDER BY position,id');
export const findById = id => one('SELECT * FROM cakes WHERE id=$1', [Number(id) || 0]);
export const count = async () => (await one('SELECT COUNT(*)::int c FROM cakes')).c;

export async function create({ name, description, price, emoji, imageUrl }) {
  const { p } = await one('SELECT COALESCE(MAX(position),0)+1 p FROM cakes');
  const { id } = await one('INSERT INTO cakes(name,description,price,emoji,image_url,position) VALUES($1,$2,$3,$4,$5,$6) RETURNING id',
    [name, description, price, emoji, imageUrl, p]);
  return id;
}
export const insertSeed = (name, description, price, emoji, position) =>
  run('INSERT INTO cakes(name,description,price,emoji,position) VALUES($1,$2,$3,$4,$5)', [name, description, price, emoji, position]);

export const update = (id, { name, description, price, emoji, imageUrl }) =>
  run('UPDATE cakes SET name=$1,description=$2,price=$3,emoji=$4,image_url=$5 WHERE id=$6', [name, description, price, emoji, imageUrl, id]);
export const remove = id => run('DELETE FROM cakes WHERE id=$1', [id]);
