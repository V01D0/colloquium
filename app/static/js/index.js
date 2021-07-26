"use strict";
const usernames = new Array();

const expandNav = function () {
  const overlay = document.getElementById("overlay");
  const navBtn = document.getElementById("navBtn");
  if (overlay.style.display == "block") {
    hideNav();
  } else {
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
  document.querySelector(".btn__submit").style.background = "grey";
  document.querySelector(".btn__submit").setAttribute("disabled", "");
};

const enableButton = function () {
  document.querySelector(".btn__submit").removeAttribute("disabled");
  document.querySelector(".btn__submit").style.background = "#0057ff";
};

const checkUsernameInDB = function (username) {
  const req = new XMLHttpRequest();
  req.open("GET", `/api/v1/checkuser?username=${username}`);
  req.onreadystatechange = function () {
    if (req.readyState === 4) {
      const response = JSON.parse(this.response);
      if (response["status"] == false) {
        document.getElementById("username").setCustomValidity("Username taken");
        disableButton();
      } else {
        document.getElementById("username").setCustomValidity("");
      }
    }
  };
  req.send();
};

const validate = function () {
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

const generateUserString = function (element, checked = false, last = false) {
  const userString = `<label class="user">${element}<input class="user__checkbox" type="checkbox" ${
    checked ? `checked` : ``
  } id="" onclick="checkUser(this)" name="" value="${element}"></label> ${
    last ? "" : `<hr>`
  }`;
  return userString;
};

const getLikeUsers = function (friend) {
  const req = new XMLHttpRequest();
  const autocompleteLabel = document.getElementById("autoComplete-label");
  const addedUsers = document.querySelector(".users__added");
  req.open("GET", `/api/v1/blogusercheck?friend=${friend}`);
  req.onreadystatechange = function () {
    if (req.readyState === 4) {
      if (document.querySelector(".user__list") === null) {
        const users = document.createElement("div");
        users.classList.add("user__list");
        autocompleteLabel.insertAdjacentElement("afterend", users);
        users.insertAdjacentElement("afterend", addedUsers);
      }
      const users = document.querySelector(".user__list");
      const response = JSON.parse(this.response);
      if (users != null) {
        users.innerHTML = "";
        users.style.fontWeight = "inherit";
      }
      const usersLike = response["users"];
      usersLike.forEach((element, index, arr) => {
        if (index === arr.length - 1) {
          users.innerHTML += usernames.includes(element)
            ? generateUserString(element, true, true)
            : generateUserString(element, false, true);
        } else {
          const res = usernames.includes(element) ? true : false;
          users.innerHTML += generateUserString(element, res, false);
        }
      });
      if (usersLike.length === 0) {
        users.innerHTML = `NO MATCHES FOUND`;
        users.style.fontWeight = 300;
        users.style.border = "none";
      }
    }
  };
  if (friend.trim() !== "") {
    req.send();
    if (document.querySelector(".user__list") != null) {
      document.querySelector(".user__list").style.border = "1px solid black";
    }
  } else if (document.querySelector(".user__list") != null) {
    document.querySelector(".user__list").style.border = "none";
    document.querySelector(".user__list").innerHTML = "";
  }
};

const checkUser = function (checkbox) {
  const addedUsers = document.querySelector(".users__added");
  if (checkbox.checked) usernames.push(checkbox.value);
  else {
    const index = usernames.indexOf(checkbox.value);
    usernames.splice(checkbox.value, 1);
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
