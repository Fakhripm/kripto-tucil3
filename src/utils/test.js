const huruf = "H"
const ascii = huruf.charCodeAt(0);
console.log(ascii)
const encrypted = (BigInt(ascii) ** 7n) % 3233n
console.log(encrypted)

const decrypted = encrypted ** 1783n% 3233n
console.log(decrypted);
const decryptnumber = Number(decrypted);
console.log(String.fromCharCode(decryptnumber))