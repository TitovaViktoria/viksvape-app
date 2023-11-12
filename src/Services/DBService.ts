import { FirebaseApp } from "firebase/app";
import { Observer } from "../Abstract/Observer";
import { DocumentData, Firestore, Timestamp, collection, doc, getDoc, getDocs, getFirestore, setDoc, addDoc, runTransaction, Transaction } from "firebase/firestore";
import { User } from "firebase/auth";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { TGood, TDataUser, TGoodBasket, THistory, Total } from "../Abstract/Types";
import { CartBasket } from "../Common/CartBasket";
import HtmlWebpackPlugin from "html-webpack-plugin";

export class DBService extends Observer {
    private db: Firestore = getFirestore(this.DBFirestore);

    dataUser: TDataUser | null = null;

    orderTotals = {
        summ: 0,
        percent: 0,
        total: 0
    };

    constructor(private DBFirestore: FirebaseApp) {
        super();
    }



    calcTotal(){
        if(!this.dataUser) return;
        let summ = 0;
        let count = 0;
        this.dataUser.basket.forEach(el =>{
            summ += el.count * el.good.price;
            count += el.count;
        })
        const percent = count <= 5 ? 5 : 0;
        const total = summ - summ * (percent/100);
        this.orderTotals.summ = summ;
        this.orderTotals.percent = percent;
        this.orderTotals.total = total;
    }

    async getAllGoods(): Promise<TGood[]> {
        const querySnapshot = await getDocs(collection(this.db, "goods"));
        const storage = getStorage();
        const goods = querySnapshot.docs.map(async (doc) => {
            const data = doc.data();
            const uri = ref(storage, data.url);
            const url = await getDownloadURL(uri);
            const good = {
                name: data.name as string,
                price: data.price as number,
                cat: data.cat as string,
                nic: data.nic as number,
                man: data.man as string,
                oldprice: data.oldprice as number,
                url: url,
                left: data.left as number,
                id: doc.id
            };
            return good;
        });
        return Promise.all(goods);
    }
    async getDataUser(user: User | null): Promise<void> {
        if (user === null) return;
        const docRef = doc(this.db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            this.dataUser = docSnap.data() as TDataUser;
        } else {
            const data = {
                email: user.email,
                name: user.displayName,
                fotoUrl: user.photoURL,
                basket: []
            };
            await setDoc(doc(this.db, "users", user.uid), data);
            const docSetSnap = await getDoc(docRef);
            this.dataUser = (docSetSnap.data() as TDataUser) || null;
            console.log("create document");
        }

        console.log(this.dataUser);
    }

    async addGoodInBasket(user: User | null, good: TGood): Promise<void> {
        if (!user || !this.dataUser) return;

        const index = this.dataUser.basket.findIndex(el => el.good.id === good.id);
        if (index >= 0) return;

        const newUser = {} as TDataUser;
        Object.assign(newUser, this.dataUser);

        const goodBasket = {
            good: good,
            count: 1
        } as TGoodBasket;

        newUser.basket.push(goodBasket);

        await setDoc(doc(this.db, "users", user.uid), newUser)
            .then(() => {
                this.dataUser = newUser;
                this.dispatch("goodInBasket", goodBasket);
                this.calcTotal();
                this.dispatch("updateBasketCount", this.orderTotals);
            })
            .catch(() => {

            });
    }

    async updateBasketCount(user: User | null, updatedGood: TGoodBasket): Promise<void> {
        if (!user || !this.dataUser) return;

        const index = this.dataUser.basket.findIndex(el => el.good.id === updatedGood.good.id);

        if (index < 0) return;

        const newUser = {} as TDataUser;
        Object.assign(newUser, this.dataUser);

        const updatedBasket = [...newUser.basket];
        updatedBasket[index].count = updatedGood.count;

        newUser.basket = updatedBasket;

        await setDoc(doc(this.db, "users", user.uid), newUser)
            .then(() => {
                this.dataUser = newUser;
                this.calcTotal();
                this.dispatch("updateBasketCount", updatedGood);
            })
            .catch(() => {});
    }

    async delGoodFromBasket(user: User | null, good: TGoodBasket): Promise<void> {
        if (!user || !this.dataUser) return;

        const newBasket = this.dataUser.basket.filter(el => el.good.id !== good.good.id);

        const newUser = {} as TDataUser;
        Object.assign(newUser, this.dataUser);
        newUser.basket = newBasket;


        await setDoc(doc(this.db, "users", user.uid), newUser)
            .then(() => {
                this.dataUser = newUser;
                this.dispatch("delGoodFromBasket", good.good.id);
                this.calcTotal();
                this.dispatch("updateBasketCount", this.orderTotals);
            })
            .catch(() => {});
    }

     getTotalBasketPrice(): number {
        if (!this.dataUser) {
            return 0;
        }
        let total = 0;
        this.dataUser.basket.forEach((el) => {
            total += el.count * el.good.price;
        })
        return total;
    }

    async addBasketInHistory(user: User | null): Promise<void> {
        if (!user || !this.dataUser) return;
        const newUser = {} as TDataUser;
        Object.assign(newUser, this.dataUser);
        newUser.basket = [];

        const dataHistory = {
            basket: this.dataUser.basket,
            dataBasket: this.orderTotals,
            date: Timestamp.now()
        };
        

        try{
            await runTransaction(this.db, async(transaction) => {
                if(!this.dataUser) throw "BD отсутствует";
                const result = this.dataUser.basket.map(async (el) => {
                    const goodRef = doc(this.db, "goods", el.good.id);
                    const sfGood = await transaction.get(goodRef);
                    if (!sfGood.exists()) throw "Товар не существует";
                    const countGood = sfGood.data().numbers;
                    if (countGood < el.count) {
                        alert ("Недостаточно товара ${el.good.name} осталось ${el.good.left}");
                        throw "Недостаточно товара";
                    };
                    const newNumbers = countGood - el.count;
                    transaction.update(goodRef, {left: newNumbers});

                    return Promise.resolve("ok");
                });

            await Promise.all(result);
            const userRef = doc(this.db, "users", user.uid);
            transaction.update(userRef, {basket: []});
        });

        await addDoc(collection(this.db, "users", user.uid, "history"), dataHistory);
        this.dataUser.basket.forEach((el) =>{
            this.dispatch("delGoodFromBasket", el.good.id);
        });
        this.dataUser = newUser;
        this.calcTotal();
        this.dispatch("clearBasket");
        this.dispatch("updateBasketCount", this.orderTotals);
        this.getCountHistory(user);
        console.log("Transaction success");
            } catch(e){
                console.log("Transaction fail");
            }
        }

        async getCountHistory(user: User | null): Promise<void>{
            if (!user || !this.dataUser) return;

            const querySnapshot = await getDocs(collection(this.db, "users", user.uid, "history"));
            const count = querySnapshot.docs.length;
            let summa = 0;
            querySnapshot.docs.forEach(el => {
                summa += el.data().dataBasket.total;
            })
            this.dispatch('changeStat', count, summa);
        }

        async getHistory(user: User | null): Promise<THistory[]> {
            if (!user || !this.dataUser) return [];
            const querySnapshot = await getDocs(collection(this.db, "users", user.uid, "history"))
            const storage = getStorage();
            const history = querySnapshot.docs.map(async (doc) => {
                const data = doc.data();
                const order = {
                    basket: data.basket as TGoodBasket[],
                    dataBasket: data.dataBasket as Total,
                    date: data.date as Timestamp,
                };
                return order;
            });
            return Promise.all(history);
        }
    }

