// delete the post function
async function deleteFormHandler(event) {
  event.preventDefault()

  // retrieve the data from query
  const post_id = window.location.toString().split("/")[
    window.location.toString().split("/").length - 1
  ]

  // post data to the delete-routes to process to delete the post
  const response = await fetch(`/api/posts/${post_id}`, {
    method: "DELETE",
  })
  if (response.ok) {
    document.location.replace("/dashboard")
  } else {
    alert(response.statusText)
  }
}

document
  .querySelector(".delete-post")
  .addEventListener("click", deleteFormHandler)
