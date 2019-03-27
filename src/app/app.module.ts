import {ErrorHandler, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {MyApp} from './app.component';

import {MinePage} from '../pages/mine/mine';
import {HomePage} from '../pages/home/home';
import {TabsPage} from '../pages/tabs/tabs';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {HttpProvider} from '../providers/http';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {LayerProvider} from '../providers/base/layer';
import {NativeStorage} from "@ionic-native/native-storage";
import {NativeProvider} from '../providers/base/native';
import {CheckupdateProvider} from '../providers/checkupdate';
//文件传输相关
import {File} from '@ionic-native/file';
import {FileTransfer} from '@ionic-native/file-transfer';
import {FileOpener} from "@ionic-native/file-opener";
//app版本和权限
import {AppVersion} from "@ionic-native/app-version";
import {AndroidPermissions} from "@ionic-native/android-permissions";
import {HardwareProvider} from '../providers/hardware';
import {BarcodeScanner} from "@ionic-native/barcode-scanner";
import {FileserviceProvider} from '../providers/fileservice';
import {ImagePicker} from "@ionic-native/image-picker";
import {Camera} from "@ionic-native/camera";
import {NativePageTransitions} from "@ionic-native/native-page-transitions";
import {HTTP} from "@ionic-native/http";
import {FileChooser} from "@ionic-native/file-chooser";
import {FilePath} from "@ionic-native/file-path";

@NgModule({
  declarations: [
    MyApp,
    MinePage,
    HomePage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: '',
      backButtonIcon: 'ios-arrow-back',
      pageTransition: "ios-transition",
      scrollAssist: true,
      autoFocusAssist: true
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MinePage,
    HomePage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    //原生场景切换
    NativePageTransitions,

    HTTP,

    //插件提供者
    NativeStorage,
    //版本查询
    AppVersion,
    //安卓权限请求
    AndroidPermissions,

    //文件
    File,
    //文件传输
    FileTransfer,
    //文件打开
    FileOpener,
    BarcodeScanner,

    FileChooser,
    FilePath,

    ImagePicker,
    Camera,

    //自定义基类
    LayerProvider,
    NativeProvider,
    //自定义提供者
    HttpProvider,
    CheckupdateProvider,
    HardwareProvider,
    FileserviceProvider

  ]
})
export class AppModule {
}
