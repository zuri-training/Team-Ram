import { API_URL } from "./exports.js";

const signUpForm = document.getElementById("sign-up");
const messageEl = document.getElementById("message");

signUpForm.onsubmit = (e) => {
  // prevent the default submit behaviour
  e.preventDefault()
  const { value: name } = document.getElementById("name");
  const { value: email } = document.getElementById("email");
  const { value: password } = document.getElementById("psw");
  const { value: confirmPassword } = document.getElementById("psw-repeat");

  if (password !== confirmPassword) {
    return showConsistencyError();
  }

  const user = { name, email, password };

  SignUp(user)
    // redirect on success
    .then((res) => {
      if (!res.success) throw new Error(res.message);
      alert(`Signed Up as ${res.user.name}`)
      location.pathname = "/";
    })
    // show error on failure
    .catch(e => {
      console.error(e);
      showEmailError();
    })
}

function showConsistencyError() {
  messageEl.textContent = "Passwords don't match";
  messageEl.style.color = "red";
}

async function SignUp(data) {
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
  const reqUrl = `${API_URL}/auth/sign_up`;
  const req = await fetch(reqUrl, reqInit)
    .then(res => res.json())
    .catch(e => console.error(e));
  return req;
}

function showEmailError() {
  messageEl.textContent = "Email is already in use";
  messageEl.style.color = "red";
}