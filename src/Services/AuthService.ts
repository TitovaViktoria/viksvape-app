import { User } from "firebase/auth";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut} from "firebase/auth";
import { Observer } from "../Abstract/Observer";

export class AuthService extends Observer {
    user: User | null = null;

    authWithGoogle(): void {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
        .then(()=> {
            this.dispatch('userAuth', true)
            window.location.reload();
        })
        .catch(()=> {
            console.log('bad');
        });

    }
    outhFromGoogle(): void {
        const auth = getAuth();
        signOut(auth)
        .then(() => {
            this.dispatch('userAuth', false)
            window.location.reload();
        })
        .catch(() => {
            console.log('out bad');
      });

    }

}