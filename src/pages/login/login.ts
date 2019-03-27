import {Component} from '@angular/core';
import {Events, IonicPage, NavController} from 'ionic-angular';
import {HttpProvider} from "../../providers/http";
import {FormBuilder, Validators} from "@angular/forms";
import {TabsPage} from "../tabs/tabs";

/**
 * 用户登录
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  /* constructor(public navCtrl: NavController, public navParams: NavParams) {
   }

   ionViewDidLoad() {
     console.log('ionViewDidLoad LoginPage');
   }*/

  isSubmitted: boolean = false;//是否提交
  loginForm: any;//登录表单

  constructor(public http: HttpProvider,
              public navCtrl: NavController,
              public formBuilder: FormBuilder,
              public events: Events) {


    //定义登录表单
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });

    //注册极光推送
    //this.jpush.registerJpush();

  }

  login(logininfo) {
    this.isSubmitted = true;//已经提交
    this.http.showLoading('正在登录中...');
    this.http.get('/app/appLogin/login', logininfo).subscribe((res: any) => {
      this.http.hideLoading();
      if (res.code == 0) {
        //this.storage.setItem('token', res.token);
        //this.storage.setItem('username', logininfo.username);
        console.info('数据', res.perms)
        //this.storage.setItem('perms', JSON.stringify(res.perms));
        //this.jpush.setAlias(logininfo.username);
        this.http.token = res.token;
        this.navCtrl.setRoot(TabsPage);
      } else {
        this.http.showToast(res.msg);
      }
    });
    //   if (res.code == 0) {
    //     let userinfo = res.obj;
    //
    //     //清空存储
    //     // this.storageProvider.clear();
    //     //
    //     // //存储用户信息
    //     // this.storageProvider.put("userinfo", userinfo);
    //     //
    //     // //存储登录信息,用户名和密码
    //     // this.storageProvider.put("logininfo", logininfo);
    //     //
    //     // //发布登录通知
    //     // this.events.publish("user:login", userinfo);
    //     //
    //     // //投诉查询查询
    //     // this.events.publish("complanTS");
    //     //
    //     // //卸载当前视图
    //     // this.viewCtrl.dismiss(userinfo);
    //   } else {
    //     // this.httpProvider.showToast(res.msg)
    //   }
    //
    // })

  }
}
