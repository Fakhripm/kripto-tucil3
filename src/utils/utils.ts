const arrayPrima = [29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401];
const { encryptRSA, decryptRSA, generateKeyPair } = require('./rsa.js');

const getKeyPair = () => {
    const p = arrayPrima[Math.floor(Math.random() * arrayPrima.length)];
    const q = arrayPrima[Math.floor(Math.random() * arrayPrima.length)];
    //const p = 61;
    //const q = 53;
    //console.log(p,"     ",q);
    const keyPair = generateKeyPair(p,q);
    return keyPair;
}

/* const generateKeysAndDownload = () => {
    const keyPair = getKeyPair();
    const publicKeyContent = JSON.stringify(keyPair.publicKey);
    const privateKeyContent = JSON.stringify(keyPair.privateKey);

    downloadFile(publicKeyContent, 'public_key.pub');
    downloadFile(privateKeyContent, 'private_key.pri');
}

const downloadFile = (content: BlobPart, fileName: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
} */

module.exports = { getKeyPair }