import { InjectionToken } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export const NGX_RX_MODAL_TOKEN = new InjectionToken('NGX_RX_MODAL_TOKEN');
export const NGX_RX_MODAL_CLOSE = new InjectionToken('NGX_RX_MODAL_CLOSE');

export interface NgxRxModalRef {
  complete: Subject<any>;
}

export interface NgxRxModalOption {
  /** This title will add on browser title */
  title?: string;
  /** Data being injected into the child component. */
  data?: any;
  /** Data being injected into the child component. */
  resolve?: { [key: string]: Observable<any> };
  /** Custom class for the overlay pane. */
  panelClass?: string;
  /** Custom class for the backdrop, */
  backdropClass?: string;
  /** style of the dialog. */
  panelStyle?: any;
  /** style of the backdrop. */
  backdropStyle?: any;
  /** Whether the user can use escape or clicking outside to close a modal. */
  disableClose?: boolean;
  disableCloseButton?: boolean;
  disableBackdropClick?: boolean;
  /* main window animate */
  windowAnimate?: string;
  /** when lt-md fix to 100%  */
  notMdFix?: boolean;
  /** elevation height */
  elevation?: number;
  /** is check layout in the container */
  fixedContainer?: boolean;
  /** is add url with modal */
  redirectURL?: string;
}
