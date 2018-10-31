import { ComponentPortal } from '@angular/cdk/portal';
import { Location } from '@angular/common';
import { ComponentFactory, Injectable, TemplateRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { delay, map, switchMap, take, tap } from 'rxjs/operators';

import { CdkService } from './cdk.service';
import { NgxRxModalComponent } from './ngx-rx-modal.component';
import { NGX_RX_MODAL_TOKEN, NgxRxModalOption } from './ngx-rx-modal.model';
import { PathService } from './path.service';

@Injectable({
  providedIn: 'root'
})
export class NgxRxModalService {



  constructor(
    private _cdk: CdkService,
    private _location: Location,
    private _router: Router,
    private _title: Title,
    private _path: PathService
  ) { }

  open(
    component: TemplateRef<any> | ComponentFactory<any>,
    option: NgxRxModalOption = {}
  ): Observable<any> {

    return of(null).pipe(
      switchMap(() => {
        const portalhost = this._cdk.createBodyPortalHost();

        const id = this._path.add(option.title, option.redirectURL);

        return getResolveObs(option).pipe(
          map(data => {
            return portalhost.attach(new ComponentPortal(
              NgxRxModalComponent,
              undefined,
              this._cdk.createInjector<NgxRxModalOption>(NGX_RX_MODAL_TOKEN, {
                portalhost,
                component,
                option: {
                  ...option,
                  data: {
                    ...option.data,
                    ...data
                  }
                },
                id
              })
            ));
          }),
          switchMap(componentRef => componentRef.instance.completeSubject.asObservable()),
          take(1),
          switchMap(([data, isBack]) => {
            return this._path.remove(id, isBack, !option.redirectURL).pipe(
              map(() => data)
            );
          })
        );
      })
    );
  }

}

function getResolveObs(option: NgxRxModalOption) {
  let obs$ = of({});
  if (option.resolve) {
    const resolveData = {};
    obs$ = forkJoin(Object.keys(option.resolve).map(x => option.resolve[x].pipe(tap(result => {
      resolveData[x] = result;
    })))).pipe(map(() => resolveData));
  }
  return obs$;
}

