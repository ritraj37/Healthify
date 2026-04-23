document.addEventListener("DOMContentLoaded", () => {

    // LOGIN SUBMIT
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            alert("Login successful (Demo)");
            window.location.href = "appointment.html";
        });
    }

    // APPOINTMENT FORM SUBMIT
    const appointmentForm = document.getElementById("appointmentForm");
    if (appointmentForm) {
        appointmentForm.addEventListener("submit", (e) => {
            e.preventDefault();

            alert("Appointment Submitted Successfully!");
            window.location.href = "index.html";
        });
    }

});
