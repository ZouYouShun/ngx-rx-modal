import { animate, animateChild, group, query, style, transition, trigger } from '@angular/animations';
import { DomPortalOutlet } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Inject,
  Injector,
  OnDestroy,
  Optional,
  ReflectiveInjector,
  Renderer2,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { addClassByString, addStyle, AutoDestroy } from '@nghedgehog/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CloseComponent } from './close/close.component';
import { NGX_RX_MODAL_CLOSE, NGX_RX_MODAL_TOKEN, NgxRxModalOption, NgxRxModalRef } from './ngx-rx-modal.model';
import { ViewContainerDirective } from './view-container.directive';

// import { PathService } from '../../service/path.service';
interface InjectModel {
  portalhost: DomPortalOutlet;
  component: ComponentFactory<any> | TemplateRef<any>;
  option: NgxRxModalOption;
  id: string;
}

const time = '195ms cubic-bezier(0.4, 0.0, 0.6, 1)';

@Component({
  selector: 'ngx-rx-modal',
  templateUrl: './ngx-rx-modal.component.html',
  styleUrls: ['./ngx-rx-modal.component.scss'],
  animations: [
    trigger('animate', [
      transition('* => fadeIn', [
        group([
          style({ opacity: 0 }),
          animate(time,
            style({ opacity: 1 })
          ),
          query('@*', animateChild(), { optional: true })
        ])
      ]),
      transition('fadeIn => void', [
        group([
          style({ opacity: 1 }),
          animate(time,
            style({ opacity: 0 })
          ),
          query('@*', animateChild(), { optional: true })
        ])
      ]),
      transition('* => slideInRtoL', [
        style({ transform: 'translate3d(100%, 0, 0)' }),
        animate(time,
          style({ transform: 'translate3d(0, 0, 0)' })
        )
      ]),
      transition('slideInRtoL => void', [
        style({ transform: 'translate3d(0, 0, 0)' }),
        animate(time,
          style({ transform: 'translate3d(100%, 0, 0)' })
        )
      ]),
    ])
  ]
})
export class NgxRxModalComponent extends AutoDestroy implements AfterContentInit, AfterViewInit, OnDestroy {
  @HostBinding('@animate') animate = 'fadeIn';

  @ViewChild('panel') panel: ElementRef;
  @ViewChild('mainElm', { read: ViewContainerDirective }) view: ViewContainerDirective;
  @ViewChild('closeElm', { read: ViewContainerDirective }) closeView: ViewContainerDirective;

  portalhost: DomPortalOutlet = this._injectData.portalhost;
  component: ComponentFactory<any> | TemplateRef<any> = this._injectData.component;
  option: NgxRxModalOption = this._injectData.option;
  id: string = this._injectData.id;

  completeSubject: Subject<any> = new Subject();

  isTemplate = true;
  // private keyExit$: Subscription;
  completeEmitter: EventEmitter<string>;
  private sendData: any;
  private isBack = true;
  private closeRef: ChangeDetectorRef;

  // @HostListener('window:popstate', ['$event'])
  // onPopstate(event) {
  //   // if (this._path.check(this.id)) {
  //   //   this.isBack = false;
  //   //   this.close();
  //   // }
  // }

  constructor(
    @Inject(NGX_RX_MODAL_TOKEN) private _injectData: InjectModel,
    @Optional() @Inject(NGX_RX_MODAL_CLOSE) private closeComponent: any,
    @Inject(DOCUMENT) private document: any,
    private _elm: ElementRef,
    private _renderer: Renderer2,
    private _factory: ComponentFactoryResolver
  ) {
    super();
  }

  @HostListener('@animate.done', ['$event']) animateDone(event) {
    // console.log(event);
    if (event.toState === 'void') {
      this.completeSubject.next([this.sendData, this.isBack]);
    }
  }

