export const clean = (s, n = 60) => String(s ?? '').trim().slice(0, n);
export const normPhone = p => String(p || '').replace(/[\s.\-()]/g, '');
export const validPhone = p => /^\+?\d{8,15}$/.test(p);
