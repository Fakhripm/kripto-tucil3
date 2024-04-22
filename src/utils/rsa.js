const primeNumbers = [
    1000003,
    1000033,
    1008001,
    1809169,
    1891601,
    1896109,
    1908061,
    1909091,
    1913917,
    9709079
];

// Fungsi untuk membuat keypair
const generateKeyPair = (p, q) => {
    const n = p * q;
    //console.log("n: ", n);
    const m = (p - 1) * (q - 1);
    //console.log("m: ", BigInt(m));
    const e = getE(m);
    //console.log("e: ", e);
    const d = modInverse(e, m);
    //console.log("d: ", d);
    
    // Return public key dan private key
    return {
        publicKey: { e, n },
        privateKey: { d, n }
    };
};

// Fungsi untuk menghitung FPB (Faktor Persekutuan Terbesar)
function gcd(a, b) {
    while (b !== 0) {
        let temp = b;
        b = a - b * Math.floor(a/b);
        a = temp;
    }
    return a;
}

// Fungsi untuk memeriksa apakah dua bilangan relatif prima
function areCoprime(num1, num2) {
    return gcd(num1, num2) === 1;
}

// Fungsi untuk mencari nilai e
function getE(m) {
    let e = 2;
    while (!areCoprime(e,m)) {
        e++;
    }
    return e;
}

// Fungsi untuk menghitung invers modulo dari a terhadap modulus m
function modInverse(a, m) {
    let m0 = m;
    let x0 = 0;
    let x1 = 1;

    if (m === 1) {
        return 0;
    }

    // algoritma Extended Euclidean
    while (a > 1) {
        // q adalah hasil pembagian a oleh m
        let q = Math.floor(a / m); // Gunakan pembagian floor

        let t = m;

        // m adalah sisa dari a % m
        m = a % m;
        a = t;

        t = x0;

        // Update x0 dan x1
        x0 = x1 - q * x0;
        x1 = t;
    }

    // Pastikan x1 positif
    if (x1 < 0) {
        x1 += m0;
    }

    return x1;
}

// Fungsi untuk mencari nilai e
function buktiModInverse(a,b,m) {
    return ((a*b)%m)
}

// Contoh penggunaan
const p = 53;
const q = 59;

const keyPair = generateKeyPair(p, q);
console.log("Public Key e : ", BigInt(keyPair.publicKey.e));
console.log("Public Key n : ", BigInt(keyPair.publicKey.n));
console.log("Private Key d: ", BigInt(keyPair.privateKey.d));
console.log("Private Key n: ", BigInt(keyPair.privateKey.n));
console.log("bukti", buktiModInverse(keyPair.publicKey.e,keyPair.privateKey.d, (p-1)*(q-1)))


const encryptRSA= (message, publicKey) => {
    let { e, n } = publicKey;
    let encryptedMessage = [];
    //console.log(message);
    // Enkripsi setiap karakter dalam pesan
    for (let i = 0; i < message.length; i++) {
        let asciiCode = message.charCodeAt(i); // Dapatkan kode ASCII dari karakter
        if (i === 0) {
            //console.log(asciiCode)
        }
        let encryptedChar = (BigInt(asciiCode) ** BigInt(e)) % BigInt(n); // Enkripsi karakter
        encryptedMessage.push(encryptedChar) // Tambahkan karakter terenkripsi ke pesan terenkripsi
    }

    return encryptedMessage; 
}

// Fungsi untuk melakukan dekripsi RSA per huruf
const decryptRSA = (encryptedMessage, privateKey) => {
    let { d, n } = privateKey;
    let decryptedText = '';
    //console.log(encryptedMessage.length)
    // Lakukan dekripsi untuk setiap blok
    for (let i = 0; i < encryptedMessage.length; i ++) {
        
        let decryptedChar = (BigInt(encryptedMessage[i]) ** BigInt(d)) % BigInt(n); // Dekripsi karakter
        if (i === 0) {
            //console.log(decryptedChar);
        }
        let asciiCode = Number(decryptedChar); // Konversi BigInt ke angka
        decryptedText += String.fromCharCode(asciiCode); // Tambahkan karakter terdekripsi ke pesan terdekripsi
    }

    return decryptedText;
}


let message = "qw er ty12 345";

let encryptedMessage = encryptRSA(message, keyPair.publicKey);
console.log("Pesan terenkripsi: ", encryptedMessage);

let decryptedMessage = decryptRSA(encryptedMessage, keyPair.privateKey);
console.log("Pesan terdekripsi: ", decryptedMessage);

module.exports = { encryptRSA, decryptRSA };