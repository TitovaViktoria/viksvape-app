import { Component} from './Abstract/Component';
import './style.scss';
import { MainPage } from './Pages/MainPage';
import { GoodsPage } from './Pages/GoodsPage';
import { HistoryPage } from './Pages/HistoryPage';
import { CartPage } from './Pages/CartPage';
import { LoginPage } from './Pages/LoginPage';
import { Header } from './Common/Header';
import { Footer } from './Common/Footer';
import { Router } from './Common/Router';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../configFB';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { LogicService } from './Services/LogicService';
import { AuthService } from './Services/AuthService';
import { DBService } from './Services/DBService';
import { getFirestore } from 'firebase/firestore';


const DBFirestore = initializeApp(firebaseConfig);
const db = getFirestore(DBFirestore);

const services = {
  logicService: new LogicService(),
  authService: new AuthService(),
  dbService: new DBService(DBFirestore)
}

class App {
    constructor(parent: HTMLElement){
        const wrap = new Component(parent, "div", ["wrapper-content"]);
        new Header(wrap.root, services);

        const main = new Component(wrap.root, "div", ['container']);
        const links = {
            '#': new MainPage(main.root, services),
            '#goods': new GoodsPage(main.root, services),
            '#history': new HistoryPage(main.root, services),
            '#cart': new CartPage(main.root, services),
            '#login': new LoginPage(main.root, services),

        }

        new Router(links, services);
        new Footer(wrap.root);
    }
}



declare global {
    interface Window {
    app: App;
  }
}
  


const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  services.authService.user = user;
  services.dbService
   .getDataUser(user)
   .then(() => {
    if (!window.app) window.app = new App(document.body);
   })
   .catch ((error) => {
    console.log(error);
   });
   
   if (!window.app) window.app = new App(document.body);
});


