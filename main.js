// main.js

document.addEventListener("DOMContentLoaded", function() {
    /**
     * Fetches HTML content from a file and injects it into a placeholder element.
     * @param {string} componentPath - The path to the HTML component file (e.g., 'header.html').
     * @param {string} placeholderId - The ID of the div where the content will be placed.
     */
    const loadComponent = (componentPath, placeholderId) => {
        fetch(componentPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Could not load component from ${componentPath}`);
                }
                return response.text();
            })
            .then(data => {
                const placeholder = document.getElementById(placeholderId);
                if (placeholder) {
                    placeholder.innerHTML = data;
                }
                // After loading the header, we need to run the logic to highlight the active nav link.
                if (placeholderId === 'header-placeholder') {
                    highlightActiveNav();
                }
            })
            .catch(error => console.error('Error loading component:', error));
    };

    /**
     * Adds styling to the navigation link of the current page to indicate it's active.
     */
    const highlightActiveNav = () => {
        // Get the current page's filename (e.g., "team.html", or "" for the root/index page).
        const currentPage = window.location.pathname.split("/").pop();
        
        // Remove active styles from all links first to be safe
        document.querySelectorAll('nav a').forEach(link => {
            link.classList.remove('text-red-500', 'text-blue-500', 'text-green-500', 'text-purple-500', 'font-bold');
        });

        // Apply active styles to the correct link
        if (currentPage === "" || currentPage === "index.html") {
            document.getElementById('nav-home')?.classList.add('text-red-500', 'font-bold');
        } else if (currentPage === "team.html") {
            document.getElementById('nav-team')?.classList.add('text-blue-500', 'font-bold');
        } else if (currentPage === "sponsors.html") {
            document.getElementById('nav-sponsors')?.classList.add('text-green-500', 'font-bold');
        } else if (currentPage === "secret-project.html") {
            document.getElementById('nav-secret')?.classList.add('text-purple-500', 'font-bold');
        }
    };

    // Load the header and footer into their placeholders.
    loadComponent('header.html', 'header-placeholder');
    loadComponent('footer.html', 'footer-placeholder');
});
