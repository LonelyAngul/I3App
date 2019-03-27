import {NgModule} from '@angular/core';
import {SelectPictureComponent} from './select-picture/select-picture';
import {IonicModule} from "ionic-angular";

@NgModule({
  declarations: [SelectPictureComponent],
  imports: [IonicModule],
  exports: [SelectPictureComponent]
})
export class ComponentsModule {
}
