// Express 4 ne capte pas les rejets des handlers async : on les transmet à next()
export const ah = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
