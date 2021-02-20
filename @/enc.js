// import { arrayBufferToBase64, base64ToArrayBuffer } from "./utils.js";
///<reference path="./util.js"/>
const base64ToArrayBuffer = utils.base64ToArrayBuffer;
const arrayBufferToBase64 = utils.arrayBufferToBase64;
const _alg = "AES-GCM";
const root = document.getElementById("root");
self.encrypt = async function encrypt(_data) {
  const a = new Response(_data);
  const data = await a.arrayBuffer();
  const iv = await crypto.getRandomValues(new Uint8Array(50));
  const key = await crypto.subtle.generateKey(
    {
      name: _alg,
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
  const saveKey = await arrayBufferToBase64(
    await crypto.subtle.exportKey("raw", key)
  );
  const alg = {
    name: _alg,
    iv,
  };
  const enc = await crypto.subtle.encrypt(alg, key, data);
  const ivx = await arrayBufferToBase64(iv);
  console.log({ enc, iv: ivx, saveKey });
};
self.decrypt = async function decrypt(file, _iv, _key) {
  const keybuf = await base64ToArrayBuffer(_key);
  const iv = await base64ToArrayBuffer(_iv);
  try {
    const key = await crypto.subtle.importKey("raw", keybuf, _alg, !0, [
      "encrypt",
      "decrypt",
    ]);
    const dfile = await crypto.subtle.decrypt({ name: _alg, iv }, key, file);
    return dfile;
  } catch (e) {
    alert(e);
  }
};
const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
const applySaltToChar = (code, salt) =>
  textToChars(salt).reduce((a, b) => a ^ b, code);
self.enc = (salt) => {
  const byteHex = (n) => ("0" + Number(n).toString(16)).substr(-2);
  return (text) =>
    text
      .split("")
      .map(textToChars)
      .map((v) => applySaltToChar(v, salt))
      .map(byteHex)
      .join("");
};
self.dec = (salt) => {
  return (encoded) =>
    encoded
      .match(/.{1,2}/g)
      .map((hex) => parseInt(hex, 16))
      .map((v) => applySaltToChar(v, salt))
      .map((charCode) => String.fromCharCode(charCode))
      .join("");
};

self.iv =
  "o1fut+37qR0odn+Pv5QRKd+9CojU5gzOizMLn4l3+sTrj+dCHuPfKSW900aHT0AlXOA=";

self.saveKeyEnc =
  "7f79547a7b4d736d28576d4b74512c4c4578374d4854704e5d5a487a45767759465265774e7a24244c546f21";
