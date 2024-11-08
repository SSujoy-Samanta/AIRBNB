let password=document.querySelector("#password");
let eyeOpen =document.querySelector(".eye-1");
let eyeClose =document.querySelector(".eye-2");
let eye=document.querySelector(".eye");

eye.addEventListener("click",()=>{
    eyeOpen.classList.toggle("eye-hide");
    password.type = password.type === "password" ? "text" : "password"; // Toggle password visibility
    eyeClose.classList.toggle("eye-hide");
});
