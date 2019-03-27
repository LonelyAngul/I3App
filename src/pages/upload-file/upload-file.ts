import {Component, NgZone} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {FileTransfer, FileUploadOptions, FileTransferObject} from "@ionic-native/file-transfer";
import {FileChooser} from '@ionic-native/file-chooser';

import {FileInfo} from "../../app/model";

/**
 * Generated class for the UploadFilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-upload-file',
  templateUrl: 'upload-file.html',
})
export class UploadFilePage {


  //文件
  fileObjList: FileInfo[] = [];

  //文件拥有id
  enclosureid = null;

  private fileTransfer: FileTransferObject = null;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public transfer: FileTransfer,
              public ngZone: NgZone,
              private fileChooser: FileChooser
  ) {
  }

  ionViewDidLoad() {
  }

  upload() {
    //创建文件传输对象
    this.fileTransfer = this.transfer.create();

    let options: FileUploadOptions = {
      fileKey: 'file',
      fileName: 'name.jpg',
      headers: {}
    }

    //进度监测
    this.fileTransfer.onProgress((event: ProgressEvent): void => {
      this.ngZone.run(() => {
        var pogress = Math.floor((event.loaded / event.total) * 100);
        //this.uploading.setContent("正在下载：" + downloadProgress + "%");
      });

    });


    this.fileTransfer.upload('文件路径', '请求地址', options, true
    )
      .then((data) => {

        console.info(data)
        // success
      }, (err) => {
        // error
        console.info(err)
      })


  }

  open() {
    this.fileChooser.open()
      .then(uri => console.log(uri))
      .catch(e => console.log(e));
  }

}
