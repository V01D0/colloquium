"use strict";
const usernames = new Array();

const expandNav = function () {
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
  const overlay = document.getElementById("overlay");
  overlay.style.display = "none";
  navBtn.classList.add("fa-bars");
  navBtn.classList.remove("fa-times");
};

const disableButton = function () {
  document.querySelector(".btn__submit").style.background = "#c7c7c7";
  document.querySelector(".btn__submit").style.color = "black";
  document.querySelector(".btn__submit").setAttribute("disabled", "");
};

const loggedOut = function () {
  return (window.location.href = "/auth/login");
};

const enableButton = function () {
  document.querySelector(".btn__submit").removeAttribute("disabled");
  document.querySelector(".btn__submit").style.background = "#0057ff";
  document.querySelector(".btn__submit").style.color = "white";
};

const checkUsernameInDB = function (username) {
  const req = fetch(`/api/v1/checkuser?username=${username}`)
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
  const isEmpty = element.value.trim() !== "" ? false : true;
  console.log(isEmpty);
  if (isEmpty) {
    disableButton();
    element.setCustomValidity("This field can't be empty");
  } else element.setCustomValidity("");
};

const validateBase = function () {
  const inputs = Array.from(document.querySelectorAll(".required"));
  const isValid = inputs.every((input) => input.checkValidity());
  console.log(isValid);
  if (isValid) enableButton();
  else disableButton();
};

const generateUserString = function (element, checked = false, last = false) {
  const userString = `<label class="user">${element}<input class="user__checkbox" type="checkbox" ${
    checked ? `checked` : ``
  } id="" onclick="checkUser(this)" name="" value="${element}"></label> ${
    last ? "" : `<hr>`
  }`;
  return userString;
};

const getLikeUsers = function (friend) {
  const autocompleteLabel = document.getElementById("autoComplete-label");
  const addedUsers = document.querySelector(".users__added");
  // req.open("GET", `/api/v1/blogusercheck?friend=${friend}`);
  if (friend.trim() !== "") {
    const friends = fetch(`/api/v1/blogusercheck?friend=${friend}`)
      .then((response) => response.json())
      .then((data) => {
        const usersLike = data["users"];
        if (document.querySelector(".user__list") === null) {
          const users = document.createElement("div");
          users.classList.add("user__list");
          autocompleteLabel.insertAdjacentElement("afterend", users);
          users.insertAdjacentElement("afterend", addedUsers);
        }
        if (usersLike.length === 0) {
          const users = document.querySelector(".user__list");
          users.innerHTML = `NO MATCHES FOUND`;
          users.style.fontWeight = 300;
          users.style.border = "none";
        }
        usersLike.forEach((element, index, arr) => {
          const users = document.querySelector(".user__list");
          if (users != null) {
            users.innerHTML = "";
            users.style.fontWeight = "inherit";
          }
          if (index === arr.length - 1) {
            users.innerHTML += usernames.includes(element)
              ? generateUserString(element, true, true)
              : generateUserString(element, false, true);
          } else {
            const res = usernames.includes(element) ? true : false;
            users.innerHTML += generateUserString(element, res, false);
          }
        });
      });
    if (document.querySelector(".user__list") != null) {
      document.querySelector(".user__list").style.border = "1px solid black";
    }
  } else if (document.querySelector(".user__list") != null) {
    document.querySelector(".user__list").style.border = "none";
    document.querySelector(".user__list").innerHTML = "";
  }
};

const checkBlog = function (blogName) {
  if (blogName.length >= 3) {
    const req = fetch(`/api/v1/blogcheck?blog=${blogName}`)
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

const checkUser = function (checkbox) {
  const addedUsers = document.querySelector(".users__added");
  if (checkbox.checked) usernames.push(checkbox.value);
  else {
    const index = usernames.indexOf(checkbox.value);
    usernames.splice(index, 1);
  }
  addedUsers.value = "";
  usernames.forEach((element, index, arr) => {
    if (arr.length !== 1) {
      addedUsers.value += index !== arr.length - 1 ? `${element}|` : element;
    } else {
      addedUsers.value = element;
    }
  });
};
