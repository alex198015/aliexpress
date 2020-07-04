document.addEventListener('DOMContentLoaded', () => {

    const search = document.querySelector('.search');
    const goodsWrapper = document.querySelector('.goods-wrapper');
    const cartBtn = document.getElementById('cart');
    const wishlistBtn = document.getElementById('wishlist');
    const cart = document.querySelector('.cart');
    const category = document.querySelector('.category');
    let cartCounter = cartBtn.querySelector('.counter')
    let wishlisCounter = wishlistBtn.querySelector('.counter')
    let cartWrapper = document.querySelector('.cart-wrapper')

    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    let goodsBasket = {}
  

    const loading = () => {
        goodsWrapper.innerHTML = `
            <div id="spinner"><div class="spinner-loading"><div><div><div></div>
            </div><div><div></div></div><div><div></div></div><div><div></div></div></div></div></div>
        `
    }

    const getGoods = (handler, filter) => {
        loading()
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
                                <button class="card-add-wishlist ${wishlist.includes(id) ? 'active' : ''}"
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
        checkCount()
        if(items.length){

            goodsWrapper.innerHTML = ''
            items.forEach(elem => {
                goodsWrapper.append(createCardGoods(elem))
            })

        }else{
                goodsWrapper.innerHTML = `<h4 style="color:red"> ❌ Извините по вашему запросу ничего не найдено!</h4>`
            }
       

    }

    // создаем корзину 
    
    const createCardBasket = ({ id,  title, price,imgMin }) => {
        
        
        const card = document.createElement('div');
        
        card.className = 'goods';

        card.innerHTML = `
                        <div class="goods-img-wrapper">
                        <img class="goods-img" src="${imgMin}" alt="">

                    </div>
                    <div class="goods-description">
                        <h2 class="goods-title">${title}</h2>
                        <p class="goods-price">${price} ₽</p>

                    </div>
                    <div class="goods-price-count">
                        <div class="goods-trigger">
                            <button class="goods-add-wishlist ${wishlist.includes(id) ? 'active' : ''}" 
                            data-goods-id="${id}"></button>
                            <button class="goods-delete" data-goods-id="${id}"></button>
                        </div>
                        <div class="goods-count">1</div>
                    </div>
                        `
                        
        return card;

    }

    const renderBasket = (items) => {
        checkCount()
        if(items.length){

            cartWrapper.innerHTML = ''
            items.forEach(elem => {
                cartWrapper.append(createCardBasket(elem))
            })

        }else{
            cartWrapper.innerHTML = `<div id="cart-empty"> Ваша корзина пока пуста</div>`
           
       
            }
       

    }

    const randomSort = items => items.sort(() => Math.random() - 0.5)


    const openCart = event => {
        event.preventDefault()
        cart.style.display = 'flex'
        document.addEventListener('keyup', closeCart)
        // getGoods(renderBasket, goods => goods.filter(item => Object.keys(goodsBasket).includes(item.id)))
        getGoods(renderBasket, goods => goods.filter(item => goodsBasket.hasOwnProperty(item.id)))
    }

    const closeCart = (e) => {
        let target = e.target


        if (target.closest('.cart-close') || target === cart || e.keyCode === 27)
            cart.style.display = 'none'
            location.reload()
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

    const searchGoods = event => {
        event.preventDefault()
        const input = event.target.elements.searchGoods
        const inputValue = input.value.trim()

        if(inputValue !== ''){
            const searchItem = new RegExp(inputValue, 'i')

            // getGoods(renderCard, goods => goods.filter(item => item.title.match(searchItem)))
            getGoods(renderCard, goods => goods.filter(item => searchItem.test(item.title)))
            // getGoods(renderCard, goods => goods.filter(item => item.title.toLowerCase().includes(inputValue.toLowerCase())))
        }else{
            search.classList.add('error')
            setTimeout(() => {
                search.classList.remove('error')
            },2000)
            
        }
        
        input.value = ''
    }


    const getCookie = name => {
        let matches = document.cookie.match(new RegExp(
          "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
      }

    const cookieQuery = get => {
        if(get){
            goodsBasket = JSON.parse(getCookie('goodsBasket'))
        }else{
            document.cookie = `goodsBasket=${JSON.stringify(goodsBasket)}; max-age=86400e3`
        }
        console.log(goodsBasket);
        
    }

    const checkCount = () => {
        wishlisCounter.textContent = wishlist.length
        cartCounter.textContent = Object.keys(goodsBasket).reduce((total, key) => total + goodsBasket[key], 0 )
        // cartCounter.textContent = Object.keys(goodsBasket).length
    }

    const storageQuery = () => {
        localStorage.setItem('wishlist', JSON.stringify(wishlist))
    }

    const toggleWishlist = (id, elem) => {

        if(!(wishlist.indexOf(id) + 1)){
            wishlist.push(id)
            elem.classList.add('active')
           
        }else{
            wishlist.splice(wishlist.indexOf(id),1) 
            elem.classList.remove('active')
            
        }
        
        checkCount()
        storageQuery()
       
    }

    const addBasket = (id) => {
        if(goodsBasket[id]){
            goodsBasket[id] += 1
        }else{
            goodsBasket[id] = 1
        }
        checkCount()
        cookieQuery()
        
    }

    const handlerGoods = (event) => {
        const target = event.target
        if(target.matches('.card-add-wishlist')){

            toggleWishlist(target.dataset.goodsId, target)
           
        }
        if(target.classList.contains('card-add-cart')){
            addBasket(target.dataset.goodsId)
        }
    }

    const showWishList = () => {
        getGoods(renderCard, goods => goods.filter(item => wishlist.includes(item.id)))
        
    
    }
    

    cartBtn.addEventListener('click', openCart)
    cart.addEventListener('click', closeCart)
    category.addEventListener('click', chooseCategory)
    search.addEventListener('submit', searchGoods)
    goodsWrapper.addEventListener('click', handlerGoods )
    wishlistBtn.addEventListener('click', showWishList)

    getGoods(renderCard, randomSort)
    cookieQuery(true)

})