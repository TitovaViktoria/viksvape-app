import { Component } from "../Abstract/Component";
import { getAuth } from "firebase/auth";
import { TServices } from '../Abstract/Types';

export class Router {
    constructor(public links: Record<string, Component>,  private services: TServices){
        this.openPage();

        window.onhashchange = () => {
            this.openPage();
        };
    }

    openPage() {
        Object.values(this.links).forEach((el) => el.remove());
        
        const url = window.location.hash.slice(1);

        const user = this.services.authService.user;

        if ((url === 'history' && !user) || (url === 'cart' && !user)) {
            this.links["#login"].render();
          } else {
            this.links["#" + url].render();
          }
         console.log(url);
         
    }
}
