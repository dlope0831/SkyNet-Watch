// add comment function
async function commentFormHandler(event) {
  event.preventDefault()

  // retrieve the data values from input comment form
  const comment_text = document
    .querySelector('textarea[name="comment-body"]')
    .value.trim()

  const post_id = window.location.toString().split("/")[
    window.location.toString().split("/").length - 1
  ]

  // post data to the comment-routes
  if (comment_text) {
    const response = await fetch("/api/comments", {
      method: "POST",
      body: JSON.stringify({
        post_id,
        comment_text,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (response.ok) {
      document.location.reload()
    } else {
      alert(response.statusText)
    }
  }
}

document
  .querySelector(".comment-form")
  .addEventListener("submit", commentFormHandler)
