import {Injectable} from '@angular/core';

import 'rxjs/add/operator/map';
import {AlertController, Loading, LoadingController, ModalController, ToastController} from "ionic-angular";


/**
 * 弹窗层
 * @author SCY
 */
@Injectable()
export class LayerProvider {

  constructor(protected modalCtrl: ModalController, protected loadingCtrl: LoadingController, protected alertCtrl: AlertController, protected toast: ToastController) {
  }

  private loading: Loading = null;//定义正在加载对象
  private loadingIsOpen: boolean = false;//是否已经打开了弹窗层
  private isNeedShowLoading: boolean = true;//是否任然需要显示弹窗层
  private isClick = false;//是否点击了,防止快速点击多次,产生多次弹窗

  /**
   *显示正在加载...
   */
  showLoading(msg?: string) {
    //如果点击了,则不能再点击,直接返回
    if (this.isClick)
      return;
    this.isClick = true;//设置为已经点击

    //如果弹窗层是打开状态,则直接返回
    if (this.loadingIsOpen)
      return;

    this.isNeedShowLoading = true;//默认设置需要显示加载层
    setTimeout(() => {
      //如果任然需要显示加载出,并且loading为空状态
      if (this.isNeedShowLoading && this.loading == null) {
        this.loading = this.loadingCtrl.create({
          spinner: "bubbles",
          content: msg == null ? "数据获取中..." : msg,
          //dismissOnPageChange: false, //当页面发生改变时,关闭加载层,最好设置为false
          // duration: 15000
        });
        this.loading.present().then();
        this.loadingIsOpen = true;//加载层在打开状态啦
      }
    }, 500);
  }

  /**
   * 移除正在加载...
   */
  hideLoading() {
    //该时间段以后又可以点击了
    setTimeout(() => {
      this.isClick = false;
    }, 500);

    //数据在时间段内回来了,设置为false,不需要再显示加载层
    this.isNeedShowLoading = false;

    //如果层为打开状态,则关闭,并且设置层对象为null
    if (this.loadingIsOpen) {
      if (this.loading)
        this.loading.dismiss();
      this.loading = null;
    }
    this.loadingIsOpen = false;//层关闭了
  }

  /**************************************alert提示******************************************/
  private isAlert: boolean = true;//是否弹出
  /**
   * 弹出提示框
   * @param title
   * @param content
   */
  showAlert(title: string, subTitle: string = "") {
    if (!this.isAlert)
      return;
    this.isAlert = false;
    this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: [{
        text: '确定',
        handler: () => {
          this.isAlert = true;
        }
      }]
    }).present().then();
  }

  /********************************吐丝提示**************************************/
  private toastObj;

  /**
   *  吐丝提示
   * @param msg
   */
  showToast(msg) {
    if (this.toastObj) {
      this.toastObj.dismissAll();
    }
    this.toastObj = this.toast.create({
      message: msg,
      duration: 4000,
      dismissOnPageChange: true,
      position: 'middle'
    });
    this.toastObj.present();
  }

  /**
   * 错误提示信息
   */
  showHttpErrInfo() {
    this.showToast("数据获取失败!");
  }

  /**
   * 打开一个模态窗口
   * @param component
   * @param beforeEvent 弹出完成后事件
   * @param afterEvent  弹窗销毁时候事件
   */
  openModal(component: any, beforeEvent?, afterEvent?) {
    let modal = this.modalCtrl.create(component);
    modal.present().then(beforeEvent);
    modal.onDidDismiss(afterEvent);
  }

}
