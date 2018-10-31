import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PathService {

  private list: {
    id: string,
    fromUrl: string,
    toUrl: string,
    saveTitle: string
  }[] = [];
  private canRunBack = true;

  constructor(
    private _location: Location,
    private _router: Router,
    private _title: Title,
  ) { }

  add(title: string, url?: string) {

    const id = Math.random().toString(35).substr(2, 7);
    const toUrl = url ? `${this._router.url}/${url}` : `${this._router.url}`;

    this._location.go(toUrl);

    this.list.push({
      id,
      fromUrl: this._router.url,
      toUrl,
      saveTitle: this._title.getTitle()
    });

    if (title) {
      this._title.setTitle(title);
    }

    return id;
  }

  remove(id: string, isBack: boolean, isAlc: boolean = false) {
    return of(null).pipe(
      tap(() => {
        const i = this.list.findIndex((item) => item.id === id);
        const data = this.list[i];
        this.list.splice(i, 1);
        this.canRunBack = false;

        this._title.setTitle(data.saveTitle);

        if (isBack) {
          this._location.back();
        }
      }),
      // this delay will prevent when back is not compelete and next active is go other page
      delay(100),
      tap(() => this.canRunBack = true)
    );
  }

  check(id: string) {
    const state = id === this.list[this.list.length - 1].id && this.canRunBack;
    return state;
  }
}
