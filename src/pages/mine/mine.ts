import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
// import {StorageProvider} from "../../providers/storage";
import {HttpProvider} from "../../providers/http";

@Component({
  selector: 'page-mine',
  templateUrl: 'mine.html'
})
export class MinePage {

  //用户信息
  userinfo = null;

  constructor(public navCtrl: NavController,
              // public storage: StorageProvider,
              public http: HttpProvider) {
    // this.storage.getItem('userinfo').then(res => {
    //   this.userinfo = res;
    // })

    this.http.get('/app/appLogin/getUserInfo').subscribe(res => {
      if (res.code == 0) {
        this.userinfo = res.obj;
      }
    })

  }


  skipToAbout() {
    this.navCtrl.push("MineAboutPage");
  }

  skipToMineInfo() {
    this.navCtrl.push('MineMyinfoPage');
  }

}
