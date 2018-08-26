import { NgModule } from '@angular/core';
import { NgxRxModalComponent } from './ngx-rx-modal.component';
import { ViewContainerDirective } from './view-container.directive';
import { CommonModule } from '@angular/common';
import { CloseComponent } from './close/close.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    NgxRxModalComponent,
    ViewContainerDirective,
    CloseComponent
  ],
  exports: [
    NgxRxModalComponent,
    ViewContainerDirective
  ],
  entryComponents: [
    NgxRxModalComponent,
    CloseComponent
  ]
})
export class NgxRxModalModule { }
