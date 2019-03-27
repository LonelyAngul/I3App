import {Component, ViewChild} from '@angular/core';
import {IonicApp, Keyboard, Nav, Platform, ToastController} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {TabsPage} from '../pages/tabs/tabs';
import {CheckupdateProvider} from "../providers/checkupdate";
import {HttpProvider} from "../providers/http";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  //rootPage: any = TabsPage;
  //rootPage: any = 'LoginPage';
  public rootPage: any = 'LoginPage';
  // public rootPage: any = 'LoginPage';
  //public rootPage: any = 'UploadFilePage';

  //public rootPage: any = 'MineAboutPage';

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public keyboard: Keyboard,
    public ionicApp: IonicApp,
    public toastCtrl: ToastController,
    public checkupdate: CheckupdateProvider,
    public http: HttpProvider
  ) {
    platform.ready().then(() => {

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level storage things you might need.
      //statusBar.overlaysWebView(true);
      statusBar.show();
      splashScreen.hide();

      //注册硬件返回按钮事件
      this.registerBackButtonAction();

      //注册极光推送
      //this.jpush.registerJpush();

      //检查更新
      //this.checkupdate.checkUpdate();

      // this.storage.getItem('token').then(token => {
      //   if (token != null) {
      //     this.http.token = token;
      //     this.http.get('/app/appLogin/getUserInfo').subscribe(res => {
      //       if (res.code == 0) {
      //         this.rootPage = TabsPage;
      //         this.storage.setItem('perms', JSON.stringify(res.perms));
      //         //设置极光推送
      //         this.storage.getItem('username').then(u => {
      //           this.jpush.setAlias(u);
      //         })
      //       } else if (res.code == -100) {
      //         this.rootPage = 'UploadFilePage';
      //       }
      //
      //     })
      //
      //   } else {
      //     this.rootPage = 'UploadFilePage';
      //   }
      //
      // })

    });
  }

  //上下文
  @ViewChild(Nav) nav: Nav;

  /**
   * 注册返回按钮监听事件
   */
  registerBackButtonAction() {
    this.platform.registerBackButtonAction(() => {

      //如果键盘开启则隐藏键盘
      if (this.keyboard.isOpen()) {
        this.keyboard.close();
        return;
      }

      let activePortal = this.ionicApp._modalPortal.getActive() || this.ionicApp._overlayPortal.getActive();
      if (activePortal) {
        activePortal.dismiss();
        return;
      }

      activePortal = this.ionicApp._loadingPortal.getActive();
      if (activePortal) {
        return;
      }

      //获得上下文
      let activeVC = this.nav.getActive();
      let page = activeVC.instance;


      let tabs = page.tabs;
      if (!(page instanceof TabsPage)) {
        if (!this.nav.canGoBack()) {
          return this.showExit();
        }
        return this.nav.pop();
      }

      let activeNav = tabs.getSelected();

      if (!activeNav.canGoBack()) {
        //当前页面为tab栏，退出APP
        return this.showExit();
      }

      //当前页面为tab栏的子页面，正常返回
      return activeNav.pop();

    }, 1);
  }

  private backButtonPressed: boolean = false;//双击退出按钮是否按了2次
  private showExit() {
    if (this.backButtonPressed) {
      this.platform.exitApp();
    }
    else {
      let toast = this.toastCtrl.create({
        message: '再按一次退出应用',
        duration: 2000,
        position: 'middle'
      });
      toast.present();
      this.backButtonPressed = true;
      setTimeout(() => {
        this.backButtonPressed = false;
      }, 2000);
    }
  }
}
