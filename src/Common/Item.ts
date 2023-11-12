import {Component} from '../Abstract/Component';
import {TServices } from '../Abstract/Types';
import {TGood } from '../Abstract/Types'
import { DBService } from '../Services/DBService';

export class Item extends Component{

    btnBasket: Component;
    
    constructor(parrent: HTMLElement, private services: TServices, private data: TGood) {
        super(parrent, "div", ["item"]);

        new Component(
            this.root,
            "img",
            [],
            null,
            ["src", "alt"],
            [data.url, data.name]
        );

        let title = new Component (this.root, "h3", [], data.name);
        if (data.oldprice !== 0) {
            new Component(this.root, "h2", [], "<span>" + data.oldprice.toString() +  "</span>" + " " + data.price.toString() + " рублей");
          } else {
            new Component(this.root, "h2", [], data.price.toString() + " рублей");
          }
        this.btnBasket = new Component (this.root, "div", ["btn"], 'В корзину');

        if (services.dbService.dataUser) {
          const index = services.dbService.dataUser.basket.findIndex(el => el.good.id === data.id);
          if (index >= 0) {
            (this.btnBasket.root as HTMLInputElement).innerHTML = "Уже в корзине";
          };
      }
      
        this.btnBasket.root.onclick = () => {
            (this.btnBasket.root as HTMLInputElement).innerHTML = "Уже в корзине";
          this.addGoodInBasket();
        }
              
          services.dbService.addListener('delGoodFromBasket', (idGood) => {
            if (idGood === data.id){
                (this.btnBasket.root as HTMLElement).innerHTML = "В корзину";
            }
        }); 
    }

    addGoodInBasket() {
      const user = this.services.authService.user;
      this.services.dbService.addGoodInBasket(user, this.data)
      .catch (() => {
        (this.btnBasket.root as HTMLInputElement).innerHTML = "В корзину";
      });
   }
}