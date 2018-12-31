var shoppingBasket = [];
var heroes;

class Store {
    static getBooks() {
        if (localStorage.getItem('heroes') === null) {
            heroes = [];
        } else {
            heroes = JSON.parse(localStorage.getItem('heroes'));
        }

        return heroes;
    }

    static addHeroToList(name, descripion, image, price, isAvailable = true) {
        if (name === '' || descripion === '' || image === '' || price == '') {
            document.getElementById('dangerFill').style.opacity = '1';
        } else {
            var hero = {
                name,
                descripion,
                image,
                price,
                isAvailable
            }

            heroes.unshift(hero);
            localStorage.setItem('heroes', JSON.stringify(heroes));
            console.log(heroes);
        }
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
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
            item.setAttribute('data-hero', index);

            item.innerHTML = `                
                <img src="${hero.image}" src="${hero.name}" class="heroesList__hero-img"/>
                <h2>${hero.name}</h2>
                <p>Cena wynajmu: ${hero.price} zl/h</p>`;

            target.appendChild(item);
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
            UI.addHeroToBasket(index);
        });
    }

    static addHeroToBasket(index) {
        const div = document.createElement('div');
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
    heroes = Store.getBooks();
    let heroesContainer = document.querySelector('.heroesList');
    let toggle = document.querySelector('.main-nav_toggle-label');
    
    UI.displayHeroes(heroesContainer);
    
    if (heroesContainer != null) {
        heroesContainer.addEventListener('click', (e) => {
            UI.createModal(e.target.parentNode.getAttribute("data-hero"));
        });
    }

    toggle.addEventListener('click', (e) => {
        toggle.classList.toggle('transformMenu');
    });

    document.addEventListener('click', (e) => {
        if (e.target.className === 'close-button') {
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
});
