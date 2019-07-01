import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { User } from '../models/user';


const USER_KEY = 'user-info';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: Storage) { }

  // CREATE
  addItem(item: User): Promise<any> {
    return this.storage.get(USER_KEY).then((items: User) => {
      if (items) {
        items = item;
        return this.storage.set(USER_KEY, items);
      } else {
        return this.storage.set(USER_KEY, [item]);
      }
    });
  }

  getItems(): Promise<User> {
    return this.storage.get(USER_KEY);
  }

  // UPDATE
  updateItem(item: User): Promise<any> {
    return this.storage.get(USER_KEY).then((items: User[]) => {
      if (!items || items.length === 0) {
        return null;
      }
 
      let newItems: User[] = [];
 
      for (let i of items) {
        if (i.data.uid === item.data.uid) {
          newItems.push(item);
        } else {
          newItems.push(i);
        }
      }
 
      return this.storage.set(USER_KEY, newItems);
    });
  }
 
  // DELETE
  deleteItem(uid: string): Promise<User> {
    return this.storage.get(USER_KEY).then((items: User[]) => {
      if (!items || items.length === 0) {
        return null;
      }
 
      let toKeep: User[] = [];
 
      for (let i of items) {
        if (i.data.uid !== uid) {
          toKeep.push(i);
        }
      }
      return this.storage.set(USER_KEY, toKeep);
    });
  }



}
