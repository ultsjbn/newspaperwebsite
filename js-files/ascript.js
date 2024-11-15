// Header animation when scrolling
window.addEventListener('scroll', function() {
    var header = document.querySelector('header');
    var date = document.querySelector('#date');
    var scrollPosition = window.scrollY;

    var headerOpacity = Math.max(0.7 - scrollPosition / 500, 0);
    var textOpacity = Math.max(1 - scrollPosition / 500, 0);

    var themeLink = document.getElementById("articleTheme");
    if (themeLink) {
        var themeHref = themeLink.getAttribute("href");
        if (themeHref.includes('pink pastel.css')) {
            header.style.backgroundColor = `rgba(255, 182, 193, ${headerOpacity})`;
        } else if (themeHref.includes('windows xp.css')) {
            header.style.backgroundColor = `rgba(8, 49, 217, ${headerOpacity})`; 
        } else {
            header.style.backgroundColor = `rgba(18, 20, 22, ${headerOpacity})`;
        }
    }
    if (date) date.style.opacity = textOpacity;
});

// Function to open a menu
function openMenu(menuId) {
    console.log("Opening menu:", menuId);
    document.getElementById("overlay").style.display = "block";
    document.querySelectorAll(".popupMenu").forEach(menu => {
        menu.style.display = "none";
    });
    // Takes the ID of menu and plugs in to this getElementById
    document.getElementById(menuId).style.display = "block";
}

// Function to close a menu
function closeMenu() {
    document.getElementById("overlay").style.display = "none";
    document.querySelectorAll(".popupMenu").forEach(menu => {
        menu.style.display = "none";
    });
}

// Function to switch themes based on radio button selection and save to local storage
function setTheme(sheet) {
    var stylesheet = document.getElementById('articleTheme');
    stylesheet.setAttribute('href', sheet);
    localStorage.setItem('cssTemplate', sheet);
    
    if (sheet === "css-files/dark modern.css") {
        document.getElementById("headerimg").src = "images/dark modern header.png";
    } else if (sheet === "css-files/pink pastel.css") {
        document.getElementById("headerimg").src = "images/pink pastel header.gif";
    } else if (sheet === "css-files/windows xp.css") {
        document.getElementById("headerimg").src = "images/windows xp header.gif";
    }    

    console.log("Theme changed to: " + sheet);
}

// Load the previously saved theme from localStorage and set the corresponding radio button on page load 
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('cssTemplate');
    setTheme(savedTheme);
}

// On page load, call loadSavedTheme to apply and display the saved theme selection
window.addEventListener("load", function() {
    loadSavedTheme();
});

