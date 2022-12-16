import { searchSavedProducts } from "./exports.js";


const searchBtn = document.querySelector(".search-img");
searchBtn.onclick = () => ShoeSearch();

function ShoeSearch() {
  const query = document.getElementById("search-bar").value;
  location.href = `/pages/list.html?q=${query}`;
}

window.onload = () => {
  LoadItems();
  document.querySelector(".size-select").onchange = () => {
    LoadItems();
  }
}

function getUrlQuery() {
  // get the product id from the search query
  const query = location.search.substring(1);
  const [, id] = query.split('=');
  return id;
}



function LoadItems() {
  const id = getUrlQuery();
  const product = searchSavedProducts(id);
  const itemCards = document.querySelectorAll(".col.item");
  const resellKeys = Object.keys(product.lowestResellPrice);

  for (let i in resellKeys) {
    const key = resellKeys[i];
    const card = itemCards[i];
    const [col1, col2, col3] = card.children[0].children[0].children;

    // set image thumbnail
    const img = col1.children[0].children[0];
    img.src = product.thumbnail;

    const [nameRow, sizeRow, vendorRow, , detailsRow] = col2.children;
    // product details
    nameRow.children[0].textContent = product.shoeName;
    sizeRow.children[0].textContent = "Size: " + (
      document.querySelector(".size-select").value
    );

    const [vendor] = vendorRow.children[1].children;
    vendor.textContent = key;

    const [detailsLink] = detailsRow.children;
    detailsLink.href = `/pages/productDetails.html?id=${id}`;

    const [, price, itemLink] = col3.children[0].children;
    price.children[0].textContent = `$${product.lowestResellPrice[key]}`;

    const [itemLinkBtn] = itemLink.children;
    itemLinkBtn.onclick = () => {
      location = product.resellLinks[key]
    }
    card.style.display = "block";

  }
}