import { LogicService } from "../Services/LogicService";
import { AuthService } from "../Services/AuthService";
import { DBService } from "../Services/DBService";
import { Timestamp } from "firebase/firestore";


export type TServices = {
    logicService: LogicService;
    authService: AuthService;
    dbService: DBService;
};

export type TGood = {
    name: string;
    price: number;
    url: string;
    id: string;
    oldprice: number;
    nic: number;
    man: string;
    cat: string;
    left: number;
};

export type TGoodBasket = {
    good: TGood;
    count: number;
};

export type TDataUser = {
    name: string;
    fotoUrl: string;
    email: string;
    basket: TGoodBasket[];
};


export type Total = {
    summ: number;
    percent: number;
    total: number;
}

export type THistory = {
    basket: TGoodBasket[];
    dataBasket: Total;
    date: Timestamp;
}