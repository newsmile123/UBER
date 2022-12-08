window.addEventListener("DOMContentLoaded", () => {
  const menu = document.querySelector(".menu"),
    menuItem = document.querySelectorAll(".menu_item"),
    hamburger = document.querySelector(".hamburger");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("hamburger_active");
    menu.classList.toggle("menu_active");
  });

  menuItem.forEach((item) => {
    item.addEventListener("click", () => {
      hamburger.classList.toggle("hamburger_active");
      menu.classList.toggle("menu_active");
    });
  });
});

const test = "test";

const test1 = "test";

<<<<<<< HEAD
const ssdnewBranch32 = "branch test 23";
=======
>>>>>>> b511461... new commit
const newBranch = "branch test 1";

const newBranch2 = "branch test 2";
const testwerwer = "";
<<<<<<< HEAD
const newtestetwerew = "";
=======
>>>>>>> develop
const newBranch32 = "branch test 23";

const ssdnewBranch32 = "branch test 23";
