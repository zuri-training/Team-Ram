import { OtherProducts } from "./alsoLike.js";
import { API_URL, getCurrentUser, searchSavedProducts } from "./exports.js";

window.onload = () => {
  RenderDetails();
  LoadComments();
  const user = getCurrentUser();
  if (!user) {
    const commentInput = document.querySelector(".comment-input");
    commentInput.disabled = true;
    commentInput.value = "Login/Sign-up to comment";
    document.querySelector(".post-comment").style.display = "none";
  }
}


function getUrlQuery() {
  // get the product id from the search query
  const query = location.search.substring(1);
  const [, id] = query.split('=');
  return id;
}

function getProductDetails() {
  const id = getUrlQuery();
  const product = searchSavedProducts(id);

  if (!product) location.pathname = "/";

  return product;
}


const details = getProductDetails();

function RenderDetails() {
  // display the main shoe image
  const mainImg = document.getElementById("shoe-img-main");
  mainImg.src = details.thumbnail;

  // display the other shoe images
  const otherImgs = document.querySelector(".second-main-img-small");
  for (let i in otherImgs.children) {
    let img = otherImgs[i];
    let thumbnail = details.imageLinks[i];
    if (!thumbnail) continue;
    img.style.display = "block";
  }

  // display shoe details
  const shoeName = document.getElementById("main-shoe-name");
  shoeName.textContent = details.shoeName;

  // const [, sizes] = document.querySelector(".size");



  const vendor = document.querySelector(".vendor");
  for (let i in details.lowestResellPrice) {
    let newVendor = document.createElement("p");
    let newVendorLink = document.createElement("a");
    newVendorLink.textContent = i;
    newVendorLink.href = details.resellLinks[i];
    newVendor.appendChild(newVendorLink);
    vendor.appendChild(newVendor);
  }

  const color = document.querySelector(".color");
  color.textContent += details.colorway;

  const [, price] = document.querySelector(".price-tag").children;
  price.textContent = `$${details.retailPrice}`;

  const description = document.querySelector(".PD-PD");
  description.innerHTML += details.description;

  const [buyNowBtn] = document.querySelector(".buy-now").children;
  buyNowBtn.href = details.resellLinks.stockX ?? details.resellLinks.goat ?? '#';

  // display shoes for you may also like
  OtherProducts(details.brand)
}


async function getComments() {
  const id = getUrlQuery();
  const reqUrl = `${API_URL}/products/details?id=${id}`;
  const reqInit = {
    header: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json"
    },
    mode: "cors",
  }

  // make request
  const req = await fetch(reqUrl, reqInit)
    .then(res => res.json())
    .then(res => res.details)
    .catch(e => console.error(e));

  return req.product_comments;
}

getComments();

class ProductComment {
  constructor(user = undefined, content, date = undefined) {
    this.user = user ?? getCurrentUser() ?? "Anonymous";
    this.content = content;
    this.date = date ?? new Date().toDateString();
    this.build = this.build.bind(this)
    this.commentObject = this.commentObject.bind(this)
  }

  /* 
    Comment DOM structure
    div.PC > (div.PC-comment > h6(user), h6(date), ), div.PC-para 
  */

  build() {
    const user = document.createElement("h6");
    user.textContent = this.user.name;

    const date = document.createElement("h6");
    date.textContent = new Date().toDateString();

    const pcComment = document.createElement("div");
    pcComment.classList.add("PC-comment");

    pcComment.append(user, date);

    const pcPara = document.createElement("div");
    pcPara.classList.add("PC-para");
    pcPara.textContent = this.content;

    const pc = document.createElement("div");
    pc.classList.add("PC");

    pc.append(pcComment, pcPara);

    return pc;
  }

  commentObject() {
    return {
      user: this.user,
      content: this.content,
    }
  }
}


async function LoadComments() {
  const comments = await getComments();
  const container = document.querySelector(".comments-container");

  if (!comments || !comments.length) {
    container.textContent = "No comments on this product yet. Be the first to comment!"
    return;
  }

  for (let comment of comments) {
    const { build } = new ProductComment(comment.user, comment.content);
    container.append(build())
  }

}

async function PostComment() {
  const container = document.querySelector(".comments-container");
  const commentContent = document.querySelector(".comment-input");
  const { build, commentObject } = new ProductComment(null, commentContent.value);
  // update locally
  container.append(build());
  commentContent.value = "";

  // update server-side
  const id = getUrlQuery();
  const reqUrl = `${API_URL}/products/comments?id=${id}`;
  const reqInit = {
    method: "PUT",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json"
    },
    mode: "cors",
    body: JSON.stringify({ comment: commentObject() })
  }


  const req = await fetch(reqUrl, reqInit)
    .then(res => res.json())
    .then(res => console.log(res))
    .catch(e => console.error(e));
}

const postButton = document.querySelector(".post-comment");
postButton.onclick = () => PostComment();