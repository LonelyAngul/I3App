import {Injectable, NgZone} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {ImagePicker} from "@ionic-native/image-picker";
import {File, FileEntry} from "@ionic-native/file";
import {Camera, CameraOptions} from "@ionic-native/camera";

import {FileTransfer, FileTransferObject, FileUploadOptions} from '@ionic-native/file-transfer';
import {reqHost} from "../utils/configs";
import {LoadingController} from "ionic-angular";
import {FileChooser} from "@ionic-native/file-chooser";

import {FilePath} from '@ionic-native/file-path';

/**
 * 文件操作
 * 图片获取
 * $ ionic cordova plugin add cordova-plugin-telerik-imagepicker --variable PHOTO_LIBRARY_USAGE_DESCRIPTION="your usage message"
 $ npm install --save @ionic-native/image-picker
 *
 *  相机
 * $ ionic cordova plugin add cordova-plugin-camera
 $ npm install --save @ionic-native/camera
 *
 *
 * $ ionic cordova plugin add cordova-plugin-filepath
 $ npm install --save @ionic-native/file-path

 $ ionic cordova plugin add cordova-plugin-filechooser
 $ npm install --save @ionic-native/file-chooser
 *
 */
@Injectable()
export class FileserviceProvider {

  constructor(private imagePicker: ImagePicker,
              private file: File,
              protected transfer: FileTransfer,
              private camera: Camera,
              public ngZone: NgZone,
              protected loadingCtrl: LoadingController,
              private filePath: FilePath,
              private fileChooser: FileChooser) {
    console.log('Hello FileserviceProvider Provider');
  }

  /**
   * 带有http请求头则直接返回,否则加上hostURL并返回
   * @param reqURL 请求地址
   * @returns {string}
   */
  private URL(reqURL): string {
    let reg = /^http(s)?:\/\//;
    if (reg.test(reqURL) == true)
      return reqURL;
    return reqHost + reqURL;
  }

  private fileTransfer: FileTransferObject = null;//this.transfer.create();//创建文件传输对象
  private uploading = null;//上载对象
  /**
   *
   * @param localFilePath 本地文件存储地址
   * @param fileName  文件命名
   * @param reqURL  目前地址
   * @returns {Promise<any>}
   */
  uploadFile(localFilePath, fileName, reqURL, params?: {}) {

    console.info('上传地址', localFilePath)

    let options: FileUploadOptions = {
      fileKey: 'file',
      fileName: fileName,
      params: params == null ? {} : params
    };

    console.info('请求地址', this.URL(reqURL));
    return new Promise((resolve) => {
      this.fileTransfer = this.transfer.create();
      this.fileTransfer.upload(localFilePath, this.URL(reqURL), options, true).then((data) => {
        console.info("上传成功:", data);
        //this.layer.hideLoading();
        //this.uploading.dismiss();
        resolve(data);
      }, err => {
        //this.uploading.dismiss();
        //this.layer.hideLoading();
        //this.layer.showToast("上传失败!");
        console.info("上传失败!", err);
      }).catch((ch) => {
        console.info(ch);
      });

      //进度监测
      // this.fileTransfer.onProgress((event: ProgressEvent): void => {
      //   this.ngZone.run(() => {
      //     var progress = Math.floor((event.loaded / event.total) * 100);
      //     this.uploading.setContent("正在上传：" + progress + "%");
      //   });
      //
      // });

    });
  }


  /**
   * 通过图库选择多图
   * @param options
   */
  getMultiplePicture(ownerid: string, options = {}): Observable<any> {
    let that = this;
    let ops = Object.assign({
      maximumImagesCount: 6,
      width: 1024,//缩放图像的宽度（像素）
      height: 1024,//缩放图像的高度（像素）
      quality: 100//图像质量，范围为0 - 100
    }, options);
    return Observable.create(observer => {
      this.imagePicker.getPictures(ops).then(files => {
        console.info('图库', files)
        if (files == 'OK' || files.length == 0) {
          return;
        }


        //终止前一个下载
        // this.fileTransfer.abort();

        // this.uploading = this.loadingCtrl.create({
        //   content: "正在连接服务器...",
        //   dismissOnPageChange: false,
        //   enableBackdropDismiss: false
        // });
        // this.uploading.present();

        // //下载进度监测
        // this.fileTransfer.onProgress((event: ProgressEvent): void => {
        //   this.ngZone.run(() => {
        //     var downloadProgress = Math.floor((event.loaded / event.total) * 100);
        //     this.uploading.setContent("正在上传：" + downloadProgress + "%");
        //   });
        //
        // });

        for (let f of files) {

          console.info('文件遍历', f)

          this.uploadFile(f, f, '/app/appFileUpload/fileUpload', {
            ownerid: ownerid,
            uploadFolder: 'app',
            lastModifiedDate: ''
          }).then(res => {
            console.info('结果', res)
            observer.next(res);
          })


        }


        //observer.next(files);

        // let destinationType = options['destinationType'] || 0;//0:base64字符串,1:图片url
        // if (destinationType === 1) {
        //   observer.next(files);
        // } else {
        //   let imgBase64s = [];//base64字符串数组
        //   for (let fileUrl of files) {
        //     that.convertImgToBase64(fileUrl).subscribe(base64 => {
        //       imgBase64s.push(base64);
        //       if (imgBase64s.length === files.length) {
        //         observer.next(imgBase64s);
        //       }
        //     })
        //   }
        // }
      }).catch(err => {
        //this.alert('获取照片失败');
      });
    });
  };

