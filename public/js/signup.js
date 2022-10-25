// sign up function
async function signupFormHandler(event) {
  event.preventDefault()

  // retrieve the required data value
  const username = document.querySelector("#username-signup").value.trim()
  const email = document.querySelector("#email-signup").value.trim()
  const password = document.querySelector("#password-signup").value.trim()

  // if all data is not null and it will process to send data to user-routes to process create account.
  if (username && email && password) {
    const response = await fetch("/api/users", {
      method: "post",
      body: JSON.stringify({
        username,
        email,
        password,
      }),
      headers: { "Content-Type": "application/json" },
    })
    if (response.ok) {
      document.location.replace("/")
      console.log("success")
    } else {
      alert(response.statusText)
    }
  }
}

document
  .querySelector(".signup-form")
  .addEventListener("submit", signupFormHandler)
