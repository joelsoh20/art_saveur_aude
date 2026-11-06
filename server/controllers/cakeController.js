import * as Cake from '../models/cakeModel.js';
import { clean } from '../utils/validators.js';
import { rmImage } from '../utils/files.js';

const imageUrl = file => (file ? `/uploads/${file.filename}` : null);

// Public
export const listPublic = async (req, res) => res.json(await Cake.listPublic());

// Admin
export const listAll = async (req, res) => res.json(await Cake.listAll());

export async function create(req, res) {
  const name = clean(req.body.name);
  if (!name) return res.status(400).json({ error: 'Le nom est obligatoire.' });
  const id = await Cake.create({
    name, description: clean(req.body.description, 300), price: clean(req.body.price, 40),
    emoji: clean(req.body.emoji, 8) || '🍰', imageUrl: imageUrl(req.file),
  });
  res.json({ id });
}

export async function update(req, res) {
  const c = await Cake.findById(req.params.id);
  if (!c) return res.status(404).json({ error: 'Introuvable' });
  let img = c.image_url;
  if (req.file) { rmImage(c.image_url); img = imageUrl(req.file); }
  else if (req.body.removeImage === '1') { rmImage(c.image_url); img = null; }
  await Cake.update(c.id, {
    name: clean(req.body.name) || c.name, description: clean(req.body.description, 300), price: clean(req.body.price, 40),
    emoji: clean(req.body.emoji, 8) || c.emoji, imageUrl: img,
  });
  res.json({ ok: true });
}

export async function remove(req, res) {
  const c = await Cake.findById(req.params.id);
  if (c) { rmImage(c.image_url); await Cake.remove(c.id); }
  res.json({ ok: true });
}
