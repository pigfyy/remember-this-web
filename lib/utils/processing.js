export const fetchApi = async (url, method, body) => {
  const response = await fetch(url, {
    method,
    body: JSON.stringify(body),
  });
  const responseData = await response.json();
  return responseData;
};
