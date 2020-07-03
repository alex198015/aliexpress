document.addEventListener('DOMContentLoaded', () => {

    const search = document.querySelector('.search');
    const goodsWrapper = document.querySelector('.goods-wrapper');
    const cartBtn = document.getElementById('cart');
    const wishlistBtn = document.getElementById('wishlist');
    const cart = document.querySelector('.cart');
    const category = document.querySelector('.category');


    const getGoods = (handler, filter) => {
        fetch('./db/db.json')
            .then(res => res.json())
            .then(filter)
            .then(handler)

    }


    const createCardGoods = ({ id,  title, price,imgMin }) => {
        
        
        const card = document.createElement('div');
        
        card.className = 'card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3';

        card.innerHTML = `
                        <div class="card">
                        	<div class="card-img-wrapper">
                        		<img class="card-img-top" src="${imgMin}" alt="">
                                <button class="card-add-wishlist"
                                data-goods-id="${id}"></button>
                        	</div>
                        	<div class="card-body justify-content-between">
                        		<a href="#" class="card-title">${title}</a>
                        		<div class="card-price">${price} ₽</div>
                        		<div>
                                    <button class="card-add-cart"
                                    data-goods-id="${id}">Добавить в корзину</button>
                        		</div>
                        	</div>
                        </div>
                        `
                        
        return card;

    }

    const renderCard = (items) => {
        goodsWrapper.innerHTML = ''
        items.forEach(elem => {
            goodsWrapper.append(createCardGoods(elem))
        });

    }

    const randomSort = items => items.sort(() => Math.random() - 0.5)


    const openCart = event => {
        event.preventDefault()
        cart.style.display = 'flex'
        document.addEventListener('keyup', closeCart)
    }

    const closeCart = (e) => {
        let target = e.target


        if (target.closest('.cart-close') || target === cart || e.keyCode === 27)
            cart.style.display = 'none'
        if (e.keyCode === 27) {
            document.removeEventListener('keyup', closeCart)
        }

    }

    const chooseCategory = (event) => {
        event.preventDefault()
        const target = event.target


        if (target.classList.contains('category-item')) {
            const category = target.dataset['category'];

            getGoods(renderCard, goods => goods.filter(item => item.category.includes(category)))
           
        }

    }

    cartBtn.addEventListener('click', openCart)
    cart.addEventListener('click', closeCart)
    category.addEventListener('click', chooseCategory)

    getGoods(renderCard, randomSort)

})