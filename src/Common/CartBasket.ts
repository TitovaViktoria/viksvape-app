import { Component } from "../Abstract/Component";
import { TGood, TGoodBasket, TServices} from "../Abstract/Types";

export class CartBasket extends Component{

    btnDel : Component;

    constructor(
        parrent: HTMLElement,
        private services: TServices,
        private data: TGoodBasket
    ) {
        super(parrent, "div", ["cart_basket"]);

        new Component(
            this.root,"img",["cart_basket__image"],null,["src","alt"],[data.good.url, data.good.name]
        );

        const divName = new Component(this.root, "div", ["cart_basket__name"]);
        new Component(divName.root, "h3", [], data.good.name);
        if (data.good.oldprice !== 0) {
            new Component(this.root, "p", [], "<span>" + data.good.oldprice.toString() +  "</span>" + " " + data.good.price.toString() + " рублей");
          } else {
            new Component(this.root, "p", [], data.good.price.toString() + " рублей");
          }
        const divCount = new Component(this.root, "div", ["cart_basket__count"]);
        const btnDec = new Component (
            divCount.root,
            "input",
            ["count__button"],
            null,
            ["value", "type"],
            ["-", "button"]
        );

        const divNumber = new Component(divCount.root, "div", ["div__count"]);
        const spanCount = new Component(
            divNumber.root,
            "span", ["count__number"], ' ' + data.count.toString() + ' '
        );

        const btnInk = new Component(
            divCount.root,
            "input", ["count__button"], null, ["value", "type"], ["+", "button"]
        );
        

        this.btnDel = new Component (
            this.root,
            "input",
            ["cart_basket__del"],
            null,
            ["value", "type"],
            ["X", "button"]
        );

        btnDec.root.onclick = () => {
            if (this.data.count > 1) {
                this.data.count--;
                this.updateCount();
            }
        };
        

        btnInk.root.onclick = () => {
            if (this.data.count < 10) {
                this.data.count++;
                this.updateCount();
            }
        };

        this.btnDel.root.onclick = () => {
            (this.btnDel.root as HTMLInputElement).disabled = true;
            this.delGoodFromBasket();
        }
    }

    updateCount() {
        const spanCount = this.root.querySelector(".count__number") as HTMLSpanElement;
        spanCount.textContent = ' ' + this.data.count.toString() + ' ';
        const user = this.services.authService.user;
        this.services.dbService.updateBasketCount(user, this.data).then(() => {
        }).catch(() => {
        });
    }

    delGoodFromBasket() {
        const user = this.services.authService.user;
        this.services.dbService.delGoodFromBasket(user, this.data).then(() => {
            this.remove();
        })
        .catch (() => {
          (this.btnDel.root as HTMLInputElement).disabled = false;
        });
     }
}