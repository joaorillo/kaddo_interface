const ui = {};

window.onbeforeunload = () => window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;
    const rootStyles = getComputedStyle(root);

    // #categories-column horizontal padding dynamically calculated
    ui.categoriesContainerBig = document.getElementById('categories-container-big');
    ui.categoriesContainerSmall = document.getElementById('categories-container-small');
    ui.categoryCardWidthDesktop = parseFloat(rootStyles.getPropertyValue("--category-card-container-width-desktop").trim());
    ui.categoryCardWidthMobile = parseFloat(rootStyles.getPropertyValue("--category-card-container-width-mobile").trim());
    updateCategoriesContainerBigPadding();
    window.addEventListener('resize', updateCategoriesContainerBigPadding);

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
        aisleName.addEventListener('click', (e) => {
            e.preventDefault();
            targetId = aisleName.getAttribute('href');
            if (targetId.length > 1) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const y = targetElement.getBoundingClientRect().top + window.scrollY - ui.addedScrollingHeight;
                    window.scrollTo({top: y, behavior: 'smooth'});
                }
            }
        })
    })

    // User scrolls through aisles
    ui.aislesScrollPositions = [];
    const firstCard = document.querySelector('.category-card');
    var cardHeight = 0;
    if (firstCard) {
        cardHeight = firstCard.offsetHeight;
    }
    ui.aislesFlags.forEach(flag => {
        const y = flag.getBoundingClientRect().top - ui.addedScrollingHeight;
        const aisleScrollPosition = y - 0.7 * cardHeight - 30;
        const aisleSlug = flag.id.replace('aisle-flag-', '');
        ui.aislesScrollPositions.push({'aisleSlug': aisleSlug, 'aisleScrollPosition': aisleScrollPosition});
    })
    window.addEventListener("scroll", onScroll);

    // Search bar input clicked / Category card clicked / Close search icon clicked / Close category card clicked / etc.
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
    ui.sidebar.addEventListener('click', () => {
        if (ui.sidebar.classList.contains('minimized')) {
            toggleSearch();
        }
    })

    // Scroll to top
    window.scrollTo(0, 0);
})


// Identify when user scrolls to a certain aisle
function onScroll() {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    for (let i = ui.aislesScrollPositions.length - 1; i >= 0; i--) {
        var aisle = ui.aislesScrollPositions[i];
        if (scrollPosition >= aisle.aisleScrollPosition) {
            setCurrentAisle(aisle.aisleSlug);
            return
        }
    }
}


// Set current aisle
function setCurrentAisle(aisleSlug) {
    var currentAisle = document.querySelector('.aisle-name.selected');
    var newCurrentAisle = document.getElementById(`aisle-name-${aisleSlug}`);
    if (currentAisle && newCurrentAisle && currentAisle != newCurrentAisle) {
        currentAisle.classList.remove('selected');
        newCurrentAisle.classList.add('selected');
    }
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


// Calculate #categories-column horizontal padding (responsiveness)
function updateCategoriesContainerBigPadding() {
    const totalWidth = ui.categoriesContainerBig.getBoundingClientRect().width - 15.2;
    var categoryCardWidth = ui.categoryCardWidthDesktop;
    if (window.matchMedia("(max-width: 768px)").matches) {
        var categoryCardWidth = ui.categoryCardWidthMobile;
    }
    const remainder = totalWidth % categoryCardWidth;
    const padding = remainder / 2;
    ui.categoriesContainerBig.style.paddingLeft = `${padding}px`;
    ui.categoriesContainerBig.style.paddingRight = `${padding}px`;
    ui.categoriesContainerSmall.style.display = 'block';
}