var heroes = [
    {
        name: 'Superman',
        description: '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        image: './images/superman.jpg',
        price: 3500,
        isAvailable: true
    },
    {
        name: 'Hulk',
        description: '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        image: './images/superman.jpg',
        price: 25000,
        isAvailable: true
    },
    {
        name: 'Thor',
        description: '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        image: './images/superman.jpg',
        price: 550000,
        isAvailable: true
    },
    {
        name: 'Ironman',
        description: '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        image: './images/superman.jpg',
        price: 750000,
        isAvailable: true
    },
    {
        name: 'Potter',
        description: '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        image: './images/superman.jpg',
        price: 125000,
        isAvailable: true
    },
    {
        name: 'Batman',
        description: '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        image: './images/superman.jpg',
        price: 200000,
        isAvailable: true
    }
]


class UI {
    static displayHeroes(target) {
        let count = 0;
        heroes.forEach(hero => {
            target.innerHTML += `<div class="heroesList__hero" data-hero="${count}">
                <img src="${hero.image}" src="${hero.name}"/>
                <h2>${hero.name}</h2>
                <p>Cena wynajmu: ${hero.price} zl/h</p>
            </div>`;

            count++;
        });
    }

    static deleteModal(){
        document.querySelector('.heroesList__hero-modal').remove();
    }

    static createModal(hero) {

        if(document.querySelector('.heroesList__hero-modal')){
            return 0;
        }

        const div = document.createElement('div');
        const container = document.querySelector('.heroesList__hero');

        div.className = `heroesList__hero-modal show-modal`;

        var output = `
            <div class="heroesList__hero-modal-content">
                <span class="close-button">&times;</span>
                <img src="${hero.image}" alt="${hero.name}">
                <div class="heroesList__hero-modal-contentContainer">
                    <h1>I'm ${hero.name}</h1>
                    <span class="heroesList__hero-modal-line"></span>
                    <p>${hero.description}</p>
                    <p class="heroesList__hero-modal-price">Wynajem: ${hero.price} zl/h</p>
                    <button class="heroesList__hero-modal-button">Dodaj do koszyka</button>
                </div>
            </div>`;

            
        div.innerHTML = output;
        container.appendChild(div);
    }
}

document.addEventListener('DOMContentLoaded', (e) => {

    let toggle = document.querySelector('.main-nav_toggle-label');
    let heroesContainer = document.querySelector('.heroesList');

    UI.displayHeroes(heroesContainer);

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('transformMenu');
    });

    heroesContainer.addEventListener('click', (e) => {
          UI.createModal(heroes[e.target.parentNode.getAttribute("data-hero")]);
    });

    document.addEventListener('click', (e) => {
        if(e.target.className === 'close-button'){
            UI.deleteModal();
        }
    })
});