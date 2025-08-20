const ui = {};

document.addEventListener('DOMContentLoaded', () => {
    // Define 'ui' (User Interface) variables
    ui.searchBarStrip = document.getElementById('search-bar-strip');
    ui.searchBar = document.getElementById('search-bar');
    ui.searchBarInput = document.getElementById('search-bar-input');
    ui.closeSearchIcon = document.getElementById('close-search-icon');
    ui.sidebar = document.getElementById('sidebar');
    ui.sidebarReopenIcon = document.getElementById('sidebar-reopen-icon');
    ui.categoriesColumn = document.getElementById('categories-column');
    ui.aislesFlagsLines = document.getElementsByClassName('aisle-flag-line');
    ui.aislesFlags = document.getElementsByClassName('aisle-flag');
    ui.categoryCards = document.getElementsByClassName('category-card');
    ui.categoryContainer = document.getElementById('category-container');
    ui.categoryCardMaionese = document.getElementById('category-card-maionese');
    ui.firstAisleFlag = document.querySelector('.aisle-flag');

    // User clicks on an aisle on ui.sidebar
    const aislesNames = document.querySelectorAll('.aisle-name');
    aislesNames.forEach((aisle) => {
        var aisleName = aisle.innerHTML;
        aisle.addEventListener('click', (e) => {
            e.preventDefault();
            scroll_aisle(aisleName);
        })
    })

    // Search bar input clicked / Category card clicked / Close search icon clicked / Close category card clicked
    ui.searchBar.addEventListener('click', () => {
        ui.searchBarInput.focus();
        if (!ui.sidebar.classList.contains('minimized')) {
            toggleSearch();
        }
    })
    ui.categoryCardMaionese.addEventListener('click', () => {
        if (!ui.sidebar.classList.contains('minimized')) {
            toggleSearch();
            toggleClass(ui.categoryContainer, 'hidden');
        }
    })
    ui.closeSearchIcon.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevents the click from bubbling up to #search-bar
        toggleSearch();
    })
    ui.sidebarReopenIcon.addEventListener('click', () => {
        toggleSearch();
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
        targetId = clickedAisle.getAttribute('href');
        if (targetId.length > 1) {
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                var addedScrollingHeight = ui.firstAisleFlag.getBoundingClientRect().top + window.scrollY;
                const y = targetElement.getBoundingClientRect().top + window.scrollY - addedScrollingHeight;
                window.scrollTo({top: y, behavior: 'smooth'});
            }
        }
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
    ui.searchBarInput.value = '';
    if (ui.sidebar.classList.contains('minimized') && !ui.categoryContainer.classList.contains('hidden')) {
        ui.categoryContainer.classList.add('hidden');
    }
    toggleClass(ui.sidebar, 'minimized');
    toggleClass(ui.searchBarStrip, 'maximized');
    toggleClass(ui.categoriesColumn, 'maximized');
    toggleClass(ui.closeSearchIcon, 'd-none');
    toggleClass(ui.sidebarReopenIcon, 'd-none');
    Array.from(ui.categoryCards).forEach((categoryCard) => {
        toggleClass(categoryCard, 'd-none');
    })
    Array.from(ui.aislesFlagsLines).forEach((aisleFlagLine) => {
        toggleClass(aisleFlagLine, 'd-none');
    })
    Array.from(ui.aislesFlags).forEach((aisleFlag) => {
        toggleClass(aisleFlag, 'd-none');
    })
}