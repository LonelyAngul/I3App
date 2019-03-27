import {Injectable, NgZone} from '@angular/core';
import {AlertController, LoadingController, Platform} from "ionic-angular";
import {FileOpener} from "@ionic-native/file-opener";

import {File} from '@ionic-native/file';
import {FileTransfer, FileTransferObject} from '@ionic-native/file-transfer';

import {AppVersion} from "@ionic-native/app-version";
import "rxjs/add/operator/map";
import 'rxjs/add/operator/toPromise';
import "rxjs/add/operator/catch";
import 'rxjs/add/observable/throw';
import {AndroidPermissions} from "@ionic-native/android-permissions";
import {checkURL} from "../utils/configs";
import {HTTP} from "@ionic-native/http";

/**
 *
 * 检查APP更新



 */
@Injectable()
export class CheckupdateProvider {

  constructor(
    public platform: Platform,
    public appVersion: AppVersion,
    public ngZone: NgZone,
    public fileOpener: FileOpener,
    public transfer: FileTransfer,
    public file: File,
    public androidPermissions: AndroidPermissions,
    protected loadingCtrl: LoadingController,
    protected alertCtrl: AlertController,
    private http: HTTP
  ) {
  }

  private checkURL: string = checkURL;
  private fileTransfer: FileTransferObject = this.transfer.create();//创建文件传输对象
  private uploading = null;//上载对象


  /**
   * 是否真机环境
   */
  isMobile(): boolean {
    return this.platform.is('mobile') && !this.platform.is('mobileweb');
  }

  /**
   * 是否android真机环境
   */
  isAndroid(): boolean {
    return this.isMobile() && this.platform.is('android');
  }

  /**
   * 获取app版本信息对象
   * @returns {AppVersion}
   */
  getAppVersion() {
    if (this.isMobile())
      return this.appVersion;
    return null;
  }

  /**
   * 检测更新
   */
  checkUpdate() {
    //如果非安卓系统,直接返回
    if (!this.isAndroid()) {
      console.info("非安卓环境")
      return;
    }

    //创建文件传输对象,因为在app启动的时候必须先保证能成功创建这个对象,才能够正常下载
    this.fileTransfer = this.transfer.create();


    //检测本地apk版本号
    if (this.getAppVersion() == null) {
      return;
    }
    this.getAppVersion().getVersionCode().then((version) => {
      //获取服务器更新版本号
      this.http.get(this.checkURL, {}, {}).then((res: any) => {
        console.info('当前app版本号:', version, ',返回结果:', res);
        if (res.status == 200) {
          //字串转json
          res = JSON.parse(res.data);
          if ((version + "") != (res.version + "")) {
            console.info('开始更新:', version, res.version);
            this.updateAPK(res.download_url);
          }
        } else {
          console.info('请求失败!');
        }
      });

    })
  }


  /**
   * 更新apk
   * @param reqURL
   */
  updateAPK(reqURL) {
    //请求存储权限
    try {
      this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(result => {
        if (result.hasPermission == false) {
          //不更新
          this.uploading.dismiss();
        }
      });
    } catch (e) {
      console.info(e)
    }

    //弹出下载提示
    this.alertCtrl.create({//显示下载进度
      title: '检测到新版本!',
      enableBackdropDismiss: false,
      buttons: [{
        text: '立即更新', handler: () => {
          //终止前一个下载
          this.fileTransfer.abort();

          this.uploading = this.loadingCtrl.create({
            content: "正在请求服务器...",
            dismissOnPageChange: false,
            enableBackdropDismiss: false
          });
          this.uploading.present();

          //下载进度监测
          this.fileTransfer.onProgress((event: ProgressEvent): void => {
            this.ngZone.run(() => {
              var downloadProgress = Math.floor((event.loaded / event.total) * 100);
              this.uploading.setContent("正在下载：" + downloadProgress + "%");
            });

          });

          //此处存储在外部存储上,必须要拥有存储权限,存储在根目录/scy下
          let filePath = this.file.externalRootDirectory + 'scy/' + this.getDateStr() + '.apk'.replace('file://', '');
          //下载完成
          this.fileTransfer.download(reqURL, filePath).then((entry) => {
            this.uploading.dismiss();
            //打开安卓apk文件,application/vnd.android.package-archive
            this.openFile(entry.toURL(), 'application/vnd.android.package-archive').then();
          }, (e) => {
            console.log("外部存储设备没有访问权限", e);
          });

        }
      }
      ]
    }).present();
  }

  /**
   * 打开文件
   * @param url  打开url
   * @param mimeTypes 打开的文件类型,application/*  ,application/vnd.android.package-archive
   */
  openFile(url, mimeTypes?: string) {
    return new Promise((resolve) => {
      this.fileOpener.open(url, mimeTypes == null ? 'application/*' : mimeTypes).then((entry) => {
        resolve(entry);
      }).catch(e => console.log('打开失败', e));
    });
  }

  /**
   * 获取当前日期字串
   */
  getDateStr() {
    var date = new Date();
    var year = date.getFullYear().toString();
    var month: any = date.getMonth() + 1;
    month = month < 10 ? '0' + month : month.toString();
    var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate().toString();
    var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    return year + month + day + hour + minute + second + date.getMilliseconds();
  }

}
