import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CloseComponent } from './close/close.component';
import { NgxRxModalComponent } from './ngx-rx-modal.component';
import { ViewContainerDirective } from './view-container.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [NgxRxModalComponent, ViewContainerDirective, CloseComponent],
  exports: [NgxRxModalComponent, ViewContainerDirective],
  entryComponents: [NgxRxModalComponent, CloseComponent],
})
export class NgxRxModalModule {}
