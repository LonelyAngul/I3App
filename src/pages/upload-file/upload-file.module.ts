import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {UploadFilePage} from './upload-file';
import {ComponentsModule} from "../../components/components.module";
import {DirectivesModule} from "../../directives/directives.module";

@NgModule({
  declarations: [
    UploadFilePage,
  ],
  imports: [
    DirectivesModule,
    ComponentsModule,
    IonicPageModule.forChild(UploadFilePage),
  ],
})
export class UploadFilePageModule {
}
