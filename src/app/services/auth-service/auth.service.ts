import { Injectable } from '@angular/core';
import { RemoteDbService } from '../remote-db-service/remote-db.service';
import {
  Auth,
  AuthErrorCodes,
  User,
  UserCredential,
  getAuth,
  signInAnonymously,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  updateEmail,
  updatePassword,
  sendEmailVerification,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
  reauthenticateWithPopup,
} from "firebase/auth";
import { Observable, Observer } from 'rxjs';
import { ProviderType } from 'src/app/models/provider.type';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public auth: Auth;
  public user$: Observable<User | null>;
  public googleProvider = new GoogleAuthProvider();

  constructor(
    private remoteDbService: RemoteDbService,
  ) {
    this.auth = getAuth(this.remoteDbService.firebaseApp);
    this.user$ = this.observeAuthState(this.auth);
  }

  public observeAuthState(auth: Auth): Observable<User | null> {
    const authState = new Observable((observer: Observer<User | null>) => {
      auth.onAuthStateChanged(
        (user?: User | null) => user ? observer.next(user) : observer.next(null),
        (error: Error) => observer.error(error),
        () => observer.complete()
      );
    });
    return authState;
  }

  public async anonymousLogin(): Promise<UserCredential> {
    return await signInAnonymously(this.auth)
      .then((userCredential: UserCredential) => {
        console.log(`LOL: Logging in for USER: ${userCredential.user.uid}, PROV: ${userCredential.providerId}, OP: ${userCredential.operationType}`);
        return userCredential;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(`LOL: error on sign in: ${errorCode} MESS: ${errorMessage}`);
        throw new Error(`LOL: error on sign in: ${errorCode} MESS: ${errorMessage}`);
      });
  }

  public async googleLogin(): Promise<UserCredential> {
    return await signInWithPopup(this.auth, this.googleProvider)
      .then((userCredential: UserCredential) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(userCredential);
        const token = credential?.accessToken;
        // The signed-in user info.
        const user = userCredential.user;
        // IdP data available using getAdditionalUserInfo(result)
        console.log(`LOL: Logging in for USER: ${user.uid}, PROV: ${userCredential.user.providerId}, OP: ${userCredential.operationType} `);
        return userCredential;
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(`LOL: error on google sign in: ${errorCode} MESS: ${errorMessage}`);
        throw new Error(`LOL: error on google sign in: ${errorCode} MESS: ${errorMessage}`);
      });
  }

  public async registerUser(email: string, password: string): Promise<UserCredential> {
    return await createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        console.log(`LOL: Successfully created account for email: ${userCredential.user.email}`);
        return userCredential
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === AuthErrorCodes.EMAIL_EXISTS) {
          console.log('LOL:: Email already in use');
        }
        console.log(`LOL: error on creating account for email: ${email}: ${errorCode} MESS: ${errorMessage}`);
        throw new Error(`LOL: error on creating account for email: ${email}: ${errorCode} MESS: ${errorMessage}`);
      });
  }

  public async loginWithEmail(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        // Signed in 
        console.log(`LOL: Logging in for USER: ${userCredential.user.uid}, PROV: ${userCredential.user.providerId}, OP: ${userCredential.operationType} `);
        return userCredential;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(`LOL: error on email sign in: ${errorCode} MESS: ${errorMessage}`);
        throw new Error(`LOL: error on email sign in: ${errorCode} MESS: ${errorMessage}`);
      });
  }

  public async updateUserProfile(displayName: string, photoURL?: string) {
    if (!this.auth.currentUser) {
      throw new Error(`LOL: Error on updating user profile - no user`);
    }
    await updateProfile(this.auth.currentUser, {
      displayName,
      photoURL
    })
      .then(() => {
        console.log(`LOL: User succesfully updated: ${displayName}`);
      })
      .catch((e) => {
        console.log(`LOL: Error on updating the user: ${e}`);
        throw new Error(`LOL: Error on updating the user: ${e}`);
      });

  }

  public async resetPassword(email: string) {
    await sendPasswordResetEmail(this.auth, email)
      .then(() => {
        console.log(`LOL: Password reset email sent to: ${email}`);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(`LOL: Error on resetting password for email: ${email}`);
        throw new Error(`LOL: Error on resetting password for email: ${email}`);
      });
  }

  public async changeUserEmail(email: string, currentPassword: string) {
    if (!this.auth.currentUser) {
      throw new Error(`LOL: Error on changing user email - no user`);
    }

    await this.reauthenticate(this.auth.currentUser, 'password', currentPassword)
      .catch((e) => {
        console.log(`LOL: error on reauth for email change: ${e}`);
        throw new Error(`LOL: error on reauth for email change: ${e}`);
      });

    await updateEmail(this.auth.currentUser, email)
      .then(() => {
        console.log(`LOL: Email succesfully updated for ${this.auth.currentUser?.uid}`);
      })
      .catch((e) => {
        throw new Error(`LOL: Error on changing email for user: ${this.auth.currentUser?.uid}: ${e}`);
      });
  }

  public async changeUserPassword(newPassword: string, currentPassword: string) {
    if (!this.auth.currentUser) {
      throw new Error(`LOL: Error on changing user password - no user`);
    }

    await this.reauthenticate(this.auth.currentUser, 'password', currentPassword)
      .catch((e) => {
        console.log(`LOL: error on reauth for password change: ${e}`);
        throw new Error(`LOL: error on reauth for password change: ${e}`);
      });

    return await updatePassword(this.auth.currentUser, newPassword)
      .then(() => {
        console.log(`LOL: Password succesfully updated for ${this.auth.currentUser?.uid}`);
      })
      .catch((e) => {
        throw new Error(`LOL: Error on changing password for user: ${this.auth.currentUser?.uid}: ${e}`);
      });
  }

  public async verifyEmail(): Promise<string | null> {
    if (!this.auth.currentUser) {
      throw new Error('No current user!');
    }
    if (this.auth.currentUser.emailVerified) {
      throw new Error('User email already verified');
    }
    return await sendEmailVerification(this.auth.currentUser)
      .then(() => {
        console.log(`Verification email sent for user email ${this.auth.currentUser?.email}`);
        return this.auth.currentUser?.email || null;
      });
  }

  public async reauthenticate(user: User, provider: ProviderType, currentPassword?: string | null): Promise<UserCredential> {
    return await this.reauthenticateForProvider(user, provider, currentPassword)
      .then((userCredential: UserCredential) => {
        console.log(`LOL: User ${user?.uid} successfully reidentified`);
        return userCredential;
      })
      .catch((e) => {
        console.log(`LOL: Error on reauthentification of user: ${user?.uid}: ${e}`);
        throw new Error(`LOL: Error on reauthentification of user: ${user?.uid}`);
      });
  }

  private async reauthenticateForProvider(user: User, provider: ProviderType, currentPassword?: string | null): Promise<UserCredential> {
    switch (provider) {
      case 'password': {
        if (!user?.email || !currentPassword) {
          throw new Error(`LOL: Error on reauthentification for ${provider} - Missing email or password`);
        }
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        if (!credential) {
          throw new Error(`LOL: Error on reauthentification for ${provider} - missing credential`);
        }
        return reauthenticateWithCredential(user, credential)
      }
      case 'google.com': {
        return await reauthenticateWithPopup(user, new GoogleAuthProvider());
      }
    }
  }

  public async deleteAccount(provider: ProviderType, currentPassword?: string) {
    if (!this.auth.currentUser) {
      throw new Error(`LOL: Error on deleting account - no user`);
    }
    await this.reauthenticate(this.auth.currentUser, provider, currentPassword)
      .then(async () => {
        console.log(`LOL: User ${this.auth.currentUser?.uid} successfully reathenticated`);
      })
      .catch((e) => {
        console.log(`LOL: error on reauth for account deletion: ${e}`);
        throw new Error(`LOL: error on reauth for account deletion: ${e}`);
      });
    return await deleteUser(this.auth.currentUser);
  }
}
