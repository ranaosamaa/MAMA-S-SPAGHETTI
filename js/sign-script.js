const cover = document.getElementById("cover");
const moveBtn = document.getElementById("moveCover");
const sign = document.getElementById("sign-up");
const log = document.getElementById("sign-in");
const covItems = document.getElementById("cov-items");
const covtxt = document.querySelector(".cover h4");
const showpass=document.getElementById("show");



let isMoved = false;
moveBtn.addEventListener("click", () => {
    if (!isMoved) {
        cover.style.left = "50%";
        isMoved = true;
        covItems.style.opacity = 0;
        covItems.style.transition = "opacity 250ms";
        sign.style.opacity = 0;
        sign.style.transition = "opacity 250ms";
        setTimeout(() => {
            log.style.opacity = 1;
            log.style.transition = "opacity 250ms";
            moveBtn.innerText = "Sign Up";
            covtxt.innerText = "Create an Account";
            covItems.style.opacity = 1;
            covItems.style.transition = "opacity 250ms";
        }, 500);
    } else {
        cover.style.left = "0";
        isMoved = false;
        covItems.style.opacity = 0;
        covItems.style.transition = "opacity 250ms";
        log.style.opacity = 0;
        log.style.transition = "opacity 250ms";
        setTimeout(() => {
            sign.style.opacity = 1;
            sign.style.transition = "opacity 250ms";
            moveBtn.innerText = "Login";
            covtxt.innerText = "Already have an Account";
            covItems.style.opacity = 1;
            covItems.style.transition = "opacity 250ms";
        }, 500);
    }
});



const showIcons = document.querySelectorAll(".show");
showIcons.forEach(icon => {
  icon.addEventListener("click", () => {
    const input = icon.previousElementSibling;
    if (input.type === "password") {
      input.type = "text";
    } else {
      input.type = "password";
    }
    icon.classList.toggle("fa-eye-slash");
    icon.classList.toggle("fa-eye");
  });
});



const signform=document.getElementById("sign-form");
signform.addEventListener("submit", (e) => {
const pass = document.getElementById("pass").value;
const repass = document.getElementById("repass").value;

function valid(p){
  const regex = /^(?=(.*[A-Z]))(?=(.*[\W_]))(?=.{8,})/;
  return regex.test(p);
}
  if(!valid(pass)){
    e.preventDefault();
    alert("The password doesn't meet the requirments");
  }
  if (pass !== repass) {
    e.preventDefault();
    alert("Passwords do not match. Please try again.");
  }
});


const loginform=document.getElementById("login-form");
loginform.addEventListener("submit", (e) => {
const logpass = document.getElementById("pass-log").value;
if(logpass!=="12345"){
  e.preventDefault();
  alert("Wrong Password, Please try again.");
}
});