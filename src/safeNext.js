// Only same-site paths are valid post-login targets (blocks //host, /\host and absolute URLs).
export const safeNext = n => (typeof n === 'string' && /^\/(?![\/\\])[^\s]*$/.test(n) ? n : '');
