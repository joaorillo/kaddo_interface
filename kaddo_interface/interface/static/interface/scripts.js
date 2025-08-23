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
    ui.aislesFlagsLines = document.querySelectorAll('.aisle-flag-line');
    ui.aislesFlags = document.querySelectorAll('.aisle-flag');
    ui.categoryCards = document.querySelectorAll('.category-card');
    ui.categoryContainer = document.getElementById('category-container');
    ui.categoryCardMaionese = document.getElementById('category-card-maionese');
    ui.firstAisleFlag = document.querySelector('.aisle-flag');
    ui.addedScrollingHeight = ui.firstAisleFlag.getBoundingClientRect().top + window.scrollY;
    ui.firstAisleFlagDistanceToBottom = window.innerHeight - ui.firstAisleFlag.getBoundingClientRect().top;

    // User clicks on an aisle on ui.sidebar
    const aislesNames = document.querySelectorAll('.aisle-name');
    aislesNames.forEach((aisleName) => {
        var aisleSlug = aisleName.id.replace('aisle-name-', '');;
        aisleName.addEventListener('click', (e) => {
            e.preventDefault();
            setCurrentAisle(aisleSlug, true);
        })
    })

    // User scrolls through aisles
    ui.aislesScrollPositions = [];
    const firstCard = document.querySelector('.category-card');
    var cardHeight = 0;
    if (firstCard) {
        cardHeight = firstCard.offsetHeight;
        console.log(`cardHeight: ${cardHeight}`);
    }
    ui.aislesFlags.forEach(flag => {
        const y = flag.getBoundingClientRect().top - ui.addedScrollingHeight;
        const aisleScrollPosition = y - 0.7 * cardHeight - 30;
        const aisleSlug = flag.id.replace('aisle-flag-', '');
        ui.aislesScrollPositions.push({'aisleSlug': aisleSlug, 'aisleScrollPosition': aisleScrollPosition});
        console.log(`${aisleSlug}:`);
        console.log(`    > y: ${y}:`);
        console.log(`    > aisleScrollPosition: ${aisleScrollPosition}:`);
        // const categoriesGrid = flag.nextElementSibling;
        // if (categoriesGrid && categoriesGrid.classList.contains('categories-grid')) {
        //     const y = flag.getBoundingClientRect().top - ui.addedScrollingHeight;
        //     const aisleScrollPosition = y - ui.firstAisleFlagDistanceToBottom + offset;
        //     ui.aislesScrollPositions.push({'aisleSlug': aisleSlug, 'aisleScrollPosition': aisleScrollPosition});
        // }
    })
    window.addEventListener("scroll", onScroll);

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


// Set current aisle
function setCurrentAisle(aisleSlug, scroll = false) {
    var currentAisle = document.querySelector('.aisle-name.selected');
    var newCurrentAisle = document.getElementById(`aisle-name-${aisleSlug}`);
    if (currentAisle && newCurrentAisle && currentAisle != newCurrentAisle) {
        currentAisle.classList.remove('selected');
        newCurrentAisle.classList.add('selected');
        if (scroll) {
            targetId = newCurrentAisle.getAttribute('href');
            if (targetId.length > 1) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const y = targetElement.getBoundingClientRect().top + window.scrollY - ui.addedScrollingHeight;
                    window.scrollTo({top: y, behavior: 'smooth'});
                }
            }
        }
    }
}


// Identify when user scrolls to a certain aisle
function onScroll() {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    console.log(`>> scrollPosition: ${scrollPosition}`);
    ui.aislesScrollPositions.forEach(aisle => {
        if (scrollPosition >= aisle.aisleScrollPosition) {
            setCurrentAisle(aisle.aisleSlug);
        }
    })
}



// Toggle a given class from a given element
function toggleClass(element, className) {
    if (element.classList.contains(className)) {
        element.classList.remove(className);
    } else {
        element.classList.add(className);
    }
}


// Toggle between 'default view' and 'search view'
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
    ui.categoryCards.forEach((categoryCard) => {
        toggleClass(categoryCard, 'd-none');
    })
    ui.aislesFlagsLines.forEach((aisleFlagLine) => {
        toggleClass(aisleFlagLine, 'd-none');
    })
    ui.aislesFlags.forEach((aisleFlag) => {
        toggleClass(aisleFlag, 'd-none');
    })
}