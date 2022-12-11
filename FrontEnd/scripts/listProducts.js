import { API_URL } from "./exports.js";

async function shoeSearch() {
  const query = location.search.substring(1);
  const reqQuery = encodeURI(query);

  const reqUrl = `${API_URL}/products/search?${reqQuery}`;

  const request = await fetch(reqUrl, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    mode: "cors"
  }).then(res => res.json()).then(value => value.products).catch(e => console.error(e));
  console.log({ request });
  return request;
}

const products = shoeSearch();

