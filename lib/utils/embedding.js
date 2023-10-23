/**
 * Fetches embedding data from a specified URL using a POST request.
 *
 * @param {{ image: (string | null), text: (string | null) }} data - The JSON data to be sent in the request body.
 * @returns {Promise} A promise that resolves to the response data.
 * @throws {Error} If the network response is not successful.
 */
const getEmbedding = async (data) => {
  const response = await fetch("http://127.0.0.1:8080/get-embedding", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data), // Convert the data to JSON format
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const res = await response.json();

  return JSON.parse(res.embedding);
};

export { getEmbedding };
