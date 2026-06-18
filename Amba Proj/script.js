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


window.addEventListener("load", () => {

    setTimeout(() => {

        const loader = document.getElementById("loader");

        loader.style.opacity = "0";

        setTimeout(() => {

            loader.style.display = "none";

        }, 1000);

    }, 2000);

});


const counters =
document.querySelectorAll(".counter");

const counterObserver =
new IntersectionObserver((entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

const counter = entry.target;

const target =
+counter.getAttribute("data-target");

let count = 0;

const updateCounter = ()=>{

const increment =
target / 100;

if(count < target){

count += increment;

counter.innerText =
Math.ceil(count);

setTimeout(updateCounter,20);

}else{

counter.innerText =
target + "+";

}

};

updateCounter();

counterObserver.unobserve(counter);

}

});

});

counters.forEach(counter=>{

counterObserver.observe(counter);

});


const galleryImages =
document.querySelectorAll(".gallery-grid img");

const lightbox =
document.getElementById("lightbox");

const lightboxImage =
document.getElementById("lightboxImage");

const closeLightbox =
document.getElementById("closeLightbox");

galleryImages.forEach(image=>{

image.addEventListener("click",()=>{

lightbox.style.display = "flex";

lightboxImage.src = image.src;

});

});

closeLightbox.addEventListener("click",()=>{

lightbox.style.display = "none";

});

lightbox.addEventListener("click",(e)=>{

if(e.target === lightbox){

lightbox.style.display = "none";

}

});


const form = 
document.getElementById("newsletter-form");

const message = 
document.getElementById("message");

form.addEventListener("submit", (e)=>{
    e.preventDefault();
    message.textContent = "Thank you for subscribing to our newsletter!";
    message.style.marginTop = "15px";
    form.reset();
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


const footer =
document.querySelector("footer p:last-child");

footer.innerHTML =
`© ${new Date().getFullYear()} Amba Guards Limited RC: 1791459. All Rights Reserved.`;