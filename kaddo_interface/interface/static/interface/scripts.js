const ui = {};

window.onbeforeunload = () => window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;
    const rootStyles = getComputedStyle(root);

    // #categories-column horizontal padding dynamically calculated
    ui.categoriesColumn = document.getElementById('categories-column');
    ui.categoriesContainerBig = document.getElementById('categories-container-big');
    ui.categoriesContainerSmall = document.getElementById('categories-container-small');
    ui.aislesFlagsLines = document.querySelectorAll('.aisle-flag-line');
    ui.aislesFlags = document.querySelectorAll('.aisle-flag');
    ui.categoryCards = document.querySelectorAll('.category-card');
    ui.categoryCardWidthDesktop = parseFloat(rootStyles.getPropertyValue("--category-card-container-width-desktop").trim());
    ui.categoryCardWidthMobile = parseFloat(rootStyles.getPropertyValue("--category-card-container-width-mobile").trim());
    ui.searchBarStripMaximizedPaddingLeft = parseFloat(rootStyles.getPropertyValue("--search-bar-strip-maximized-padding-left").trim());
    ui.defaultPaddingRight = parseFloat(rootStyles.getPropertyValue("--default-padding-right").trim());
    ui.noResultsWarningContainer = document.getElementById('no-results-warning-container');
    updateCategoriesContainerBigPadding();
    window.addEventListener('resize', updateCategoriesContainerBigPadding);

    // Define 'ui' (User Interface) variables
    ui.searchBarStrip = document.getElementById('search-bar-strip');
    ui.searchBar = document.getElementById('search-bar');
    ui.searchBarInput = document.getElementById('search-bar-input');
    ui.closeSearchIcon = document.getElementById('close-search-icon');
    ui.sidebar = document.getElementById('sidebar');
    ui.sidebarReopenIcon = document.getElementById('sidebar-reopen-icon');
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
        ui.categoryContainer.classList.add('hidden');
    })
    ui.categoryCardMaionese.addEventListener('click', (event) => {
        if (!ui.sidebar.classList.contains('minimized')) {
            event.stopPropagation(); // Prevent the click from bubbling up
            toggleSearch();
            toggleClass(ui.categoryContainer, 'hidden');
        }
    })
    ui.closeSearchIcon.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent the click from bubbling up
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
    ui.categoriesColumn.addEventListener('click', () => {
        ui.categoryContainer.classList.add('hidden');
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
    toggleClass(ui.noResultsWarningContainer, 'd-none');
    updateCategoriesContainerBigPadding();
}


// Calculate #categories-column horizontal padding (responsiveness)
async function updateCategoriesContainerBigPadding() {
    ui.categoryCards.forEach((categoryCard) => {
        categoryCard.classList.add('d-none');
    })
    ui.aislesFlagsLines.forEach((aisleFlagLine) => {
        aisleFlagLine.classList.add('d-none');
    })
    ui.aislesFlags.forEach((aisleFlag) => {
        aisleFlag.classList.add('d-none');
    })

    if (!ui.noResultsWarningContainer.classList.contains('d-none')) {
        console.log("entered 1");
        ui.categoriesColumn.style.paddingLeft = `${ui.searchBarStripMaximizedPaddingLeft}px`;
        ui.categoriesColumn.style.paddingRight = `${ui.searchBarStripMaximizedPaddingLeft}px`;
    }
    else {
        await wait(300);
        console.log("entered 2");
        
        ui.categoriesColumn.style.paddingLeft = `${ui.defaultPaddingRight}px`;
        ui.categoriesColumn.style.paddingRight = `${ui.defaultPaddingRight}px`;
        var styles = window.getComputedStyle(ui.categoriesColumn);
        var categoriesColumnWidth = parseFloat(styles.getPropertyValue("width").trim());
        var categoriesColumnPaddingLeft = parseFloat(styles.getPropertyValue("padding-left").trim());
        console.log(`categoriesColumnWidth: ${categoriesColumnWidth}`);
        console.log(`categoriesColumnPaddingLeft: ${categoriesColumnPaddingLeft}`);
        
        var availableWidth = (
            categoriesColumnWidth
            - 2 * categoriesColumnPaddingLeft
            - 15.2
        );
        console.log(`availableWidth: ${availableWidth}`);

        const totalWidth = ui.categoriesContainerBig.getBoundingClientRect().width - 15.2;
        console.log(`totalWidth: ${totalWidth}`);

        var categoryCardWidth = ui.categoryCardWidthDesktop;
        if (window.matchMedia("(max-width: 768px)").matches) {
            var categoryCardWidth = ui.categoryCardWidthMobile;
        }
        console.log(`categoryCardWidth: ${categoryCardWidth}`);

        const remainder = availableWidth % categoryCardWidth;
        var padding = remainder / 2;
        console.log(`remainder: ${remainder}`);
        console.log(`padding: ${padding}`);

        ui.categoriesContainerBig.style.paddingLeft = `${padding}px`;
        ui.categoriesContainerBig.style.paddingRight = `${padding}px`;
        ui.categoriesContainerSmall.style.display = 'block';
    }

    // Show / hide category cards
    if (ui.noResultsWarningContainer.classList.contains('d-none')) {
        ui.categoryCards.forEach((categoryCard) => {
            categoryCard.classList.remove('d-none');
        })
        ui.aislesFlagsLines.forEach((aisleFlagLine) => {
            aisleFlagLine.classList.remove('d-none');
        })
        ui.aislesFlags.forEach((aisleFlag) => {
            aisleFlag.classList.remove('d-none');
        })
    }
}


function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}