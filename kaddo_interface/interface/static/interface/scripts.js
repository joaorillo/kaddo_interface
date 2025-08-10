document.addEventListener('DOMContentLoaded', () => {
    var aisles_names = document.querySelectorAll('.aisle-name');
    aisles_names.forEach((aisle) => {
        var aisle_name = aisle.innerHTML;
        aisle.addEventListener('click', () => {
            console.log(`scroll_aisle(${aisle_name})`);
            scroll_aisle(aisle_name);
        })
    })
})


function scroll_aisle(aisle_name) {
    var selected_aisle = document.querySelector('.aisle-name.selected');
    if (selected_aisle){
        selected_aisle.classList.remove('selected');
    }
    var clicked_aisle = Array.from(document.querySelectorAll('.aisle-name'))
        .find(el => el.innerHTML.trim() === aisle_name);
    if (clicked_aisle) {
        clicked_aisle.classList.add('selected');
    }
}