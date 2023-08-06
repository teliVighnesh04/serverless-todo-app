const apiUrl = "https://84wa9bme79.execute-api.ap-south-1.amazonaws.com/prod";

console.log(window.location.pathname);

if (window.location.pathname == "/") {
  const newTodo = document.querySelector(".add-todo");
  newTodo.addEventListener("click", function (event) {
    event.preventDefault();
    console.log(event);
    const addTodoTitleInput = document.querySelector(".add-todo-title");
    const addTodoDescInput = document.querySelector(".add-todo-desc");
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: addTodoTitleInput.value,
        desc: addTodoDescInput.value,
      }),
    })
      .then((res) => res.json())
      .then((response) => (window.location = "/"))
      .catch((e) => console.log(e));
  });
}

if (window.location.pathname == "/update.html") {
  let titleInput = document.querySelector(".update-todo-title");
  let descriptionInput = document.querySelector(".update-todo-desc");
  titleInput.value = localStorage.getItem("title");
  descriptionInput.value = localStorage.getItem("description");

  sno = localStorage.getItem("sno");
  const updateBtn = document.querySelector(".update-btn");
  updateBtn.addEventListener("click", function (e) {
    e.preventDefault();
    fetch(`${apiUrl}/update/?sno=${sno}`, {
      method: "PUT",
      body: JSON.stringify({
        title: titleInput.value,
        desc: descriptionInput.value,
      }),
    })
      .then((res) => res.json())
      .then((response) => (window.location = "/"))
      .catch((e) => console.log(e));
  });
}

function addRow(index, sno, title, description, dateCreated, actions) {
  // get the table element
  const table = document.querySelector(".table");

  // create row
  const row = table.insertRow(-1);

  // create table cells
  let c1 = row.insertCell(0);
  let c2 = row.insertCell(1);
  let c3 = row.insertCell(2);
  let c4 = row.insertCell(3);
  let c5 = row.insertCell(4);
  let c6 = row.insertCell(5);

  // add inner text
  c1.innerText = index;
  c2.innerText = title;
  c3.innerText = description;
  c4.innerText = dateCreated;

  let updateLink = document.createElement("a");
  let deleteLink = document.createElement("a");
  let updateText = document.createTextNode("Update");
  let deleteText = document.createTextNode("Delete");

  updateLink.appendChild(updateText);
  deleteLink.appendChild(deleteText);
  updateLink.type = "button";
  deleteLink.type = "button";
  //   updateLink.href = `/update.html`;
  //   deleteLink.href = `/delete.html`;

  updateLink.addEventListener("click", function (event) {
    localStorage.setItem("sno", sno);
    localStorage.setItem("title", title);
    localStorage.setItem("description", description);
    event.target.href = `/update.html`;
  });

  deleteLink.addEventListener("click", function (event) {
    fetch(`${apiUrl}/delete?sno=${sno}`, {
      method: "DELETE",
    })
      .then((res) => res.json)
      .then((response) => (window.location = "/"))
      .catch((e) => console.log(e));
  });

  buttonClasses = ["btn", "btn-danger", "btn-sm", "mx-1"];

  for (let className of buttonClasses) {
    updateLink.classList.add(className);
    deleteLink.classList.add(className);
  }

  c5.appendChild(updateLink);
  c6.appendChild(deleteLink);
}

todos = fetch(apiUrl)
  .then((res) => res.json())
  .then((todos) => {
    notodo = document.querySelector(".todo-length");
    if (todos.length === 0) {
      notodo.classList.add("todo-length-visible");
    } else if (notodo !== null) {
      notodo.classList.add("todo-length-invisible");
    }
    for (const [index, todo] of todos.entries()) {
      addRow(
        index + 1,
        todo.Sno,
        todo.Title,
        todo.Description,
        todo.Created_on
      );
    }
  })
  .catch((e) => console.log(e));
