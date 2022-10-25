// edit-post function
async function editFormHandler(event) {
  event.preventDefault()

  // retrieve the data values that user wishes to change.
  const title = document.querySelector('input[name="post-title"]').value.trim()
  const post_content = document
    .querySelector('textarea[name="post-content"]')
    .value.trim()

  const post_id = window.location.toString().split("/")[
    window.location.toString().split("/").length - 1
  ]

  // send the data to edit the post
  const response = await fetch(`/api/posts/${post_id}`, {
    method: "PUT",
    body: JSON.stringify({
      title,
      post_content,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (response.ok) {
    document.location.replace("/dashboard")
  } else {
    alert(response.statusText)
  }
}

document.querySelector(".edit-form").addEventListener("submit", editFormHandler)
