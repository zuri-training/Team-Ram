import { API_URL, sessionSaveProducts } from "./exports.js";

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
  })
    .then(res => res.json())
    .then(value => value.products)
    .catch(e => console.error(e));

  return request;
}


window.onload = async () => {
  // call the api
  const products = await shoeSearch();
  // create an object containing all the cards
  const productCards = Object.fromEntries(
    document.querySelectorAll(
      ".product-card"
    ).entries()
  )

  for (let i in productCards) {
    const card = productCards[i];
    const product = products[i];
    if (!product) continue;
    // destructure the parts of the card 
    // and give them their respective props
    const [image, body] = card.children;
    image.src = product.thumbnail;
    image.alt = product.shoeName;
    image.title = product.shoeName;

    const [name, , end] = body.children;
    // prevent overly long product names
    let shoeName = trimName(product.shoeName);
    name.textContent = shoeName;
    const [price, link] = end.children;
    price.textContent = product.retailPrice ? `$${product.retailPrice}` : "";
    link.href = `/pages/productDetails.html?id=${product.styleID}`;

    // finally show card
    card.style.display = "block"
  }

  sessionSaveProducts(products);
}

function trimName(name) {
  if (name.length <= 20) return name;
  // remove extra words and add ellipses
  name = name.slice(0, 20) + "...";
  return name;
}

const landingPageSearchBtn = document.getElementById("landing-page-search-btn");

landingPageSearchBtn.onclick = () => {
  const query = document.getElementById("landing-page-search").value;
  if (!query) return;

  const reqQuery = encodeURI(query);

  location.href = `${location.origin}/pages/list.html?q=${reqQuery}`;
};