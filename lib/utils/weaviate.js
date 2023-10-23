import weaviate from "weaviate-ts-client";

import { capitalizeFirstLetter } from "./processing";

const client = weaviate.client({
  scheme: "https",
  host: "remember-this-qcrj3fkc.weaviate.network",
});

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
    properties: [
      { name: "image", dataType: ["blob"] },
      { name: "imageURL", dataType: ["text"] },
    ],
  };

  await client.schema.classCreator().withClass(schemaConfig).do();
};

const search = async (embedding, className) => {
  const result = await client.graphql
    .get()
    .withClassName(className)
    .withFields(["image"])
    .withNearVector({ vector: embedding })
    .withLimit(1)
    .do();

  const imgObj = result.data.Get[capitalizeFirstLetter(className)][0];

  return imgObj;
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

const queryUserImages = async (id) => {
  const className = capitalizeFirstLetter(id);
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

// temp (might be temporarily temporary)

const deleteAllClasses = async () => {
  let allClassDefinitions = await client.schema.getter().do();

  allClassDefinitions.classes.forEach(async (classesObj) => {
    await client.schema.classDeleter().withClassName(classesObj.class).do();
  });
};

const deleteAllUserObjects = async (id) => {
  const list = await queryUserImages(id);

  console.log(list);

  // for (const item of list) {
  //   await client.data
  //     .deleter()
  //     .withClassName("OjMssz8VLET5oohgwj5TdJOFyH83") // Class of the object to be deleted
  //     .withId(item._additional.id)
  //     .do();
  // }
};

export {
  client,
  doesClassExist,
  createClass,
  search,
  getBatchWithCursor,
  queryUserImages,
  deleteAllClasses,
  deleteAllUserObjects,
};
