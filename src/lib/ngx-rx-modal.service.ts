import { ComponentPortal } from '@angular/cdk/portal';
import {
  ComponentFactory,
  Injectable,
  TemplateRef,
} from '@angular/core';
import { of, Observable } from 'rxjs';
import { switchMap, take, map } from 'rxjs/operators';

import { NgxRxModalOption, NGX_RX_MODAL_TOKEN } from './ngx-rx-modal.model';
import { NgxRxModalComponent } from './ngx-rx-modal.component';
import { CdkService } from './cdk.service';

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

        const componentRef = portalhost.attach(new ComponentPortal(
          NgxRxModalComponent,
          undefined,
          this._cdk.createInjector<NgxRxModalOption>(NGX_RX_MODAL_TOKEN, {
            portalhost,
            component,
            option,
            // id: this._path.add(option.title, option.redirectURL)
          })
        ));

        return componentRef.instance.completeSubject.asObservable().pipe(
          take(1),
          map(([data, isBack]) => data)
          // switchMap(([data, isBack]) => {
          //   return this._path.remove(componentRef.instance.id, isBack, !option.redirectURL).pipe(
          //     map(() => data)
          //   );
          // })
        ); // only take once;
      })
    );

  }

}
