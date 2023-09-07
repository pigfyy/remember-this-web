import {
  PAT,
  USER_ID,
  APP_ID,
  MODEL_ID,
  MODEL_VERSION_ID,
} from "@/lib/constants/imageRecognition";

const createRequestOptions = (IMAGE_URL) => {
  const raw = JSON.stringify({
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID,
    },
    inputs: [
      {
        data: {
          image: {
            url: IMAGE_URL,
          },
        },
      },
    ],
  });

  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: "Key " + PAT,
    },
    body: raw,
  };

  return requestOptions;
};

const getConcepts = (IMAGE_URL) => {
  const requestOptions = createRequestOptions(IMAGE_URL);

  return new Promise((resolve, reject) => {
    fetch(
      "https://api.clarifai.com/v2/models/" +
        MODEL_ID +
        "/versions/" +
        MODEL_VERSION_ID +
        "/outputs",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        const concepts = JSON.parse(result).outputs[0].data.concepts;
        resolve(concepts);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export { getConcepts };
