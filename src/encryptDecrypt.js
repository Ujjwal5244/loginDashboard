import { useEffect } from "react";
import { redirect } from "react-router-dom";

const keyHex =
  "cb8987cf5c171fc108be43286a1f9a71ee1abd50c8a86f054564155712f77514";
const ivHex = "3705089b08cea68eedbf17ee60816964";
export const baseUrl="https://kyc-c9l7.onrender.com"
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const algorithm = "AES-CBC";
// Helper function to convert Base64 to File
export const base64ToFile = (base64String, fileName) => {
  const arr = base64String.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const byteString = atob(arr[1]);
  let n = byteString.length;
  const uint8Array = new Uint8Array(n);
  while (n--) {
    uint8Array[n] = byteString.charCodeAt(n);
  }
  return new File([uint8Array], fileName, { type: mime });
};
// useEffect(()=>{
//   Socket.on("redirect", handleRedirct)

//   return ()=>{
//     Socket.off("redirect", handleRedirct);
//   }
// },[handleRedirct])
// Convert hex string to byte array
const hexToBytes = (hex) => {
  const match = hex.match(/.{1,2}/g);
  if (!match) throw new Error("Invalid hex string");
  return new Uint8Array(match?.map((byte) => parseInt(byte, 16)));
};

// Convert byte array to hex string
const bytesToHex = (bytes) => {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

export const encryptText = async (data) => {
  console.log(data)
  const inputJsonString = JSON.stringify(data); // Convert the whole object into a JSON string
  const encryptedData = await encryptField(inputJsonString);
  return encryptedData;
};

const encryptField = async (data) => {
  const keyBytes = hexToBytes(keyHex);
  const ivBytes = hexToBytes(ivHex);

  const key = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: algorithm },
    false,
    ["encrypt"]
  );

  const encrypted = await crypto.subtle.encrypt(
    { name: algorithm, iv: ivBytes },
    key,
    textEncoder.encode(data)
  );

  return bytesToHex(new Uint8Array(encrypted));
};

const decryptField = async (encryptedData) => {
  const keyBytes = hexToBytes(keyHex);
  const ivBytes = hexToBytes(ivHex);
  const encryptedBytes = hexToBytes(encryptedData);

  const key = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: algorithm },
    false,
    ["decrypt"]
  );

  const decrypted = await crypto.subtle.decrypt(
    { name: algorithm, iv: ivBytes },
    key,
    encryptedBytes
  );

  return textDecoder.decode(decrypted);
};

export const decryptText = async (data) => {
  // console.log(data,"data")
  const decryptedData = await decryptField(data);
  // console.log(decryptedData,"inside decryption")
  return decryptedData;
};

export const token = localStorage.getItem("userToken");