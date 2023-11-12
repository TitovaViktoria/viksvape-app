import {Component} from '../Abstract/Component';
import { TServices } from '../Abstract/Types';
import { TGood } from '../Abstract/Types';
import { Item } from '../Common/Item';

export class GoodsPage extends Component {
    private goods: TGood[] = [];

    constructor(parrent: HTMLElement,private services: TServices){
        super(parrent, 'div', ["goods_pages"]);
        const gallery = new Component(this.root, "div", ['gal']);
        const filter = new Component(gallery.root, "div", ['filter']);
        new Component(filter.root, "h2", ['ftitle'], 'Категории товаров:');
        new Component(filter.root, "input", ['checking'], null ,["type","data","value"], ["checkbox","cat","juice"]);
        new Component(filter.root, "p", ['ftext'] , 'Жидкости');
        new Component(filter.root, "br", null);
        new Component(filter.root, "input", ['checking'], null ,["type","data","value"], ["checkbox","cat","vape"]);
        new Component(filter.root, "p", ['ftext'] , 'Вейпы');
        new Component(filter.root, "br", null);
        new Component(filter.root, "input", ['checking'], null ,["type","data","value"], ["checkbox","cat","accs"]);
        new Component(filter.root, "p", ['ftext'] , 'Акссесуары');
        new Component(filter.root, "div", ['sep']);
        new Component(filter.root, "h2", ['ftitle'], 'Содержание никотина:');
        new Component(filter.root, "input", ['checking'], null ,["type","data","value"], ["checkbox","nic","50"]);
        new Component(filter.root, "p", ['ftext'] , '50mg');
        new Component(filter.root, "br", null);
        new Component(filter.root, "input", ['checking'], null ,["type","data","value"], ["checkbox","nic","20"]);
        new Component(filter.root, "p", ['ftext'] , '20mg');
        new Component(filter.root, "div", ['sep']);
        new Component(filter.root, "h2", ['ftitle'], 'Производитель');
        new Component(filter.root, "input", ['checking'], null ,["type","data","value"], ["checkbox","man","smoant"]);
        new Component(filter.root, "p", ['ftext'] , 'Smoant');
        new Component(filter.root, "br", null);
        new Component(filter.root, "input", ['checking'], null ,["type","data","value"], ["checkbox","man","voopoo"]);
        new Component(filter.root, "p", ['ftext'] , 'Voopoo');
        new Component(filter.root, "br", null);
        new Component(filter.root, "input", ['checking'], null ,["type","data","value"], ["checkbox","man","hqd"]);
        new Component(filter.root, "p", ['ftext'] , 'HQD');
        const itemsc = new Component(gallery.root, "div", ["itemsc"]);
        new Component(itemsc.root, "h2", ["ctitle"], 'Каталог');
        const sort = new Component (itemsc.root, "div", ["sortbtns"]);
        new Component(sort.root, "div", null, "A")
        const inputGoodDown = new Component (
            sort.root, "input", [], null, ["type", "value", "data-sort"],
            ["button", "↑", "down"]
        );
        inputGoodDown.root.addEventListener("click", () => this.filterAndSortGoods(items, true));
        const inputGoodUp = new Component (
            sort.root, "input", [], null, ["type", "value", "data-sort"],
            ["button", "↓", "down"]
        );
        inputGoodUp.root.addEventListener("click", () => this.filterAndSortGoods(items, false));
        const items = new Component(itemsc.root, "div", ["items"]);
        services.dbService.getAllGoods().then((goods) => {
            this.goods = goods;
            this.putGoodOnPage(items, goods);
        });
        filter.root.addEventListener('change', () => {
            this.filterAndSortGoods(items, null);
        });
    }

    filterAndSortGoods(items: Component, desc: boolean | null) {
        const selectedCategories = Array.from(
            document.querySelectorAll('input[data="cat"]:checked')
        ).map((input) => input.getAttribute('value'));

        const selectedNicotineLevels = Array.from(
            document.querySelectorAll('input[data="nic"]:checked')
        ).map((input) => input.getAttribute('value'));

        const selectedManufactures = Array.from(
            document.querySelectorAll('input[data="man"]:checked')
        ).map((input) => input.getAttribute('value'));

        let filteredGoods = this.goods.filter((product) => {
            const isCategoryMatch =
                selectedCategories.length === 0 ||
                selectedCategories.includes(product.cat);
            const isNicotineLevelMatch =
                selectedNicotineLevels.length === 0 ||
                selectedNicotineLevels.includes(product.nic.toString());
            const isManufacturelMatch =
                selectedManufactures.length === 0 ||
                selectedManufactures.includes(product.man.toString());

            return isCategoryMatch && isNicotineLevelMatch && isManufacturelMatch;
        });

        if (desc === true) {
            filteredGoods.sort((a, b) => a.name.localeCompare(b.name));
        } else  if (desc === false){
            filteredGoods.sort((a, b) => b.name.localeCompare(a.name));
        } else   if( desc === null) { 
        }
        items.root.innerHTML = '';
        this.putGoodOnPage(items, filteredGoods);
    }

    putGoodOnPage(tag: Component, goods: TGood[]) {
        goods.forEach((product) =>{
            new Item(tag.root, this.services, product);
        })
    }
}