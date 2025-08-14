let searchBarStrip;
let searchBar;
let searchBarInput;
let closeSearchIcon;
let sidebar;
let sidebarReopenIcon;
let categoriesColumn;
let aislesFlagsLines;
let aislesFlags;
let categoryCards;
let categoryContainer;

document.addEventListener('DOMContentLoaded', () => {
    // User clicks on an aisle on sidebar
    const aislesNames = document.querySelectorAll('.aisle-name');
    aislesNames.forEach((aisle) => {
        var aisleName = aisle.innerHTML;
        aisle.addEventListener('click', () => {
            console.log(`scroll_aisle(${aisleName})`);
            scroll_aisle(aisleName);
        })
    })

    // Search bar input clicked / Close search icon clicked
    searchBarStrip = document.getElementById('search-bar-strip');
    searchBar = document.getElementById('search-bar');
    searchBarInput = document.getElementById('search-bar-input');
    closeSearchIcon = document.getElementById('close-search-icon');
    sidebar = document.getElementById('sidebar');
    sidebarReopenIcon = document.getElementById('sidebar-reopen-icon');
    categoriesColumn = document.getElementById('categories-column');
    aislesFlagsLines = document.getElementsByClassName('aisle-flag-line');
    aislesFlags = document.getElementsByClassName('aisle-flag');
    categoryCards = document.getElementsByClassName('category-card');
    categoryContainer = document.getElementById('category-container');
    searchBar.addEventListener('click', () => {
        searchBarInput.focus();
        if (!sidebar.classList.contains('minimized')) {
            toggleSearch();
        }
    })
    closeSearchIcon.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevents the click from bubbling up to #search-bar
        if (sidebar.classList.contains('minimized')) {
            toggleSearch();
        }
    })
    sidebarReopenIcon.addEventListener('click', () => {
        if (sidebar.classList.contains('minimized')) {
            toggleSearch();
        }
    })
})


// Scrolls to a given aisle
function scroll_aisle(aisleName) {
    var selectedAisle = document.querySelector('.aisle-name.selected');
    if (selectedAisle){
        selectedAisle.classList.remove('selected');
    }
    var clickedAisle = Array.from(document.querySelectorAll('.aisle-name'))
        .find(el => el.innerHTML.trim() === aisleName);
    if (clickedAisle) {
        clickedAisle.classList.add('selected');
    }
}


// Toggles a given class from a given element
function toggleClass(element, className) {
    if (element.classList.contains(className)) {
        element.classList.remove(className);
    } else {
        element.classList.add(className);
    }
}


// Toggles between 'default view' and 'search view'
function toggleSearch() {
    toggleClass(sidebar, 'minimized');
    toggleClass(searchBarStrip, 'maximized');
    toggleClass(categoriesColumn, 'maximized');
    toggleClass(closeSearchIcon, 'd-none');
    toggleClass(sidebarReopenIcon, 'd-none');
    if (sidebar.classList.contains('minimized')) {
        searchBarInput.value = '';
    }
    toggleClass(categoryContainer, 'd-none');
    Array.from(categoryCards).forEach((categoryCard) => {
        toggleClass(categoryCard, 'd-none');
    })
    Array.from(aislesFlagsLines).forEach((aisleFlagLine) => {
        toggleClass(aisleFlagLine, 'd-none');
    })
    Array.from(aislesFlags).forEach((aisleFlag) => {
        toggleClass(aisleFlag, 'd-none');
    })
}