let shoppingBasket = [];
let heroes = [];
let price = (0).toFixed(2);

class requestsHTTP {
    async get(url) {
        const response = await fetch(url);
        const resData = await response.json();

        return resData;
    }

    async post(url, data) {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const resData = await response;

        return resData;
    }

    async put(url, data) {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const resData = await response.json();

        return resData;
    }

    async delete(url) {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json'
            }
        });

        const resData = await 'Resource deleted';
        return resData;
    }
}

class Store {
    static getHeroes() {
        const http = new requestsHTTP;

        http.get("http://localhost:3000/heroes").then(res => {
            if (res != null) {
                heroes = res;
                UI.displayHeroes(document.querySelector('.heroesList'));
                UI.createModal();
            }
        }).catch(err => console.log(err));
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

    static addAndEditHero(name, description, image, price, isAvailable, typeRequest, link) {
        
        if(document.getElementById('loader') != null){
            document.getElementById('loader').classList.add("showLoader");
        }

        if (name === '' || description === '' || image === '' || price == '') {
            document.getElementById('dangerFill').classList.add("dangerFill");
            document.getElementById('loader').classList.remove('showLoader');
        } else {
            let hero = {
                name,
                description,
                image,
                price,
                isAvailable
            }
            
            const http = new requestsHTTP;
            if (typeRequest === "POST") {
                const found = heroes.some((hero) => {
                    return hero.name === name;
                });

                if (!found) {
                    http.post(link, hero).then(() => {
                        console.log('Bohater dodany !')}).catch(error => console.log(error));
                        document.getElementById('loader').classList.remove('showLoader');
                } else {
                    document.getElementById('dangerHero').classList.add("dangerHero");
                    document.getElementById('loader').classList.remove('showLoader');
                }
            } else if (typeRequest === "PUT") {
                http.put(link, hero).then(res => console.log(res)).catch(error => console.log(error));
                UI.generateSelectHeroes(document.querySelector('.selectHero'));
            }
        }
    }

    static addHeroToBasketList(hero) {
        shoppingBasket.push(hero);
        price = price + parseFloat(hero.price);
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
            const item = document.createElement('div');

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

    static displayHeroesBasket() {
        if (document.querySelector('.heroesInBasket') == null) {
            return 0;
        }

        const elements = document.getElementsByClassName('heroInBasket');

        while (elements[0]) {
            elements[0].parentNode.removeChild(elements[0]);
        }

        shoppingBasket.forEach((hero, index) => {
            const div = document.createElement('div');
            div.className = 'heroInBasket';

            let output = `
                <img src="${hero.image}" alt="${hero.name}">
                <div class="heroInfo">
                    <h4>${hero.name}</h4>
                    <p class="heroInfo__text">${hero.description.slice(0, 100)}...</p>
                    <button class="heroInBasket__delete" data-name="${hero.name}" data-index="${index}">Usuń z koszyka<span>&times;</span></button>
                </div>`;

            div.innerHTML = output;
            const container = document.querySelector('.heroesInBasket');
            div.innerHTML = output;
            container.appendChild(div);
        });

        if (shoppingBasket.length == 0 && document.querySelector('.shoppingBasket__state') != null) {
            document.querySelector('.shoppingBasket__state').textContent = 'Twój koszyk jest pusty.';
            document.getElementById('heroesCost').textContent = `${parseFloat(price).toFixed(2)} zł`;
            document.getElementById('heroesCost').classList.add('heroesCostNull');
        } else if (shoppingBasket.length > 0 && document.querySelector('.shoppingBasket__state') != null) {
            price = 0;
            document.querySelector('.shoppingBasket__state').textContent = '';
            shoppingBasket.forEach(hero => {
                price = price + parseInt(hero.price);
            });
            document.getElementById('heroesCost').textContent = `${parseFloat(price).toFixed(2)} zł`;
        }
    }

    static deleteModal() {
        document.querySelector(".heroesList__hero-modal-content").setAttribute("data-name", '');
        document.getElementById("heroesList__hero-modal-img").setAttribute('src', '');
        document.getElementById("heroesList__hero-modal-img").setAttribute('alt', '');
        document.querySelector(".heroesList__hero-modal-contentContainer h1").textContent = `I'm `;
        document.querySelector(".heroesList__hero-modal-contentContainer p").textContent = ``;
        document.querySelector(".heroesList__hero-modal-price").textContent = `Wynajem: zl/h`;
        document.querySelector(".heroesList__hero-modal-button").setAttribute("data-name", '');
        document.getElementById('modalHero').classList.remove("show-modal");
    }

    static createModal() {

        if(document.querySelector('.heroesList') == null){
            return;
        }
        
        const container = document.querySelector('.heroesList');
        const div = document.createElement('div');
        div.className = `heroesList__hero-modal`;
        div.id = "modalHero";

        let output = `
                        <div class="heroesList__hero-modal-content" data-name="" >
                            <span class="modal__close-button">&times;</span>
                            <img src="" alt="" id="heroesList__hero-modal-img">
                            <div class="heroesList__hero-modal-contentContainer">
                                <h1></h1>
                                <span class="heroesList__hero-modal-line"></span>
                                <p></p>
                                <p class="heroesList__hero-modal-price"></p>
                                <button class="heroesList__hero-modal-button"  data-name="">Dodaj do koszyka</button>
                            </div>
                        </div>`;


        div.innerHTML = output;
        container.appendChild(div);
    }

    static showModal(hero) {
        document.querySelector(".heroesList__hero-modal-content").setAttribute("data-name", hero.name);
        document.getElementById("heroesList__hero-modal-img").setAttribute('src', hero.image);
        document.getElementById("heroesList__hero-modal-img").setAttribute('alt', hero.name);
        document.querySelector(".heroesList__hero-modal-contentContainer h1").textContent = `I'm ${hero.name}`;
        document.querySelector(".heroesList__hero-modal-contentContainer p").textContent = `${hero.description}`;
        document.querySelector(".heroesList__hero-modal-price").textContent = `Wynajem: ${hero.price}zl/h`;
        document.querySelector(".heroesList__hero-modal-button").setAttribute("data-name", hero.name);
        document.querySelector('.heroesList__hero-modal').classList.add('show-modal');
    }

    static heroMessage(msg) {
        const div = document.createElement('div');
        const container = document.querySelector('.heroesList__hero-modal-contentContainer');

        div.className = `heroesList__hero-modal-borrowed`;
        div.appendChild(document.createTextNode(msg));
        container.appendChild(div);

        setTimeout(() => {
            if (document.querySelector('.heroesList__hero-modal-borrowed') != null) {
                document.querySelector('.heroesList__hero-modal-borrowed').remove();
            }
        }, 3000);
    }

    static removeHeroDivFromBasket(target) {
        target.parentNode.remove();
    }

    static getHeroData(target, selectHero) {
        if (target == null) {
            return;
        }

        const http = new requestsHTTP;
        http.get(`http://localhost:3000/heroes/${selectHero}`).then(data => {
            console.log(data);
            document.getElementById('pathImg_hero').value = data.image;
            document.getElementById('price_hero').value = data.price;
            document.getElementById('description_hero').value = data.description;
        }).catch(error => console.log(error));
    }

    static generateOptionsUI() {
        const http = new requestsHTTP;
        const newList = document.createElement('ul');
        const container = document.querySelector('.form__control-input');
        const select = document.querySelector('.selectHero');

        newList.className = "selectHeroList";

        http.get("http://localhost:3000/heroes").then(data => {

            data.forEach(hero => {
                const li = document.createElement('li');
                li.className = 'li-item';
                li.setAttribute('data-name', hero.name);
                li.appendChild(document.createTextNode(hero.name))
                newList.appendChild(li);
            });

            container.insertBefore(newList, select);
        }).catch(err => console.log(err));
    }

    static generateSelectHeroes(target) {
        if (target == null) {
            return;
        }

        const http = new requestsHTTP;

        http.get("http://localhost:3000/heroes").then(data => {
            const select = document.querySelector('.selectHero');

            data.forEach(hero => {
                const option = document.createElement('option');
                option.setAttribute('value', hero.name);
                option.text = hero.name;
                select.appendChild(option);
            });
        }).catch(err => console.log(err));
    }
}


document.addEventListener('DOMContentLoaded', (e) => {
    Store.getHeroes();
    shoppingBasket = Store.getBasket();

    const toggle = document.querySelector('.main-nav_toggle-label');

    UI.displayHeroesBasket();
    UI.generateSelectHeroes(document.querySelector('.selectHero'));

    document.addEventListener('click', (e) => {     
        if(e.target && e.target.className === `heroesList__hero-modal-button`){
            const nameHero = e.target.getAttribute("data-name");

            const found = shoppingBasket.some((el) => {
                return el.name === nameHero;
            });
            
            if (!found) {
                const http = new requestsHTTP;
                
                http.get(`http://localhost:3000/heroes/${nameHero}`).then(res => {
                    Store.addHeroToBasketList(res);
                    UI.displayHeroesBasket();
                    document.getElementById('heroesCost').classList.remove('heroesCostNull');
                }).catch(err => console.log(err));
            } else {
                UI.heroMessage('Bohater znajduje sie w koszuku');
            }
        }
    });

    document.addEventListener('click', (e) => {
        if (e.target.parentNode.className === 'heroesList__hero') {
            const hero = e.target.parentNode.getAttribute("data-name");
            const http = new requestsHTTP;

            http.get(`http://localhost:3000/heroes/${hero}`).then(res => {
                UI.showModal(res);
            }).catch(err => console.log(err));
        }
    });

    toggle.addEventListener('click', (e) => {
        toggle.classList.toggle('transformMenu');
    });

    document.addEventListener('click', (e) => {
        if (e.target.className === 'modal__close-button') {
            UI.deleteModal();
        }
    });

    document.addEventListener('click', (e) => {
        if (document.getElementById('editForm') != null || document.getElementById('addForm') != null) {
            let name;
            let description = document.getElementById('description_hero').value;
            let image = document.getElementById('pathImg_hero').value;
            let price = document.getElementById('price_hero').value;

            if (e.target && e.target.id == 'addHero') {
                name = document.getElementById('name_hero').value;
                Store.addAndEditHero(name, description, image, price, true, "POST", "http://localhost:3000/heroes");
                e.preventDefault();
            } else if (e.target && e.target.id == 'editHero') {
                name = document.getElementById('selectEditHero').value;
                Store.addAndEditHero(name, description, image, price, true, "PUT", `http://localhost:3000/heroes/${name}`);
            }
        }
    });

    document.addEventListener('click', (e) => {
        if (e.target && e.target.className === 'heroInBasket__delete') {
            Store.removeHeroFromBasket(e.target.getAttribute("data-name"), e.target.getAttribute("data-index"));
            UI.removeHeroDivFromBasket(e.target.parentNode);
        }
    });

    document.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'clearDatabase') {
            const http = new requestsHTTP;
            http.delete("http://localhost:3000/heroes").then(res => console.log('Baza bohaterów została wyczyszczona')).catch(err => console.log(err));
        }
    });

    document.addEventListener('click', (e) => {
        if (e.target && e.target.className === 'removeHero__button') {
            const http = new requestsHTTP;
            let select = document.getElementById('selectRemoveHero').value;

            http.delete(`http://localhost:3000/heroes/${select}`).then(res => {
                console.log('Bohater usunięty');
            }).catch(err => console.log(err));
        }
    });

    document.addEventListener('click', (e) => {
        if (e.target && e.target.className === 'arrow-select') {
            UI.generateOptionsUI();
        }
    });

    document.addEventListener('click', (e) => {
        if (e.target && e.target.className === 'li-item') {
            let selectHero;
            if (document.getElementById('selectEditHero')) {
                document.getElementById('selectEditHero').value = e.target.getAttribute('data-name');
                selectHero = document.getElementById('selectEditHero').value;
            } else if (document.getElementById('selectRemoveHero')) {
                document.getElementById('selectRemoveHero').value = e.target.getAttribute('data-name');
                selectHero = document.getElementById('selectRemoveHero').value;
            }
            document.querySelector('.li-item').parentNode.remove();


            if (selectHero != "Wybierz bohatera") {
                UI.getHeroData(document.getElementById('editForm'), selectHero);
            }
        }
    });
});