  ngAfterContentInit() {
    if (this.component instanceof ComponentFactory) {
      this.isTemplate = false;
      this.loadComponent(this.component);
    } else {
      this.completeEmitter = new EventEmitter<string>();

      this.completeEmitter.pipe(
        takeUntil(this._destroy$)
      ).subscribe(data => {
        this.sendData = data;
        this.close();
      });
    }
    this.handelStyle(this.option);

  }

  ngAfterViewInit(): void {

    this.setViewScroll();
    this.loadCloseElm();

    if (this.option.fixedContainer) {
      const panelElm: HTMLElement = this.panel.nativeElement;
      const popElm: HTMLElement = this._elm.nativeElement;

      const elmDetial = {
        height: panelElm.clientHeight,
        width: panelElm.clientWidth,
        top: panelElm.offsetTop,
        left: panelElm.offsetLeft
      };

      const windowElm = {
        height: popElm.offsetHeight,
        width: popElm.offsetWidth
      };

      const heightDis = (elmDetial.top + elmDetial.height) - windowElm.height;
      const widthDis = (elmDetial.left + elmDetial.width) - windowElm.width;

      if (heightDis > 0) {
        this._renderer.setStyle(this.panel.nativeElement, 'top', `${windowElm.height - elmDetial.height}px`);
      }
      if (widthDis > 0) {
        this._renderer.setStyle(this.panel.nativeElement, 'left', `${windowElm.width - elmDetial.width}px`);
      }
    }
  }

  ngOnDestroy() {
    // https://stackoverflow.com/questions/42387348/angular2-dynamic-content-loading-throws-expression-changed-exception
    if (this.closeRef) {
      this.closeRef.detach();
    }
  }

  // handel the pop-up style and class
  private handelStyle(config: NgxRxModalOption) {
    if (config) {

      addClassByString(this._renderer, this._elm.nativeElement, config.backdropClass);
      addStyle(this._renderer, this._elm.nativeElement, config.backdropStyle);

      if (!config.notMdFix) this._renderer.addClass(this._elm.nativeElement, 'md-fix');

      addStyle(this._renderer, this.panel.nativeElement, config.panelStyle);
      addClassByString(this._renderer, this.panel.nativeElement, config.panelClass);

      if (!config.elevation) config.elevation = 24;
      this._renderer.addClass(this.panel.nativeElement, `mat-elevation-z${config.elevation}`);
    }
  }

  // load Dynamin component
  private loadComponent(component: ComponentFactory<any>) {
    const viewContainerRef = this.view.viewContainerRef;
    // viewContainerRef.clear();

    const injector: Injector =
      ReflectiveInjector.resolveAndCreate([
        { provide: NGX_RX_MODAL_TOKEN, useValue: this.option.data }
      ]);

    const componentRef = viewContainerRef.createComponent<NgxRxModalRef>(component, 0, injector);


    // when data send back, close this dialog
    if (componentRef.instance.complete) {
      componentRef.instance.complete.pipe(
        takeUntil(this._destroy$)
      ).subscribe((data: any) => {
        this.sendData = data;
        this.close();
      });
    }
  }

  private loadCloseElm() {
    if (!this.option.disableCloseButton) {
      const viewContainerRef = this.closeView.viewContainerRef;
      this.closeRef = viewContainerRef.createComponent(
        this._factory.resolveComponentFactory(this.closeComponent || CloseComponent)
      ).changeDetectorRef;

      this.closeRef.detectChanges();
    }
  }

  close() {
    this.portalhost.detach();
  }

  private setViewScroll() {

    // console.log(this.document.body.clientWidth);
    const css = `body {
      overflow: hidden;
      -webkit-overflow-scrolling: touch;
      height: 100%;
      width: ${this.document.body.clientWidth}px;
    }
    `;
    const styleText = this._renderer.createElement('style');
    this._renderer.setAttribute(styleText, 'type', 'text/css');
    this._renderer.appendChild(styleText, this._renderer.createText(css));
    this._renderer.appendChild(this._elm.nativeElement, styleText);
  }
}
