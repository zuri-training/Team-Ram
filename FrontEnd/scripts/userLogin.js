import { API_URL, setCurrentUser } from "./exports.js";

const loginForm = document.getElementById("login-form");

loginForm.onsubmit = (e) => {
  // prevent default form behaviour
  e.preventDefault();
  // destructure the value property from the input elements
  const { value: email } = document.getElementById("email");
  const { value: password } = document.getElementById("psw");

  // form the user object for the backend
  const user = { email, password };
  Login(user)
    // redirect on success
    .then((res) => {
      if (!res.success) {
        throw new Error(res.message);
      }
      alert(`Logged in as ${res.user.name}`)
      setCurrentUser(res.user);
      location.pathname = "/";
    })
    // show error on failure
    .catch((e) => {
      console.error(e);
      showLoginError();
    })
}

// send api request
async function Login(data) {
  const reqInit = {
    method: "POST",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json"
    },
    mode: "cors",
    body: JSON.stringify({ user: data })
  }
  // api endpoint for logins
  const reqUrl = `${API_URL}/auth/login`;
  const req = await fetch(reqUrl, reqInit).then(res => res.json()).catch(e => console.error(e));
  return req;
}


// show error to user
function showLoginError() {
  const messageEl = document.getElementById("message");
  if (messageEl) {
    messageEl.textContent = "Email or Password is incorrect";
    messageEl.style.color = "red";
  }
}