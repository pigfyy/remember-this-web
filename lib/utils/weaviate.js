import weaviate from "weaviate-ts-client";

import { capitalizeFirstLetter } from "./processing";

const client = weaviate.client({ scheme: "http", host: "localhost:8080" });

const doesClassExist = async (className) => {
  let allClassDefinitions = await client.schema.getter().do();

  return allClassDefinitions.classes.some((classesObj) => {
    return (
      capitalizeFirstLetter(classesObj.class) ===
      capitalizeFirstLetter(className)
    );
  });
};

const createClass = async (className) => {
  const schemaConfig = {
    class: className,
    vectorizer: "multi2vec-clip",
    moduleConfig: {
      "multi2vec-clip": {
        textFields: ["name"],
        imageFields: ["image"],
      },
    },
    properties: [
      {
        dataType: ["text"],
        name: "name",
      },
      {
        dataType: ["blob"],
        name: "image",
      },
    ],
  };

  await client.schema.classCreator().withClass(schemaConfig).do();
};

const search = async (searchString, className) => {
  const result = await client.graphql
    .get()
    .withClassName(className)
    .withFields(["image"])
    .withNearText({ concepts: [searchString] })
    .withLimit(1)
    .do();

  const b64Img = result.data.Get[className][0].image;

  return b64Img;
};

const getBatchWithCursor = async (
  className,
  classProperties,
  batchSize,
  cursor
) => {
  const query = client.graphql
    .get()
    .withClassName(className)
    // Optionally retrieve the vector embedding by adding `vector` to the _additional fields
    .withFields(classProperties.join(" ") + " _additional { id vector }")
    .withLimit(batchSize);

  if (cursor) {
    return await query.withAfter(cursor).do();
  } else {
    return await query.do();
  }
};

const queryUserImages = async (uid) => {
  const className = capitalizeFirstLetter(uid);
  const classProperties = ["image"];
  const batchSize = 20;
  const cursor = null;

  const res = await getBatchWithCursor(
    className,
    classProperties,
    batchSize,
    cursor
  );

  const data = res.data.Get[className];

  return data;
};

const deleteAllClasses = async () => {
  let allClassDefinitions = await client.schema.getter().do();

  allClassDefinitions.classes.forEach(async (classesObj) => {
    await client.schema.classDeleter().withClassName(classesObj.class).do();
  });
};

export {
  client,
  doesClassExist,
  createClass,
  search,
  getBatchWithCursor,
  queryUserImages,
  deleteAllClasses,
};
