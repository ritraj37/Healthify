document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const userId = document.getElementById("userid").value.trim();
    const password = document.getElementById("password").value.trim();
    const mobile = document.getElementById("mobile").value.trim();

    if ((userId !== "" && password !== "") || mobile !== "") {
        alert("Login Successful!");
        window.location.href = "appointment.html";
    } else {
        alert("Enter User ID & Password OR Mobile Number");
    }
});
