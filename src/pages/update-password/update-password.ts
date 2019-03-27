import {Component} from '@angular/core';
import {Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {FormBuilder, Validators} from "@angular/forms";
import {HttpProvider} from "../../providers/http";


@IonicPage()
@Component({
  selector: 'page-update-password',
  templateUrl: 'update-password.html',
})
export class UpdatePasswordPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public formBuilder: FormBuilder,
              public http: HttpProvider,
              public events: Events) {


    //定义登录表单
    this.form = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(3)]],
      firstPassword: ['', [Validators.required, Validators.minLength(3)]],
      secondPassword: ['', [Validators.required, Validators.minLength(3)]]
    });

  }

  isSubmitted: boolean = false;//是否提交
  form: any;//登录表单


  ionViewDidLoad() {
  }

  submit(val) {
    this.isSubmitted = true;
    if (val.firstPassword != val.secondPassword) {
      this.http.showAlert('提示信息', '两次输入的新密码不一样!');
      return;
    }
    this.http.post('/app/appLogin/updatePassword', val, null, 'application/x-www-form-urlencoded').subscribe(res => {
      console.info(res)
      if (res.code == 0) {
        this.http.showAlert('提示信息', '修改成功,请重新登录!');
        this.events.publish('loginOut');
      } else {
        this.http.showToast(res.msg);
      }
    })

  }


}
