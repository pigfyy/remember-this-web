import { Pinecone } from "@pinecone-database/pinecone";
import { fetchApi } from "./processing";

export const pinecone = new Pinecone({
  apiKey: "f05c0d29-522a-4407-a196-c318f08c0a16",
  environment: "gcp-starter",
});

export const listIndexes = async () => {
  const responseData = await fetchApi("/api/check-for-index");
  return responseData.index;
};

export const createClass = async (uid) => {
  const responseData = await fetchApi("/api/create-class", "POST", {
    uid: uid,
  });
  return responseData;
};

export const checkIndexStatus = async (uid) => {
  const responseData = await fetchApi("/api/check-index-status", "POST", {
    uid: uid,
  });
  return responseData.ready;
};

export const insertRecord = async (uid, record) => {
  const responseData = await fetchApi("/api/insert-record", "POST", {
    userId: uid,
    record: record,
  });
  return responseData;
};

export const performSearch = async (uid, embedding) => {
  const responseData = await fetchApi("/api/perform-search", "POST", {
    userId: uid,
    embedding: embedding,
  });
  return responseData.image;
};

export const deleteRecords = async (uid, recordIds) => {
  const responseData = await fetchApi("/api/delete-record", "POST", {
    userId: uid,
    recordIds: recordIds,
  });
  return responseData;
};
