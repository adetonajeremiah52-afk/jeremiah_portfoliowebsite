const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");

hamburger.addEventListener("click", () => {

    navLinks.classList.toggle("active");

    if(navLinks.classList.contains("active")){
        hamburger.innerHTML =
        '<i class="fas fa-times"></i>';
    }else{
        hamburger.innerHTML =
        '<i class="fas fa-bars"></i>';
    }

});

const links = document.querySelectorAll(".nav-links a");

links.forEach(link => {

    link.addEventListener("click", () => {

        navLinks.classList.remove("active");
        hamburger.innerHTML = "☰";

    });

});

var typed = new Typed("#typing", {

    strings: [
        "Software Developer",
        "Frontend Developer",
        "Backend Developer"
    ],

    typeSpeed: 70,
    backSpeed: 50,
    loop: true

});


const scrollTopBtn =
document.getElementById("scrollTopBtn");
window.addEventListener("scroll",()=>{
    if(window.pageYOffset > 300){
        scrollTopBtn.style.display = "block";
    }else{
        scrollTopBtn.style.display = "none";
    }
});

scrollTopBtn.addEventListener("click",()=>{
    window.scrollTo({
        top:0,
        behavior:"smooth"
    });
});


const btn = document.getElementById('button');

document.getElementById('form')
 .addEventListener('submit', function(event) {
   event.preventDefault();

   btn.value = 'Sending...';

   const serviceID = 'default_service';
   const templateID = 'template_c91dfpl';

   emailjs.sendForm(serviceID, templateID, this)
    .then(() => {
      btn.value = 'Send Email';
      alert('Sent!');
    }, (err) => {
      btn.value = 'Send Email';
      alert(JSON.stringify(err));
    });
});