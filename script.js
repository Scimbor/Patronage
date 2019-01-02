let shoppingBasket = [];
let heroes = [];
var price = 0.00;

class Store {
    static getHeroes() {
        let heroesArray;
        if (localStorage.getItem('heroes') === null) {
            heroesArray = [];
            heroesArray = basicHeroes;

            localStorage.setItem('heroes', JSON.stringify(heroesArray));
        } else {
            heroesArray = JSON.parse(localStorage.getItem('heroes'));
        }
        return heroesArray;
    }

    static getBasket() {
        let basketArray;
        if (localStorage.getItem('heroesBasket') === null) {
            basketArray = [];
        } else {
            basketArray = JSON.parse(localStorage.getItem('heroesBasket'));
        }

        return basketArray;
    }

    static addHeroToList(name, description, image, price, isAvailable = true) {
        if (name === '' || description === '' || image === '' || price == '') {
            document.getElementById('dangerFill').style.opacity = '1';
        } else {
            var hero = {
                name,
                description,
                image,
                price,
                isAvailable
            }

            heroes.unshift(hero);
            localStorage.setItem('heroes', JSON.stringify(heroes));
        }
    }

    static addHeroToBasketList(index) {
        shoppingBasket.push(heroes[index]);
        price = price + parseFloat(heroes[index].price);
        document.querySelector('.shoppingBasket__state').textContent = '';
        document.getElementById('heroesCost').textContent = price;
        localStorage.setItem('heroesBasket', JSON.stringify(shoppingBasket));
    }

    static removeHeroFromBasket(nameHero, indexHero) {
        shoppingBasket.some((hero) => {
            if (hero.name == nameHero) {
                shoppingBasket.splice(indexHero, 1);
                price = price - hero.price;
                document.getElementById('heroesCost').textContent = price;
                if (price == 0 || shoppingBasket.length == 0) {
                    document.querySelector('.shoppingBasket__state').textContent = 'Twój koszyk jest pusty.';
                    localStorage.removeItem('heroesBasket');
                }
            }
        });
        UI.displayHeroesBasket();
        localStorage.setItem('heroesBasket', JSON.stringify(shoppingBasket));
    }
}

class UI {
    static displayHeroes(target) {
        if (target == null) {
            return 0;
        }
        heroes.forEach((hero, index) => {
            let item = document.createElement('div');

            item.className = 'heroesList__hero';
            item.setAttribute('data-index', index);
            item.setAttribute('data-name', hero.name);

            item.innerHTML = `                
                <img src="${hero.image}" src="${hero.name}" class="heroesList__hero-img"/>
                <h2>${hero.name}</h2>
                <p>Cena wynajmu: ${hero.price} zl/h</p>`;

            target.appendChild(item);
        });
    }

    static displayHeroesBasket(target) {
        if (target == null) {
            return 0;
        }
        var elements = document.getElementsByClassName('heroInBasket');

        while (elements[0]) {
            elements[0].parentNode.removeChild(elements[0]);
        }

        shoppingBasket.forEach((hero, index) => {
            const div = document.createElement('div');
            div.className = 'heroInBasket';

            var output = `
                <img src="${hero.image}" alt="${hero.name}">
                <div class="heroInfo">
                    <h4>${hero.name}</h4>
                    <p class="heroInfo__text">${hero.description.slice(1, 100)}...</p>
                    <button class="heroInBasket__delete" data-name="${hero.name}" data-index="${index}">Usuń z koszyka<span>&times;</span></button>
                </div>`;

            div.innerHTML = output;
            const container = target;
            div.innerHTML = output;
            container.appendChild(div);
        });

        if (shoppingBasket.length == 0 && document.querySelector('.shoppingBasket__state') != null) {
            document.querySelector('.shoppingBasket__state').textContent = 'Twój koszyk jest pusty.';
            document.getElementById('heroesCost').textContent = price.toString();
        } else if(shoppingBasket.length > 0 && document.querySelector('.shoppingBasket__state') != null){
            price = 0;
            document.querySelector('.shoppingBasket__state').textContent = '';
            shoppingBasket.forEach(hero => {
                price = price + parseInt(hero.price);
            });
            document.getElementById('heroesCost').textContent = price;
        }
    }

