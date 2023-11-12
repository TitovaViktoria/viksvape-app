import {Component} from '../Abstract/Component';

export class Footer extends Component {
    constructor(parrent: HTMLElement){
        super(parrent, 'div');
        const cont = new Component(this.root, 'div', ['container'], '');
        const fmain = new Component(cont.root, 'div', ['footer'], '');
        new Component(fmain.root, 'p', ['author'], '© 2023 Виктория Титова, ЭЛБ-3');
        const logo = new Component(fmain.root, 'div', ['logo'], 'Viks');
        new Component(logo.root, 'span', ['logo_text'], 'Vape');
        new Component(fmain.root, 'p', ['author'], 'Пользовательское соглашение');
    }
}
