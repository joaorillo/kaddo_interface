const ui = {};

window.onbeforeunload = () => window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', async () => {
    const root = document.documentElement;
    const rootStyles = getComputedStyle(root);

    // Call functions that determine dynamically calculated elements
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
    ui.categoryContainer = document.getElementById('category-container');
    await updateCategoriesContainerBigPadding();
    ui.categoryFiltersBigContainer = document.getElementById('category-filters-big-container');
    updateCategoryFilterContainer()

    // Define 'ui' (User Interface) variables
    ui.searchBarStrip = document.getElementById('search-bar-strip');
    ui.searchBar = document.getElementById('search-bar');
    ui.searchBarInput = document.getElementById('search-bar-input');
    ui.closeSearchIcon = document.getElementById('close-search-icon');
    ui.sidebar = document.getElementById('sidebar');
    ui.sidebarReopenIcon = document.getElementById('sidebar-reopen-icon');
    ui.filtersButton = document.getElementById('filters-btn');
    ui.closeCategoryButton = document.getElementById('close-category-btn');
    ui.categoryCardMaionese = document.getElementById('category-card-maionese');
    ui.categoryProductsContainer = document.getElementById('category-products-container');
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
            ui.categoryContainer.classList.remove('hidden');
            toggleSearch(true);
        }
    })
    ui.closeSearchIcon.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent the click from bubbling up
        toggleSearch();
    })
    ui.sidebarReopenIcon.addEventListener('click', () => {
        toggleSearch();
    })
    ui.closeCategoryButton.addEventListener('click', () => {
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

    // Click on filter button (category container - mobile)
    ui.filtersButton.addEventListener('click', () => {
        toggleFilterMobile();
    })
    ui.categoryProductsContainer.addEventListener('click', () => {
        if (ui.categoryContainer.classList.contains('shaded')) {
            toggleFilterMobile();
        }
    })

    // Window resize behavior
    window.addEventListener('resize', updateCategoriesContainerBigPadding);
    window.addEventListener('resize', updateCategoryFilterContainer);

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


// Show / hide filters on category container (mobile)
function toggleFilterMobile() {
    toggleClass(ui.categoryContainer, 'shaded');
    toggleClass(ui.categoryFiltersBigContainer, 'minimized-mobile');
}


// Toggle between 'default view' and 'search view'
function toggleSearch(click_category = false) {
    if (click_category || ui.sidebar.classList.contains('minimized')) {
        ui.noResultsWarningContainer.classList.add('d-none');
    } else {
        ui.noResultsWarningContainer.classList.remove('d-none');
    }
    ui.searchBarInput.value = '';
    if (ui.sidebar.classList.contains('minimized') && !ui.categoryContainer.classList.contains('hidden')) {
        ui.categoryContainer.classList.add('hidden');
    }
    toggleClass(ui.sidebar, 'minimized');
    toggleClass(ui.searchBarStrip, 'maximized');
    toggleClass(ui.categoriesColumn, 'maximized');
    toggleClass(ui.closeSearchIcon, 'd-none');
    toggleClass(ui.sidebarReopenIcon, 'd-none');
    updateCategoriesContainerBigPadding(wait_resize = false);
    if (ui.categoryContainer.classList.contains('shaded')) {
        toggleFilterMobile();
    }
}


// Calculate #categories-column horizontal padding (responsiveness)
async function updateCategoriesContainerBigPadding(wait_resize = true) {
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
        ui.categoriesColumn.style.paddingLeft = `${ui.searchBarStripMaximizedPaddingLeft}px`;
        ui.categoriesColumn.style.paddingRight = `${ui.searchBarStripMaximizedPaddingLeft}px`;
    }
    else {
        if (wait_resize) {
            await wait(300);
        }
        if (window.matchMedia("(max-width: 767px)").matches) {
            ui.categoriesColumn.style.paddingLeft = '15px';
            ui.categoriesColumn.style.paddingRight = '15px';
        } else {
            ui.categoriesColumn.style.paddingLeft = `${ui.defaultPaddingRight}px`;
            ui.categoriesColumn.style.paddingRight = `${ui.defaultPaddingRight}px`;
        }
        var styles = window.getComputedStyle(ui.categoriesColumn);
        var categoriesColumnWidth = parseFloat(styles.getPropertyValue("width").trim());
        var categoriesColumnPaddingLeft = parseFloat(styles.getPropertyValue("padding-left").trim());
        var availableWidth = (
            categoriesColumnWidth
            - 2 * categoriesColumnPaddingLeft
            - 15.2
        );
        const totalWidth = ui.categoriesContainerBig.getBoundingClientRect().width - 15.2;
        var categoryCardWidth = ui.categoryCardWidthDesktop;
        if (window.matchMedia("(max-width: 767px)").matches) {
            var categoryCardWidth = ui.categoryCardWidthMobile;
        }
        const remainder = availableWidth % categoryCardWidth;
        var padding = remainder / 2;
        ui.categoriesContainerBig.style.paddingLeft = `${padding}px`;
        ui.categoriesContainerBig.style.paddingRight = `${padding}px`;
        ui.categoriesContainerSmall.style.display = 'block';
    }

    // Show / hide category cards
    if (ui.noResultsWarningContainer.classList.contains('d-none') && ui.categoryContainer.classList.contains('hidden')) {
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


function updateCategoryFilterContainer() {
    if (window.innerWidth < 1024) {
        ui.categoryFiltersBigContainer.classList.add('minimized-mobile');
        ui.categoryContainer.classList.remove('shaded');
    } else {
        ui.categoryFiltersBigContainer.classList.remove('minimized-mobile');
        ui.categoryContainer.classList.remove('shaded');
    }
}


function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}