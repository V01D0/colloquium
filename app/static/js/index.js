"use strict";
const usernames = new Array();
const Blogs = new Array();
const imageURLs = new Array();
// const uploadProgress = new Array();

const handleErrors = function (err = "An error occurred") {
  const notyf = new Notyf();
  notyf.error(err);
};

const expandNav = function () {
  // Navigation
  const overlay = document.getElementById("overlay");
  const navBtn = document.getElementById("navBtn");
  const navList = document.querySelector("ul.nav-small");
  if (overlay.style.display == "block") {
    hideNav();
  } else {
    navList.style.position = "absolute";
    navList.style.top = "50%";
    navList.style.left = "50%";
    navList.style.transform = "translate(-50%,-50%)";
    overlay.style.display = "block";
    navBtn.classList.remove("fa-bars");
    navBtn.classList.add("fa-times");
  }
};

const hideNav = function () {
  // Navigation
  const overlay = document.getElementById("overlay");
  overlay.style.display = "none";
  navBtn.classList.add("fa-bars");
  navBtn.classList.remove("fa-times");
};

const disableButton = function () {
  // Function that disables a button and adds styles to it
  const submit = document.querySelector(".btn__submit");
  submit.style.background = "#c7c7c7";
  submit.style.color = "black";
  submit.setAttribute("disabled", "");
};

const loggedOut = function () {
  return (window.location.href = "/auth/login");
};

const enableButton = function () {
  // Function that enables a button and adds styles to it
  const submit = document.querySelector(".btn__submit");
  submit.removeAttribute("disabled");
  submit.style.background = "#0057ff";
  submit.style.color = "white";
};

const checkUsernameInDB = function (username) {
  // Function to check whether username is available
  const req = fetch(`/api/v1/user/check?username=${username}`)
    .then((response) => response.json())
    .then((data) => {
      if (data["auth"] === false) loggedOut();
      if (!data["status"]) {
        document.getElementById("username").setCustomValidity("Username taken");
        disableButton();
      } else {
        document.getElementById("username").setCustomValidity("");
      }
    })
    .catch((error) => handleErrors(error));
};

const validateSignup = function () {
  // Function to validate Sign-Up page
  const inputs = Array.from(document.querySelectorAll("input"));
  const isValid = inputs.every((element) => element.checkValidity());
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  if (isValid && confirmPassword === password) {
    enableButton();
  } else {
    disableButton();
  }
};

const checkEmpty = function (element) {
  // Check if this element's value is empty
  const isEmpty = element.value.trim() !== "" ? false : true;
  if (isEmpty) {
    disableButton();
    element.setCustomValidity("This field can't be empty");
  } else element.setCustomValidity("");
};

const validateBase = function (blogs = false) {
  // Validate all inputs with class "required"
  const inputs = Array.from(document.querySelectorAll(".required"));
  const isValid = inputs.every((input) => input.checkValidity());
  if (isValid && !blogs) enableButton();
  // if all inputs are valid and blogs var is false (default) - enable button
  else if (isValid && blogs === true) {
    if (Blogs.length < 1) disableButton();
    // If Blogs array is empty - disable button
    else enableButton(); // else - enable button
  } else disableButton();
};

const generateUserString = function (
  element,
  value,
  checked = false,
  last = false,
  type = "",
  desc = ""
) {
  let userString = `<label class="user">${element}<input class="user__checkbox" type="checkbox" ${
    checked ? `checked` : ``
  } id="" onclick="checkUser(this,${type})" name="" value="${value}"></label>`;
  if (type === "Blogs") {
    userString += `<p class="blog__description">${desc}</p>`;
  }
  userString += `${last ? "" : `<hr>`}`;
  // LEAVE CLASS NAMES ALONE, THEY CAN BE REUSED
  // type IS ONLY REQUIRED FOR checkUser()
  return userString;
};

