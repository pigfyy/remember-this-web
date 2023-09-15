import weaviate from "weaviate-ts-client";

const client = weaviate.client({ scheme: "http", host: "localhost:8080" });

const doesClassExist = async (className) => {
  const capitalizeFirstLetter = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1);

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

const deleteAllClasses = async (className) => {
  let allClassDefinitions = await client.schema.getter().do();

  allClassDefinitions.classes.forEach(async (classesObj) => {
    await client.schema.classDeleter().withClassName(classesObj.class).do();
  });
};

export { client, doesClassExist, createClass, deleteAllClasses };
