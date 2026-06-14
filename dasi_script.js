function ToHome(){
    if(window.location.pathname == "/"){
        window.scrollTo(0, 0);
    }else{
        window.location.href = "/";
    }
}

function ToGames(){
    if(window.location.pathname == "/"){
        window.scrollTo(0, document.querySelector(".published-game").offsetTop - 50);
    }else{
        window.location.href = "/";
    }
}

function ToAboutUs(){
    if(window.location.pathname == "/"){
        window.scrollTo(0, document.querySelector(".about-us").offsetTop - 100);
    }else{
        window.location.href = "/";
    }
}

function ToCareer(){
    if(window.location.pathname == "/"){
        window.scrollTo(0, document.querySelector(".applications").offsetTop - 200);
    }else{
        window.location.href = "/";
    }
}

function ToContactUs(){
    if(window.location.pathname == "/"){
        window.scrollTo(0, document.querySelector(".contact-us").offsetTop - 200);
    }else{
        window.location.href = "/";
    }
}

function SelectApplication(position){
    const formattedPosition = position.replace(/\s+/g, '-').toLowerCase();
    localStorage.setItem('selectedPosition', position);
    window.open(`application-${formattedPosition}`, '_blank');
}

function ToggleHeaderMenu(){
    var burgerMenu = document.querySelector(".header-nav");
    var button = document.getElementById("header-burger-icon");

    if (burgerMenu.style.display === "none" || burgerMenu.style.display === "") {
        burgerMenu.style.display = "flex";
        button.classList.remove("fa-bars");
        button.classList.add("fa-x");
    } else {
        burgerMenu.style.display = "none";
        button.classList.remove("fa-x");
        button.classList.add("fa-bars");
    }
}

function checkForm() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    const isEmailValid = validateEmail(email);
    const isFormValid = name && isEmailValid && subject && message;

    document.getElementById('sendButton').disabled = !isFormValid;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}