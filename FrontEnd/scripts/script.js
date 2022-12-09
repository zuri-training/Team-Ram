const API_URL = "https://price-compare-gyn2.onrender.com";

async function loadPopularProducts() {
  const popularProducts = await fetch(API_URL + "/products/popular", {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json"
    },
    mode: "cors",
  }).then(res => res.json()).then(value => value.products).catch(e => console.error(e));
  // console.log(popularProducts)
  const products = document.querySelectorAll(".popular-products");

  for (let i = 0; i < products.length; i++) {
    const [img, body] = products[i].children;
    img.src = popularProducts[i].thumbnail;
    const [name, , end] = body.children;
    name.textContent = popularProducts[i].make;
    const [price, link] = end.children;
    price.textContent = `$${popularProducts[i].retailPrice}`
    link.href = `/product?id=${popularProducts[i].styleID}`
  }
}

window.onload = () => {
  loadPopularProducts();
}

// const landingPageSearchBtn = document.querySelector("#");

// landingPageSearchBtn.onclick = () => shoeSearch();

// function shoeSearch() {
//   const query = document.querySelector("");
// }