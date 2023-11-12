import { To } from 'copy-webpack-plugin';
import {Component} from '../Abstract/Component';
import { TGood, TGoodBasket, TServices, Total} from "../Abstract/Types";
import { CartBasket } from '../Common/CartBasket';
export class CartPage extends Component {
    divBasket!: Component;
    divBasketClear!: Component;
    galer!: Component;
    delivery!: Component;
    constructor(parrent: HTMLElement, private services: TServices){
    super(parrent, 'div', ["basket_pages"]);
    const cont = new Component(this.root, 'div', ['container']);
    services.dbService.getDataUser(services.authService.user).then(()=>{
    services.dbService.calcTotal();
    new Component(cont.root, 'h1', ['cart_title'],'Корзина');
    let isBasketClear = false;
    if(services.dbService.dataUser){
        if(services.dbService.dataUser.basket.length > 0) isBasketClear = true;
    }
    this.divBasketClear = new Component(cont.root, 'p', ['cleanb'],"<br>Здесь пока пусто ¯\_(ツ)_/¯");
    new Component(this.divBasketClear.root, "a", ['bbtn'], "На главную", ['href'], ['#']);
    this.divBasket =  new Component(cont.root, 'div', ['basket__goods']);
    this.galer = new Component(this.divBasket.root, "div", ['galer'] );
    this.toggleBasket(isBasketClear);

    if (services.dbService.dataUser) {
        services.dbService.dataUser.basket.forEach(el => {
            this.putGoodsInBasket(this.galer, el);
        })
    }
        this.delivery = new Component(this.divBasket.root, 'div', ["delivery"]);
        new Component(this.delivery.root, 'h1', null,'Доставка');
        new Component(this.delivery.root, "input", ['dlfield'], '', ['placeholder','data'], [' Имя','Name']);
        new Component(this.delivery.root, "input", ['dlfield'], '', ['placeholder','data'], [' Телефон','Phone']);
        new Component(this.delivery.root, "input", ['dlfield'], '', ['placeholder','data'], [' Адрес','Address']);
        const deliveryCheckboxCourier = new Component(this.delivery.root, "input", ['checking'], null ,["type","data","value"], ["checkbox","dl","courier"]).root as HTMLInputElement;
        deliveryCheckboxCourier.checked = false;
        deliveryCheckboxCourier.addEventListener('change', () => {
            if (deliveryCheckboxCourier.checked) {
                deliveryCheckboxSelfPickup.checked = false;
                this.services.dbService.orderTotals.total += 15;
                updateTotal();
            } else {
                this.services.dbService.orderTotals.total -= 15;
                updateTotal();
            }
        });


       

       
        new Component(this.delivery.root, "p", ['dtext'] , 'Доставка курьером - 15 руб.');
        new Component(this.delivery.root, "br");
        const deliveryCheckboxSelfPickup = new Component(this.delivery.root, "input", ['checking'], null ,["type","data","value"], ["checkbox","dl","self-pickup"]).root as HTMLInputElement;
        deliveryCheckboxSelfPickup.checked = false;
        new Component(this.delivery.root, "p", ['dtext'] , 'Самовывоз - 0 руб.');
        const sum = new Component (this.delivery.root, "h3", ['off'], 'Сумма ' + this.services.dbService.orderTotals.summ + ' руб');   
        const per = new Component (this.delivery.root, "h3", ['off'], 'Скидка ' + this.services.dbService.orderTotals.percent + '%');
        const final = new Component(this.delivery.root, "div", ['final'] , '');
        new Component (final.root, "h3", null, 'Итого');
        let tot = new Component(final.root, "h3", null, this.services.dbService.orderTotals.total + ' рублей');
        const order = new Component (this.delivery.root, "div", ["btnorder"], "Оформить заказ");
        
        const updateTotal = () => {
            tot.root.innerHTML = this.services.dbService.orderTotals.total + ' рублей';
        }

        order.root.onclick = () => {
            const user = services.authService.user;

            const nameField = document.querySelector<HTMLInputElement>('input[data="Name"]');
            const phoneField = document.querySelector<HTMLInputElement>('input[data="Phone"]');
            const addressField = document.querySelector<HTMLInputElement>('input[data="Address"]');
            if (!nameField || !phoneField || !addressField || !nameField.value || !phoneField.value || !addressField.value) {
                alert('Заполните информацию для доставки');
                return;
            }

            services.dbService.addBasketInHistory(user);
            alert('Заказ успешно оформлен!');
        }

        deliveryCheckboxSelfPickup.addEventListener('change', () => {
            if (deliveryCheckboxSelfPickup.checked && deliveryCheckboxCourier.checked) {
                deliveryCheckboxCourier.checked = false;
                this.services.dbService.orderTotals.total -= 15;
                updateTotal();
            } else {
                updateTotal();
            }
        });


        services.dbService.addListener('updateBasketCount', () => {
            sum.root.innerHTML = 'Сумма ' + this.services.dbService.orderTotals.summ + ' рублей';
            tot.root.innerHTML = this.services.dbService.orderTotals.total.toString() + ' рублей';
            per.root.innerHTML = 'Скидка ' + this.services.dbService.orderTotals.percent.toString() + '%';
            isBasketClear = false;
            if(services.dbService.dataUser){
                if(services.dbService.dataUser.basket.length > 0) isBasketClear = true;
            }
            this.toggleBasket(isBasketClear);
            if(deliveryCheckboxCourier.checked){
                deliveryCheckboxSelfPickup.checked = false;
                this.services.dbService.orderTotals.total += 15;
                updateTotal();
            }
        });
        
        });

        services.dbService.addListener('clearBasket', () => {
            this.galer.root.innerHTML = "";
            this.toggleBasket(false);
        });

        
        services.dbService.addListener('goodInBasket', (good) => {
            this.putGoodsInBasket(this.galer, good as TGoodBasket);
            this.toggleBasket(true);
        });
        }

    
    putGoodsInBasket(tag: Component, product: TGoodBasket) {
     new CartBasket(tag.root, this.services, product);
    }

    toggleBasket(isBasketClear: boolean) {
        if (isBasketClear) {
            if (this.divBasket) {
                this.divBasketClear.remove();
                this.divBasket.render();
            }
            if (this.delivery) {
                this.delivery.render();
            }
        } else {
            if (this.divBasket) {
                this.divBasket.remove();
            }
            if (this.delivery) {
                this.delivery.remove();
            }
            this.divBasketClear.render();
        }
    }
    
}   
    
