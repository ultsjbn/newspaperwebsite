// Function to open a menu
function openMenu(menuId) {
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

// (1) Arrangement of Articles
function setArrangement(arrangement) {  
    var article2 = document.getElementById("article2");
    var article3 = document.getElementById("article3");
    var article4 = document.getElementById("article4");  
    var article5 = document.getElementById("article5");
    var article6 = document.getElementById("article6");
    var articles = [article2, article3, article4, article5, article6];

    if (arrangement == 'sequential') {
        // Default css for sequential arrangement
        articles.forEach(article => {
            article.style.display = 'table-row';
            article.style.padding = '15px';
        });
    } else if (arrangement == 'column') {
        // Adjusting widths of the divs to appear like columns
        const widths = ['45%', '45%', '33%', '33%', '33%'];
        articles.forEach((article, index) => {
            article.style.display = 'table-cell';
            article.style.padding = '15px';
            article.style.width = widths[index];
        });
    }
    localStorage.setItem('arrangementStyle', arrangement);
    closeMenu();
}

// To save the user's option of arrangement (when going back to home or reloading)
window.addEventListener("load", function() {
    var savedArrangement = localStorage.getItem('arrangementStyle') || 'sequential'; // If no arrangement saved, go for sequential
    setArrangement(savedArrangement);
});


// (2) Order of Articles
const originalContent = [];

// Store original content to an array
window.onload = () => {
    const elements = ["Title", "img", "Author", "Content", "Source"];

    for (let i = 1; i <= 6; i++) {
        // OG Content
        originalContent[i] = {};
        elements.forEach(element => {
            const elementOG = document.getElementById(`article${i}${element}`);
            if (elementOG) {
                if (element === "img") {
                    // Store image source
                    var img = elementOG.querySelector("img");
                    originalContent[i][element] = img ? img.src : ""; 
                } else if (element === "Title") {
                    // Storing title's links
                    const link = elementOG.parentElement; // the anchor tag
                    originalContent[i][element] = {
                        text: elementOG.textContent, // the h3
                        href: link.href // the source
                    };
                }
                else {
                    // This is to store other content
                    originalContent[i][element] = elementOG.innerHTML; 
                }
            }
        });
    }

    loadSavedOrder();
};

function reorderArticles() {
    // Declare arrays
    let elements = ["Title", "img", "Author", "Content", "Source"];
    let tempContent = [];
    let userOrder = [];

    // Check for duplicates and alert the user if duplicates are selected
    // Empty array to store the selected article values
    let selectedArticles = [];
    for (let i = 1; i <= 6; i++) {
        const priorityValue = document.getElementById(`orderSelect${i}`).value;
        if (selectedArticles.includes(priorityValue)) {
            alert("You cannot select the same article for multiple priorities. Please choose different articles.");
            return; // Stop
        }
        // Put selected article (priorityValue) to the selectedArticles[]
        selectedArticles.push(priorityValue);
        userOrder.push(priorityValue);
    }

    // Place the articles to their original "place" bcs their values change for the second order
    resetArticles();

    // Collect all the current content in the selected order
    for (let i = 1; i <= 6; i++) {
        const priorityValue = document.getElementById(`orderSelect${i}`).value;
        // Temp holder
        tempContent[i] = {};

        // Store each element (title, img, author, content, source) in tempContent
        elements.forEach(element => {
            var sourceElement = document.getElementById(`article${priorityValue}${element}`);
            if (sourceElement) {
                if (element === "img") {
                    tempContent[i][element] = sourceElement.querySelector("img").src;
                } else if (element === "Title") {
                    const link = sourceElement.parentElement; // The anchor tag
                    tempContent[i][element] = {
                        text: sourceElement.textContent, // the h3
                        href: link.href // the source
                    };
                } else {
                    tempContent[i][element] = sourceElement.innerHTML;
                }
            }
        });
    }

    // Place collected content to the target articles
    for (let i = 1; i <= 6; i++) {
        elements.forEach(element => {
            var targetElement = document.getElementById(`article${i}${element}`);
            if (targetElement) {
                if (element === "img") {
                    // Setting the image src
                    const img = targetElement.querySelector("img");
                    if (img) {
                        img.src = tempContent[i][element];
                    }
                } else if (element === "Title") {
                    const link = targetElement.parentElement; // The anchor tag
                    if (link) {
                        targetElement.textContent = tempContent[i][element].text;
                        link.href = tempContent[i][element];
                    }
                } else {
                    // For other elements
                    targetElement.innerHTML = tempContent[i][element];
                }
            }
        });
    }

    // Save order
    localStorage.setItem("userOrder", userOrder.join(","));
}

// Placing articles to their original "place" or "value"
function resetArticles() {
    const elements = ["Title", "img", "Author", "Content", "Source"];
    
    for (let i = 1; i <= 6; i++) {
        elements.forEach(element => {
            var targetElement = document.getElementById(`article${i}${element}`);
            if (targetElement) {
                if (element === "img") {
                    const img = targetElement.querySelector("img");
                    if (img) {
                        img.src = originalContent[i][element];
                    }
                } else if (element === "Title") {
                    const link = targetElement.parentElement;
                    if(link) {
                        targetElement.textContent = originalContent[i][element].text;
                        link.href = originalContent[i][element].href;
                    }
                }
                else {
                    targetElement.innerHTML = originalContent[i][element];
                }
            }
        });
    }
}

// Needed function for when the user reloads, it still has the same order
function loadSavedOrder() {
    const savedOrder = localStorage.getItem("userOrder");
    if (savedOrder) {
        const userOrder = savedOrder.split(",");
        
        // Restore dropdown values based on saved order
        for (let i = 1; i <= userOrder.length; i++) {
            document.getElementById(`orderSelect${i}`).value = userOrder[i - 1];
        }

        // Reapply the order
        let elements = ["Title", "img", "Author", "Content"];
        const tempContent = {};

        // Store current order based on the saved order
        for (let i = 1; i <= userOrder.length; i++) {
            const priorityValue = userOrder[i - 1];
            tempContent[i] = {};

            elements.forEach(element => {
                const sourceElement = document.getElementById(`article${priorityValue}${element}`);
                if (sourceElement) {
                    if (element === "img") {
                        tempContent[i][element] = sourceElement.querySelector("img").src;
                    } else if (element === "Title") {
                        const link = sourceElement.parentElement;
                        tempContent[i][element] = {
                            text: sourceElement.textContent,
                            href: link.href
                        };
                    } else {
                        tempContent[i][element] = sourceElement.innerHTML;
                    }
                }
            });
        }

        // Place the saved content in the articles
        for (let i = 1; i <= userOrder.length; i++) {
            elements.forEach(element => {
                const targetElement = document.getElementById(`article${i}${element}`);
                if (targetElement) {
                    if (element === "img") {
                        const img = targetElement.querySelector("img");
                        if (img) {
                            img.src = tempContent[i][element];
                        }
                    } else if (element === "Title") {
                        const link = targetElement.parentElement; // anchor tag
                        if (link) {
                            targetElement.textContent = tempContent[i][element].text;
                            link.href = tempContent[i][element].href;
                        }
                    } else {
                        targetElement.innerHTML = tempContent[i][element];
                    }
                }
            });
        }
    }
}


// (3) Theme of Articles and calendar theme switch
function setTheme(sheet) {
    var stylesheet = document.getElementById('theme');
    stylesheet.setAttribute('href', sheet);
    localStorage.setItem('cssTemplate', sheet);

    var calendarIframe = document.getElementById("calendarFrame");
    var header = document.getElementById("headerimg");
    
    if (sheet === "css-files/dark modern.css") {
        calendarIframe.src = "http://nosi-mizuhiki.com/blog_tool/moon1.php";
        header.src = "./images/dark modern header.png";
    } else if (sheet === "css-files/pink pastel.css") {
        calendarIframe.src = "https://calendar.sakura.ne.jp/blog_cal.html";
        header.src = "./images/pink pastel header.gif";
    } else if (sheet === "css-files/windows xp.css") {
        calendarIframe.src = "https://calendar.sakura.ne.jp/blog_cal.html";
        header.src="./images/windows xp header.gif";
    }    

    console.log("Theme changed to: " + sheet);
}
 
// To save the user's option of theme (when going back to home or reloading)
window.addEventListener("load", function() {
    var themeStyle = localStorage.getItem('cssTemplate') || 'css-files/dark modern.css'; 
    setTheme(themeStyle);

    document.body.style.visibility = 'visible';
});





