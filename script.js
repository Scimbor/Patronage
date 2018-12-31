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
        image: './images/hulk.jpg',
        price: 25000,
        isAvailable: true
    },
    {
        name: 'Thor',
        description: '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        image: './images/thor.jpg',
        price: 550000,
        isAvailable: true
    },
    {
        name: 'Ironman',
        description: '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        image: './images/ironman.jpg',
        price: 750000,
        isAvailable: true
    },
    {
        name: 'Potter',
        description: '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        image: './images/potter.jpg',
        price: 125000,
        isAvailable: true
    },
    {
        name: 'Batman',
        description: '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        image: './images/batman.jpg',
        price: 200000,
        isAvailable: true
    }
]

var shoppingBasket = [];

class Store {
    static addHeroToList(name, descripion, image, price, isAvailable = true){
        if(name === '' || descripion === '' || image === '' || price == ''){
            document.getElementById('dangerFill').style.opacity = '1';
        }else{

        }
    }
}

class UI {
    static displayHeroes(target) {
        let count = 0;

        if (target == null) {
            return 0;
        }

        heroes.forEach(hero => {
            target.innerHTML += `<div class="heroesList__hero" data-hero="${count}">
                <img src="${hero.image}" src="${hero.name}" class="heroesList__hero-img"/>
                <h2>${hero.name}</h2>
                <p>Cena wynajmu: ${hero.price} zl/h</p>
            </div>`;

            count++;
        });
    }

    static deleteModal() {
        document.querySelector('.heroesList__hero-modal').remove();
    }
 
    static createModal(index) {

        if (document.querySelector('.heroesList__hero-modal')) {
            return 0;
        }

        const div = document.createElement('div');
        const container = document.querySelector('.heroesList__hero');

        div.className = `heroesList__hero-modal show-modal`;

        var output = `
            <div class="heroesList__hero-modal-content">
                <span class="close-button">&times;</span>
                <img src="${heroes[index].image}" alt="${heroes[index].name}">
                <div class="heroesList__hero-modal-contentContainer">
                    <h1>I'm ${heroes[index].name}</h1>
                    <span class="heroesList__hero-modal-line"></span>
                    <p>${heroes[index].description}</p>
                    <p class="heroesList__hero-modal-price">Wynajem: ${heroes[index].price} zl/h</p>
                    <button class="heroesList__hero-modal-button" data-hero="${index}">Dodaj do koszyka</button>
                </div>
            </div>`;


        div.innerHTML = output;
        container.appendChild(div);

        let heroButtton = document.querySelector('.heroesList__hero-modal-button');

        heroButtton.addEventListener('click', (e) => {
            console.log(heroes[index]);
            UI.addHeroToBasket(index);
        });
    }
 
    static addHeroToBasket(index){
        const div  = document.createElement('div');
        div.className = 'heroInBasket';

        var output = `<img src="${heroes[index].image}" alt="${heroes[index].name}">
        <div class="heroInfo">
            <h4>${heroes[index].name}</h4>
            <p class="heroInfo__text">${(heroes[index].description).split(',')[0]}</p>
            <button class="heroInBasket__delete" data-hero="${index}">Usuń z koszyka<span>&times;</span></button>
        </div>`;

        div.innerHTML = output;
        const container = document.querySelector('.heroesInBasket');
        div.innerHTML = output;
        container.appendChild(div);
    }

}


document.addEventListener('DOMContentLoaded', (e) => {

    let toggle = document.querySelector('.main-nav_toggle-label');
    let heroesContainer = document.querySelector('.heroesList');

    if (heroesContainer != null) {
        heroesContainer.addEventListener('click', (e) => {
            UI.createModal(e.target.parentNode.getAttribute("data-hero"));
        });
    }

    UI.displayHeroes(heroesContainer);

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('transformMenu');
    });

    document.addEventListener('click', (e) => {
        if (e.target.className === 'close-button') {
            UI.deleteModal();
        }
    });

    document.addEventListener('click', (e) => {
        if(e.target && e.target.id === 'addHero'){
            let name = document.getElementById('name_hero').value;
            let description = document.getElementById('description_hero').value;
            let image = document.getElementById('pathImg_hero').value;
            let price = document.getElementById('price_hero').value;
            //console.log(`Name: ${name}\nDescription: ${description}\nPath to Image: ${image}\nPrice: ${price}`);
            Store.addHeroToList(name, description, image, price);
        }

        e.preventDefault();
     });
});
