import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentFactory, Injectable, TemplateRef } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';

import { CdkService } from './cdk.service';
import { NgxRxModalComponent } from './ngx-rx-modal.component';
import { NGX_RX_MODAL_TOKEN, NgxRxModalOption } from './ngx-rx-modal.model';

@Injectable({
  providedIn: 'root'
})
export class NgxRxModalService {

  constructor(
    private _cdk: CdkService) { }

  open(
    component: TemplateRef<any> | ComponentFactory<any>,
    option: NgxRxModalOption = {}
  ): Observable<any> {

    return of(null).pipe(
      switchMap(() => {
        const portalhost = this._cdk.createBodyPortalHost();

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
                // id: this._path.add(option.title, option.redirectURL)
              })
            ));
          }),
          switchMap(componentRef => componentRef.instance.completeSubject.asObservable()),
          take(1),
          map(([data, isBack]) => data)
          // switchMap(([data, isBack]) => {
          //   return this._path.remove(componentRef.instance.id, isBack, !option.redirectURL).pipe(
          //     map(() => data)
          //   );
          // })
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