const getLikeUsers = function (friend) {
  // Function to get usernames similar to friend%
  const autocompleteLabel = document.getElementById("autoComplete-label");
  const addedUsers = document.querySelector(".users__added");
  if (document.querySelector(".user__list") === null) {
    const users = document.createElement("div");
    users.classList.add("user__list");
    autocompleteLabel.insertAdjacentElement("afterend", users);
    users.insertAdjacentElement("afterend", addedUsers);
  }
  const users = document.querySelector(".user__list");
  if (friend.trim() !== "") {
    if (friend.trim().length < 3) {
      users.innerHTML = `NEED AT LEAST 3 CHARACTERS`;
      users.style.fontWeight = 300;
      users.style.border = "none";
    } else {
      const friends = fetch(`/api/v1/users/like?friend=${friend}`)
        .then((response) => response.json())
        .then((data) => {
          const usersLike = data;
          users.innerHTML = "";
          console.log(Object.keys(usersLike).length);
          if (Object.keys(usersLike).length === 0) {
            users.innerHTML = `NO MATCHES FOUND`;
            users.style.fontWeight = 300;
            users.style.border = "none";
          }
          Object.entries(usersLike).forEach(([, value], index, arr) => {
            console.log(value);
            users.style.fontWeight = "inherit";
            if (index === arr.length - 1) {
              console.log(value["id"] + value["username"]);
              users.innerHTML += usernames.includes(value["id"])
                ? generateUserString(
                    value["username"],
                    value["id"],
                    true,
                    true,
                    "usernames"
                  )
                : generateUserString(
                    value["username"],
                    value["id"],
                    false,
                    true,
                    "usernames"
                  );
            } else {
              const res = usernames.includes(value["id"]) ? true : false;
              console.log(
                generateUserString(
                  value["username"],
                  value["id"],
                  res,
                  false,
                  "usernames"
                )
              );
              users.innerHTML += generateUserString(
                value["username"],
                value["id"],
                res,
                false,
                "usernames"
              );
            }
          });
        })
        .catch((error) => {
          console.log(error);
          handleErrors("An error occurred");
        });
      if (users != null) {
        users.style.border = "1px solid black";
      }
    }
  } else if (document.querySelector(".user__list") != null) {
    document.querySelector(".user__list").style.border = "none";
    document.querySelector(".user__list").innerHTML = "";
  }
};

const getLikeBlogs = function (blogName) {
  // Function to get blogs similar to %blogName%
  const blogsLabel = document.querySelector(".blogs__label");
  const addedBlogs = document.querySelector(".users__added");
  if (document.querySelector(".user__list") === null) {
    const blogs = document.createElement("div");
    blogs.classList.add("user__list");
    blogsLabel.insertAdjacentElement("afterend", blogs);
    blogs.insertAdjacentElement("afterend", addedBlogs);
  }
  const blogs = document.querySelector(".user__list");
  if (blogName.trim() !== "") {
    if (blogName.trim().length < 3) {
      blogs.innerHTML = `NEED AT LEAST 3 CHARACTERS`;
      blogs.style.fontWeight = 300;
      blogs.style.border = "none";
    } else {
      const blog = fetch(`/api/v1/blogs/like?name=${blogName}`)
        .then((response) => response.json())
        .then((data) => {
          const blogsLike = data["blogs"];
          if (Object.keys(blogsLike).length === 0) {
            blogs.innerHTML = `NO MATCHES FOUND`;
            blogs.style.fontWeight = 300;
            blogs.style.border = "none";
          } else {
            blogs.innerHTML = "";
            Object.entries(blogsLike).forEach(([, value], index) => {
              console.log(value);
              blogs.style.marginBottom = "1rem";
              blogs.style.fontWeight = "inherit";
              if (index === Object.keys(blogsLike).length - 1) {
                blogs.innerHTML += Blogs.includes(value["id"])
                  ? generateUserString(
                      value["name"],
                      value["id"],
                      true,
                      true,
                      "Blogs",
                      value["desc"]
                    )
                  : generateUserString(
                      value["name"],
                      value["id"],
                      false,
                      true,
                      "Blogs",
                      value["desc"]
                    );
              } else {
                const res = Blogs.includes(value["id"]) ? true : false;
                blogs.innerHTML += generateUserString(
                  value["name"],
                  value["id"],
                  res,
                  false,
                  "Blogs",
                  value["desc"]
                );
              }
            });
          }
        })
        .catch((error) => handleErrors(error));
      if (blogs != null) {
        blogs.style.border = "1px solid black";
      }
    }
  } else if (document.querySelector(".user__list") != null) {
    document.querySelector(".user__list").style.border = "none";
    document.querySelector(".user__list").innerHTML = "";
  }
};

const checkBlog = function (blogName) {
  // Function to check if blogName is available
  if (blogName.trim().length >= 3) {
    const req = fetch(`/api/v1/blog/check?blog=${blogName}`)
      .then((response) => response.json())
      .then((data) => {
        if (data["auth"] === false) loggedOut();
        if (data["status"] === false) {
          document
            .getElementById("blogname")
            .setCustomValidity("That name is taken");
        } else {
          document.getElementById("blogname").setCustomValidity("");
        }
      })
      .catch((error) => handleErrors(error));
  }
};

const checkUser = function (checkbox, type) {
  // Function to handle checkbox related actions
  const addedUsers = document.querySelector(".users__added");
  if (checkbox.checked) type.push(checkbox.value);
  else {
    const index = type.indexOf(checkbox.value);
    type.splice(index, 1);
  }
  addedUsers.value = "";
  type.forEach((element, index, arr) => {
    if (arr.length !== 1) {
      addedUsers.value += index !== arr.length - 1 ? `${element}|` : element;
    } else {
      addedUsers.value = element;
    }
  });
};

