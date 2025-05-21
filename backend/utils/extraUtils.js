export function toHalfWidth(str) {
  return str.replace(/[\uFF01-\uFF5E]/g, function(ch) {
    return String.fromCharCode(ch.charCodeAt(0) - 0xFEE0);
  }).replace(/\u3000/g, ' '); // Convert full-width space to half-width
}