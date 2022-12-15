import { filterSavedProducts } from "./exports.js";

export function OtherProducts(brand) {
  const products = filterSavedProducts(brand);
  const container = document.querySelector(".third-main-img");

  for (let i = 0; i < container.children.length; i++) {
    const card = container.children[i];
    const product = products[i];

    if (!product) continue;

    const [img, name, , footer] = card.children;
    img.src = product.thumbnail;
    name.textContent = product.shoeName;

    const [price, linkBtn] = footer.children;
    price.textContent = `$${product.retailPrice}`;
    linkBtn.onclick = () => {
      location.href = `/pages/productDetails.html?id=${product.styleID}`;
    }

    card.style.display = "flex";
  }
}