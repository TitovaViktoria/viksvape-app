import { Stats } from 'webpack';
import {Component} from '../Abstract/Component';
import { TServices } from '../Abstract/Types';
 
export class Header extends Component {
    constructor(parrent: HTMLElement, private services: TServices){
        super(parrent, 'div');
        const cont = new Component(this.root, 'div', ['container'], '');
        const main = new Component(cont.root, 'div', ['header'], '');
        const logo = new Component(main.root, 'div', ['logo'], 'Viks');
        const ef = new Component(logo.root, 'span', ['logo_text'], 'Vape')
        const links = new Component(main.root, 'ul', ['header-links'], '');
        new Component(links.root, 'li', null, '<a href="#">Главная</a>');
        new Component(links.root, 'li', null, '<a href="#goods">Каталог</a>');
        new Component(links.root, 'li', null, '<a href="#cart">Корзина</a>');
        new Component(links.root, 'li', null, '<a href="#history">История заказов</a>');
        const last = new Component(links.root, 'li', null, '');
        const lastlink = new Component(last.root, 'a', null, '', ['href'], ['#login']);
        new Component (lastlink.root, 'div', ['sp'], '');
    }
}