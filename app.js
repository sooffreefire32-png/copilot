const form = document.getElementById("form");
const output = document.getElementById("output");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const message = document.getElementById("message").value;
  const image = document.getElementById("image").files[0];

  const formData = new FormData();
  formData.append("message", message);
  formData.append("image", image);

  const res = await fetch("http://localhost:3000/api/debug", {
    method: "POST",
    body: formData
  });

  const data = await res.json();
  output.innerText = JSON.stringify(data, null, 2);
});