    static deleteModal() {
        document.querySelector('.heroesList__hero-modal').remove();
    }

    static createModal(nameHero, index) {

        if (document.querySelector('.heroesList__hero-modal')) {
            return 0;
        }

        const div = document.createElement('div');
        const container = document.querySelector('.heroesList__hero');

        div.className = `heroesList__hero-modal show-modal`;

        var output = `
            <div class="heroesList__hero-modal-content">
                <span class="modal__close-button">&times;</span>
                <img src="${heroes[index].image}" alt="${heroes[index].name}">
                <div class="heroesList__hero-modal-contentContainer">
                    <h1>I'm ${heroes[index].name}</h1>
                    <span class="heroesList__hero-modal-line"></span>
                    <p>${heroes[index].description}</p>
                    <p class="heroesList__hero-modal-price">Wynajem: ${heroes[index].price} zl/h</p>
                    <button class="heroesList__hero-modal-button"  data-name="${heroes[index].name}" data-index="${index}">Dodaj do koszyka</button>
                </div>
            </div>`;


        div.innerHTML = output;
        container.appendChild(div);

        let heroButtton = document.querySelector('.heroesList__hero-modal-button');

        heroButtton.addEventListener('click', (e) => {
            let found = shoppingBasket.some((el) => {
                return el.name === nameHero;
            });
            if (!found) {
                Store.addHeroToBasketList(index);
                UI.displayHeroesBasket();
            }else{
                UI.heroMessage('Bohater znajduje sie w koszuku');
            }
        });
    }

    static heroMessage(msg) {
        const div = document.createElement('div');
        const container = document.querySelector('.heroesList__hero-modal-contentContainer');

        div.className = `heroesList__hero-modal-borrowed`;
        div.appendChild(document.createTextNode(msg));  
        container.appendChild(div);

        setTimeout(function () {
            if (document.querySelector('.heroesList__hero-modal-borrowed') != null) {
                document.querySelector('.heroesList__hero-modal-borrowed').remove();
            }
        }, 3000);
    }

    static removeHeroDivFromBasket(target) {
        target.parentNode.remove();
    }
}


document.addEventListener('DOMContentLoaded', (e) => {
    heroes = Store.getHeroes();
    shoppingBasket = Store.getBasket();

    let heroesContainer = document.querySelector('.heroesList');
    let toggle = document.querySelector('.main-nav_toggle-label');
    let heroesBasketList = document.querySelector('.heroesInBasket');

    UI.displayHeroes(heroesContainer);
    UI.displayHeroesBasket(heroesBasketList);

    if (heroesContainer != null) {
        heroesContainer.addEventListener('click', (e) => {
            UI.createModal(e.target.parentNode.getAttribute("data-name"), e.target.parentNode.getAttribute("data-index"));
        });
    }

    toggle.addEventListener('click', (e) => {
        toggle.classList.toggle('transformMenu');
    });

    document.addEventListener('click', (e) => {
        if (e.target.className === 'modal__close-button') {
            UI.deleteModal();
        }
    });

    document.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'addHero') {
            let name = document.getElementById('name_hero').value;
            let description = document.getElementById('description_hero').value;
            let image = document.getElementById('pathImg_hero').value;
            let price = document.getElementById('price_hero').value;

            Store.addHeroToList(name, description, image, price);
            e.preventDefault();
        }
    });

    document.addEventListener('click', (e) => {
        if (e.target && e.target.className === 'heroInBasket__delete') {
            Store.removeHeroFromBasket(e.target.getAttribute("data-name"), e.target.getAttribute("data-index"));
            UI.removeHeroDivFromBasket(e.target.parentNode);
        }
    });
});

let basicHeroes = [
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
];