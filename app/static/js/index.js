"use strict";
const usernames = new Array();
const Blogs = new Array();

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
    });
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
  checked = false,
  last = false,
  type = "",
  desc = ""
) {
  let userString = `<label class="user">${element}<input class="user__checkbox" type="checkbox" ${
    checked ? `checked` : ``
  } id="" onclick="checkUser(this,${type})" name="" value="${element}"></label>`;
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
    if (friend.length < 3) {
      users.innerHTML = `NEED AT LEAST 3 CHARACTERS`;
      users.style.fontWeight = 300;
      users.style.border = "none";
    } else {
      const friends = fetch(`/api/v1/users/like?friend=${friend}`)
        .then((response) => response.json())
        .then((data) => {
          const usersLike = data["users"];
          if (usersLike.length === 0) {
            users.innerHTML = `NO MATCHES FOUND`;
            users.style.fontWeight = 300;
            users.style.border = "none";
          }
          usersLike.forEach((element, index, arr) => {
            users.innerHTML = "";
            users.style.fontWeight = "inherit";
            if (index === arr.length - 1) {
              users.innerHTML += usernames.includes(element)
                ? generateUserString(element, true, true, "usernames")
                : generateUserString(element, false, true, "usernames");
            } else {
              const res = usernames.includes(element) ? true : false;
              users.innerHTML += generateUserString(
                element,
                res,
                false,
                "usernames"
              );
            }
          });
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
    if (blogName.length < 3) {
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
            Object.entries(blogsLike).forEach(([key, value], index) => {
              blogs.style.marginBottom = "1rem";
              blogs.style.fontWeight = "inherit";
              if (index === Object.keys(blogsLike).length - 1) {
                blogs.innerHTML += Blogs.includes(key)
                  ? generateUserString(key, true, true, "Blogs", value)
                  : generateUserString(key, false, true, "Blogs", value);
              } else {
                const res = Blogs.includes(key) ? true : false;
                blogs.innerHTML += generateUserString(
                  key,
                  res,
                  false,
                  "Blogs",
                  value
                );
              }
            });
          }
        });
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
  if (blogName.length >= 3) {
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
      });
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
  }
};
