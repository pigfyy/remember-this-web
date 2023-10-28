import { Pinecone } from "@pinecone-database/pinecone";

export const pinecone = new Pinecone({
  apiKey: "f05c0d29-522a-4407-a196-c318f08c0a16",
  environment: "gcp-starter",
});

export const listIndexes = async () => {
  const response = await fetch("/api/check-for-index");

  const responseData = await response.json();

  return responseData.index;
};

export const createClass = async (uid) => {
  const response = await fetch("/api/create-class", {
    method: "POST",
    body: JSON.stringify({ uid: uid }),
  });

  const responseData = await response.json();

  return responseData;
};

export const checkIndexStatus = async (uid) => {
  const response = await fetch("/api/check-index-status", {
    method: "POST",
    body: JSON.stringify({ uid: uid }),
  });

  const responseData = await response.json();

  return responseData.ready;
};

export const insertRecord = async (uid, record) => {
  const response = await fetch("/api/insert-record", {
    method: "POST",
    body: JSON.stringify({ userId: uid, record: record }),
  });

  const responseData = await response.json();

  return responseData;
};

export const performSearch = async (uid, embedding) => {
  const response = await fetch("/api/perform-search", {
    method: "POST",
    body: JSON.stringify({ userId: uid, embedding: embedding }),
  });

  const responseData = await response.json();

  return responseData.image;
};
