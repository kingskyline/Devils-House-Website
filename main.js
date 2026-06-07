// main.js

document.addEventListener("DOMContentLoaded", function() {
    /**
     * Calculates the path back to the root folder dynamically.
     */
    const getRootPath = () => {
        const path = window.location.pathname;
        if (path.includes('/devlogs/')) {
            return '../../'; // Devlogs are 2 folders deep
        } else if (path.includes('/projects/')) {
            return '../'; // Projects are 1 folder deep
        }
        return './'; // Root folder
    };

    const loadStyles = () => {
        const root = getRootPath();
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        // Cache buster for your CSS so design updates show instantly
        link.href = root + 'style.css?v=' + new Date().getTime(); 
        document.head.appendChild(link);
    };


    /**
     * Fixes relative links in injected components so they always point to the right place.
     */
    const fixRelativeLinks = (placeholderId) => {
        const root = getRootPath();
        if (root === './') return; // No fix needed if we are already in the main folder

        const container = document.getElementById(placeholderId);
        if (!container) return;

        container.querySelectorAll('a').forEach(link => {
            const href = link.getAttribute('href');
            // Only modify links that are relative (not http links, not already modified)
            if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('../')) {
                link.setAttribute('href', root + href);
            }
        });
    };

    /**
     * Fetches HTML content and injects it into a placeholder.
     */
    const loadComponent = (componentName, placeholderId) => {
        const fullPath = getRootPath() + componentName;
        
        // THE CACHE-BUSTER: Forces the browser to load the freshest file every time
        const cacheBuster = "?v=" + new Date().getTime();
        const fetchUrl = fullPath + cacheBuster;
        
        fetch(fetchUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Could not load component from ${fullPath}`);
                }
                return response.text();
            })
            .then(data => {
                const placeholder = document.getElementById(placeholderId);
                if (placeholder) {
                    placeholder.innerHTML = data;
                }
                
                // Fix the links and highlight navigation after loading
                fixRelativeLinks(placeholderId);
                if (placeholderId === 'header-placeholder') {
                    highlightActiveNav();
                }
            })
            
            .catch(error => console.error('Error loading component:', error));
            
    };

    /**
     * Navigation Highlighter
     */
    const highlightActiveNav = () => {
        const currentPage = window.location.pathname.split("/").pop();
        
        document.querySelectorAll('nav a').forEach(link => {
            link.classList.remove('text-red-500', 'text-blue-500', 'text-green-500', 'text-purple-500', 'font-bold');
        });

        if (currentPage === "" || currentPage === "index.html") {
            document.getElementById('nav-home')?.classList.add('text-red-500', 'font-bold');
        } else if (currentPage === "projects.html" || window.location.pathname.includes('/projects/')) {
            document.getElementById('nav-projects')?.classList.add('text-purple-500', 'font-bold');
        } else if (currentPage === "team.html") {
            document.getElementById('nav-team')?.classList.add('text-blue-500', 'font-bold');
        } else if (currentPage === "sponsors.html") {
            document.getElementById('nav-sponsors')?.classList.add('text-green-500', 'font-bold');
        }
    };

    loadComponent('header.html', 'header-placeholder');
    loadComponent('footer.html', 'footer-placeholder');
});