const fillPreview = function () {
  const preview = document.querySelector(".post__preview");
  preview.innerHTML = "";
  preview.style.display = "block";
  // /^\[!image\(\w+\.(jpe?g|png)\)]$/gmi
  const imageRegex = /^\[!image\(\w+\.(?:jpe?g|png|gif)\)]$/gim;
  const title = document.getElementById("title"); // HTML Input element where user types
  const body = document.getElementById("body"); // Textarea where user types
  console.log(body.value);
  console.log(body.value.replace(/\n+$/, ""));
  // console.log(body.value);
  const prevTitle = document.createElement("h1"); // Preview div title
  prevTitle.classList.add("preview__title");
  prevTitle.contentEditable = "true";
  const prevBody = document.createElement("div"); // Preview div body
  prevBody.contentEditable = "true";
  prevBody.style.marginTop = "1rem";
  prevBody.classList.add("preview__body");

  let previewBodyText = body.value; // All text inside the textarea
  prevTitle.innerText = title.value;
  preview.appendChild(prevTitle);
  preview.appendChild(prevBody);
  console.log(body.value);
  body.value
    .replace(/\n+$/, "")
    .replace(/\r\n|\r|\n/gi, "<br/>")
    .split("<br/>")
    .forEach((element) => {
      // console.log(element);
      if (element.trim() !== "") {
        const words = element.split(/\s+/);
        // console.log(words);
        const tag = document.createElement("p");
        tag.innerText = element;
        prevBody.append(tag);
        const match = words.find((word) => word.match(imageRegex));
        if (match) {
          const path = element
            .match(/\(.*\)/gm)
            .toString()
            .slice(1, -1);
          const img = document.createElement("img");
          console.log(img);
          img.src = `/static/images/uploads/${path}`;
          img.classList.add("post__preview--image");
          tag.insertAdjacentElement("afterend", img);
          img.onload = function () {
            const [width, height] = [img.width, img.height];
          };
        }
      } else {
        prevBody.innerHTML += "<br/>";
      }
    });
  console.log(prevBody.innerHTML);
};

const switchTabs = function () {
  // Function to swtitch between tabs in a tabbed component
  const caller = event.target;
  const activeClass = "tab__item--active";
  const tabs = Array.from(document.querySelectorAll(".tab__item"));
  const index = tabs.findIndex((element) =>
    element.classList.contains(activeClass)
  );

  if (caller !== tabs[index]) {
    tabs[index].classList.remove(activeClass);
    caller.classList.add(activeClass);
    if (caller.id === "preview") {
      const form = document.querySelector("form");
      form.style.display = "none";
      fillPreview();
    } else if (caller.id === "review") {
      const preview = document.querySelector(".post__preview");
      const prevBody = document.querySelector(".preview__body");
      const prevTitle = document.querySelector(".preview__title");
      const title = document.getElementById("title");
      const body = document.getElementById("body");
      const tarea = document.createElement("textarea");
      console.log(prevBody.innerText);
      if (prevBody.innerText.trim() === "") {
        prevBody.innerText = "";
      }
      tarea.innerHTML = prevBody.innerHTML
        .replace(/<\/p><p>/gm, "\n")
        .replace(/\n+$/, "")
        .replace(/<img.*?>/gi, "")
        .replace(/<br\s*[\/]?>/gi, "\n\n")
        .replace(/<\/?p[^>]*>/g, "");
      body.value = tarea.value;
      title.value = prevTitle.innerText;
      preview.style.display = "none";
      const form = document.querySelector("form");
      form.style.display = "block";
    }
  }
};

const openInput = function () {
  const input = document.querySelector(".filedrag");
  input.click();
};

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const uploadFile = async function (file) {
  const f = new FormData();
  f.append("file", file);
  const upload = fetch("/api/v1/upload/file", {
    method: "POST",
    body: f,
  })
    .then((response) => response.json())
    .then((result) => {
      const preview = document.querySelector(".post__preview");
      const prevBody = document.querySelector(".preview__body");
      const prevTitle = document.querySelector(".preview__title");
      const title = document.getElementById("title");
      const body = document.getElementById("body");
      const notyf = new Notyf();
      if (result["status"] === true) {
        notyf.success("Success!");
        imageURLs.push(result["name"]);
        console.log(imageURLs);
        body.value += `\n[!image(${result["name"]})]`;
      } else {
        notyf.error(result["reason"]);
      }
    })
    .catch((error) => handleErrors(error));
};

const preventDefaults = function (e) {
  e.preventDefault();
};

const handleDrop = function (e) {
  // Function to handle file drop
  const dt = e.dataTransfer;
  const files = dt.files;
  handleFiles(files);
};

const handleFiles = function (files) {
  // Handle files on client side for good UX
  files = [...files];
  console.log(files);
  const valid =
    files.every((file) => {
      return file.size / 1024 / 1024 < 2;
    }) &&
    files.every((file) => {
      return (
        file.type.split("/")[1] === "png" ||
        file.type.split("/")[1] === "jpeg" ||
        file.type.split("/")[1] === "gif"
      );
    });
  console.log(valid);
  if (!valid) {
    return handleErrors("One or more files were too large (MAX - 2MB)");
    // return handleErrors("Max file size is 2MB");
  }
  // initializeProgress(files.length);
  files.forEach(uploadFile);
};