  /**
   * 根据图片绝对路径转化为base64字符串
   * @param path 绝对路径
   */
  convertImgToBase64(path: string): Observable<string> {
    return Observable.create(observer => {
      this.file.resolveLocalFilesystemUrl(path).then((fileEnter: FileEntry) => {
        fileEnter.file(file => {
          let reader = new FileReader();
          reader.onloadend = function (e) {
            observer.next(this.result);
          };
          reader.readAsDataURL(file);
        });
      }).catch(err => {
        //this.logger.log(err, '根据图片绝对路径转化为base64字符串失败');
        console.info('转换错误', err)
      });
    });
  }


  getPictureByCamera(ownerid: string, options: CameraOptions = {}): Observable<string> {
    //获得配置项
    const ops: CameraOptions = Object.assign({
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }, options);
    return Observable.create(observer => {

      this.camera.getPicture(options).then((imageData) => {
        console.info('本地地址', imageData)


        //终止前一个下载
        // this.fileTransfer.abort();

        // this.uploading = this.loadingCtrl.create({
        //   content: "正在连接服务器...",
        //   dismissOnPageChange: false,
        //   enableBackdropDismiss: false
        // });
        // this.uploading.present();

        // //下载进度监测
        // this.fileTransfer.onProgress((event: ProgressEvent): void => {
        //   this.ngZone.run(() => {
        //     var downloadProgress = Math.floor((event.loaded / event.total) * 100);
        //     this.uploading.setContent("正在上传：" + downloadProgress + "%");
        //   });
        //
        // });

        //this.img = imageData;
        this.uploadFile(imageData, imageData, '/app/appFileUpload/fileUpload', {
          ownerid: ownerid,
          uploadFolder: 'app',
          lastModifiedDate: ''
        }).then(res => {
          console.info('结果', res)
          observer.next(res);
        })
      }, (err) => {
        console.info(err);
        observer.next(err);
      });

    });

  }


  /**
   * 通过拍照获取照片
   * @param options
   */
  getPictureByCamera1(options: CameraOptions = {}): Observable<string> {
    let ops: CameraOptions = Object.assign({
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.DATA_URL//DATA_URL: 0 base64字符串, FILE_URI: 1图片路径
    }, options);
    return this.getPicture(ops);
  };

  /**
   * 使用cordova-plugin-camera获取照片
   * @param options
   */
  getPicture(options: CameraOptions = {}): Observable<string> {
    let ops: CameraOptions = Object.assign({
      sourceType: this.camera.PictureSourceType.CAMERA,//图片来源,CAMERA:拍照,PHOTOLIBRARY:相册
      destinationType: this.camera.DestinationType.DATA_URL,//默认返回base64字符串,DATA_URL:base64   FILE_URI:图片路径
      quality: 100,//图像质量，范围为0 - 100
      allowEdit: false,//选择图片前是否允许编辑
      encodingType: this.camera.EncodingType.JPEG,
      targetWidth: 1024,//缩放图像的宽度（像素）
      targetHeight: 1024,//缩放图像的高度（像素）
      saveToPhotoAlbum: false,//是否保存到相册
      correctOrientation: true//设置摄像机拍摄的图像是否为正确的方向
    }, options);
    return Observable.create(observer => {
      this.camera.getPicture(ops).then((imgData: string) => {

        console.info('相机', imgData)

        if (ops.destinationType === this.camera.DestinationType.DATA_URL) {
          observer.next('data:image/jpg;base64,' + imgData);
        } else {
          observer.next(imgData);
        }
      }).catch(err => {
        if (err == 20) {
          //this.alert('没有权限,请在设置中开启权限');
          return;
        }
        if (String(err).indexOf('cancel') != -1) {
          return;
        }
        // this.logger.log(err, '使用cordova-plugin-camera获取照片失败');
        //this.alert('获取照片失败');
      });
    });
  };


  //从文件选择
  getFileChooser(ownerid: string, options: CameraOptions = {}): Observable<string> {

    return Observable.create(observer => {
      this.fileChooser.open().then(url => {

        //url = url.replace("%25", ":");
        console.info('获取到的文件信息', url)

        this.filePath.resolveNativePath(url)
          .then(filePath => {

            this.uploadFile(filePath, filePath, '/app/appFileUpload/fileUpload', {
              ownerid: ownerid,
              uploadFolder: 'app',
              lastModifiedDate: ''
            }).then(res => {
              console.info('结果', res)
              observer.next(res);
            })

          })
          .catch(err => console.log(err));

      }).catch(e => console.log(e));

    });

  }

}
