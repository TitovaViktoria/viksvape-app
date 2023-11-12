import { count } from 'firebase/firestore';
import {Component} from '../Abstract/Component';
import { THistory, TServices } from '../Abstract/Types';
import { ItemHistory } from '../Common/ItemHistory';

export class HistoryPage extends Component {
    private history: THistory[] | null = null;
    constructor(parrent: HTMLElement,private services: TServices){
        super(parrent, 'div', ['historypage'], '');
        services.dbService.getDataUser(services.authService.user).then(()=>{
        if (services.authService.user?.email === services.logicService.emailAdmin){
            new Component(this.root, "h1", ['stitle'], "Панель администратора");
            const pcount = new Component(this.root, "p", ['snum'], "Кол-во заказов: ");
            const totalsumm = new Component(this.root, "p", ['snum'], "Общая стоимость заказов: ");
            services.dbService.addListener("changeStat", (count,summa) => {
            pcount.root.innerHTML = "Кол-во заказов: " + count?.toString();
            totalsumm.root.innerHTML = "Общая стоимость заказов: " + summa?.toString();
            })
            const user = services.authService.user;
            services.dbService.getCountHistory(user);
        } else {
            new Component(this.root, "h1", ['htitle'], "История заказов");
            const table = new Component(this.root, "div", ['tablecont']);
            const thead = new Component(table.root, "div", ['tablehead']);
            new Component(thead.root, "h3", ['datet'], "Дата");
            new Component(thead.root, "h3", ['goodst'], "Позиции");
            new Component(thead.root, "h3", ['summt'], "Сумма");
            services.dbService.getHistory(this.services.authService.user).then((history) => {
                this.history = history;
                this.putHistoryOnPage(table, history);
            });
        }

        new Component(this.root, "a", ['bbtn'], "На главную", ['href'], ['#']);
    ;}
    );}

    putHistoryOnPage(tag: Component, history: THistory[]) {
        history.forEach((product) =>{
            new ItemHistory(tag.root, this.services, product);
        })
    }
}