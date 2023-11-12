import {Component} from '../Abstract/Component';
import { TServices } from '../Abstract/Types';


export class LoginPage extends Component {
    regButton: Component;
    outButton: Component;
    log: Component;
    logout: Component;
    constructor(parrent: HTMLElement, private services: TServices){
        super(parrent, 'div', ["loginpage"]);
        this.log = new Component(this.root, 'h2', ['logtitle'], 'Вход в аккаунт');
        this.logout = new Component(this.root, 'h2', ['logtitle'], 'Вы вошли в аккаунт');
        this.regButton = new Component(this.root, 'input', ["lbtn"], null, ['type', 'value'], ['button', 'Войти']);
        this.regButton.root.onclick = () => {
            this.services.authService.authWithGoogle();

        }
        this.outButton = new Component(this.root, 'input', ["lbtn"], null, ['type', 'value'], ['button', 'Выйти']);
        this.outButton.root.onclick = () => {
            this.services.authService.outhFromGoogle();

        };

        
        const user = this.services.authService.user;
        if (user) {
            this.toggleButtons(true);
          } else {
            this.toggleButtons(false);
          }


          this.services.logicService.addListener('userAuth',(isAuthUser) =>{
            if (isAuthUser) {
                this.toggleButtons(true)
            } else {
                this.toggleButtons(false)
            }
          } )
          
        
    }

    toggleButtons(isAuthUser: boolean): void {
     if (isAuthUser) {
        this.regButton.remove();
        this.outButton.render();
        this.log.remove();
     } else {
        this.logout.remove();
        this.regButton.render();
        this.outButton.remove();
     }
    }

}