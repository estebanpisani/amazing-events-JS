let sentAlert = document.getElementById("sent-alert");
let contactForm = document.getElementById("contact-form");
let inputs = document.querySelectorAll("input[type=text], input[type=email], textarea");
contactForm.addEventListener("submit", (event) => showSentAlert(event));

function showSentAlert(event) {
    event.preventDefault();
    inputs.forEach(input => input.value="");
    sentAlert.style.display = "block";
    setTimeout(() => {
        sentAlert.style.display = "none"
    }, 1500);

}