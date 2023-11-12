import {Component} from '../Abstract/Component';
import { TServices } from '../Abstract/Types';


export class MainPage extends Component {
    constructor(parrent: HTMLElement, private services: TServices){
        super(parrent, 'div', ['mainpage']);
        const main = new Component(this.root, 'div', ['main_content'],);
        const main_t = new Component(main.root, 'div', ['main_t']);
        new Component(main_t.root, 'h1', ['main_title'], 'Лучшие вейпы и жидкости');
        new Component(main_t.root, 'p', ['main_text'], 'Мы продаем только качественные и <span>сертифицированные</span> товары от <span>лучших</span> производителей и поставщиков по <span>самым низким ценам</span>');
        new Component(main_t.root, 'div', ['main_btn'], '<a href="#goods">Перейти в каталог</a>')
        new Component(main.root, 'div', ['main_pic']);
        const partners = new Component(this.root, 'div', ['main_partners'],);
        new Component(partners.root, 'h2', ['partners_title'], 'Наши партнеры:');
        const partlist = new Component(partners.root, 'ul', ['partners']);
        new Component(partlist.root, 'li', ['smoant']);
        new Component(partlist.root, 'li', ['voopoo']);
        new Component(partlist.root, 'li', ['hqd']);
    }
}