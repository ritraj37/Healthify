// Navbar responsive functionality
document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.querySelector('.fa-bars');
    const navbar = document.querySelector('.navbar');
    const header = document.querySelector('header');

    // Toggle mobile menu
    menuBtn.addEventListener('click', function() {
        this.classList.toggle('fa-times');
        navbar.classList.toggle('nav-toggle');
    });

    // Handle scroll events
    window.addEventListener('scroll', function() {
        menuBtn.classList.remove('fa-times');
        navbar.classList.remove('nav-toggle');

        if (window.scrollY > 30) {
            header.classList.add('header-active');
        } else {
            header.classList.remove('header-active');
        }
    });

    // Close menu when clicking on nav links (mobile)
    const navLinks = document.querySelectorAll('.navbar ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuBtn.classList.remove('fa-times');
            navbar.classList.remove('nav-toggle');
        });
    });
});