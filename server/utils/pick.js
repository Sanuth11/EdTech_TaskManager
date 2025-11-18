// small helper to pick safe fields
function pick(obj = {}, fields = []) {
  const out = {};
  for (const f of fields) if (Object.prototype.hasOwnProperty.call(obj, f)) out[f] = obj[f];
  return out;
}
module.exports = pick;
