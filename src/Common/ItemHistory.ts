import {Component} from '../Abstract/Component';
import { TServices } from '../Abstract/Types';
import { THistory } from '../Abstract/Types'
import { DBService } from '../Services/DBService';

export class ItemHistory extends Component{
    
    constructor(parrent: HTMLElement, private services: TServices, private data: THistory) {
        super(parrent, "div", ["itemh"]);
        const sdate = data.date.toDate();
        const formattedDate = sdate.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
       });
        let date = new Component (this.root, "h3", null, formattedDate);
        const tovar = new Component(this.root, "div", ['tovar']);
        data.basket.forEach((el) =>{
          new Component (tovar.root, 'p', null, el.good.name.toString() + " x " + el.count.toString() );
        }) 
        let summ = new Component (this.root, "h3", null, data.dataBasket.total.toString() + ' руб.');    
    }

}