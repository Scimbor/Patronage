document.addEventListener('DOMContentLoaded', (e) => {
    console.log('Animations ready !');

    var toggle = document.querySelector('.main-nav_toggle-label');

    toggle.addEventListener('click', (e) => {
        var element = document.querySelector('.main-nav_toggle-label');

        element.classList.toggle('transformMenu');
    });
});