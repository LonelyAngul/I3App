import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ActionSheetController, AlertController, ModalController} from "ionic-angular";
import {FileserviceProvider} from "../../providers/fileservice";
import {FileInfo} from "../../app/model";
import {reqHost} from "../../utils/configs";
import {HttpProvider} from "../../providers/http";

@Component({
  selector: 'select-picture',
  templateUrl: 'select-picture.html'
})
export class SelectPictureComponent {
  @Input() max: number = 4;  //最多可选择多少张图片，默认为4张

  @Input() allowAdd: boolean = true;  //是否允许新增

  @Input() allowDelete: boolean = true;  //是否允许删除

  @Input() ownerid: string = null;//拥有者id

  @Input() fileObjList: FileInfo[] = [];   //图片列表,与fileObjListChange形成双向数据绑定
  
  @Output() fileObjListChange = new EventEmitter<any>();

  constructor(private modalCtrl: ModalController,
              private alertCtrl: AlertController,
              private actionSheetCtrl: ActionSheetController,
              private fileSev: FileserviceProvider,
              public http: HttpProvider) {
  }

  //新增照片
  addPicture() {
    let that = this;
    that.actionSheetCtrl.create({
      buttons: [
        {
          text: '从相册选择',
          handler: () => {

            this.fileSev.getMultiplePicture(this.ownerid, {}).subscribe((res: any) => {

              if (res == null)
                return;

              let rep = JSON.parse(res.response);
              console.info('图库里面选择出来的', rep)
              if (rep.code == 0) {
                console.info(reqHost + rep.obj.path)
                this.getPictureSuccess(rep.obj.id, reqHost + rep.obj.path, rep.obj.filename)
              }


            })


            // that.fileSev.getMultiplePicture({//从相册多选.+
            //   maximumImagesCount: (that.max - that.fileObjList.length),
            //   destinationType: 1//期望返回的图片格式,1图片路径
            // }).subscribe(imgs => {
            //   for (let img of <string[]>imgs) {
            //     that.getPictureSuccess(img);
            //   }
            // });
          }
        },
        {
          text: '拍照',
          handler: () => {
            that.fileSev.getPictureByCamera(that.ownerid, {}).subscribe((res: any) => {
              let rep = JSON.parse(res.response);
              console.info('自豪', rep)
              if (rep.code == 0) {
                console.info(reqHost + rep.obj.path)
                this.getPictureSuccess(rep.obj.id, reqHost + rep.obj.path, rep.obj.filename)
              }

            });


            // that.fileSev.getPictureByCamera({
            //   destinationType: 1//期望返回的图片格式,1图片路径
            // }).subscribe(img => {
            //   that.getPictureSuccess(img);
            // });
          }
        }, {
          text: '从文件选择',
          handler: () => {
            that.fileSev.getFileChooser(that.ownerid, {}).subscribe((res: any) => {
              let rep = JSON.parse(res.response);
              if (rep.code == 0) {
                console.info(reqHost + rep.obj.path)
                this.getPictureSuccess(rep.obj.id, reqHost + rep.obj.path, rep.obj.filename)
              }

            });
          }
        },
        {
          text: '取消',
          role: 'cancel'
        }
      ]
    }).present();
  }

  //删除照片
  deletePicture(i) {
    if (!this.allowDelete) {
      return;
    }
    this.alertCtrl.create({
      title: '确认删除？',
      buttons: [{text: '取消'},
        {
          text: '确定',
          handler: () => {
            console.info(this.fileObjList)
            let delId = [];
            delId.push(this.fileObjList[i].id)
            this.http.post('/app/appFileUpload/delete', delId).subscribe(res => {
              console.info(res);
              if (res.code == 0) {
                this.fileObjList.splice(i, 1);
                this.http.showToast('删除成功!')
              }
            })
          }
        }
      ]
    }).present();
  }

  //照片预览
  viewerPicture(index) {
    let picturePaths = [];
    for (let fileObj of this.fileObjList) {
      picturePaths.push(fileObj.origPath);
    }
    this.modalCtrl.create("PreviewPicturePage", {'initialSlide': index, 'picturePaths': picturePaths}).present();
  }

  private getPictureSuccess(id, img, filename) {
    let fileObj = <FileInfo>{'id': id, 'origPath': img, 'thumbPath': img, 'filename': filename};
    this.fileObjList.push(fileObj);
    this.fileObjListChange.emit(this.fileObjList);
  }

  isImage(url) {
    let isImg = true;
    var index1 = url.lastIndexOf(".");
    var index2 = url.length;
    var last = url.substring(index1 + 1, index2);//后缀

    let sx = 'JPG,JPEG,PNG,GIF,BMP,jpg,jpeg,png,gif,bmp';
    if (last) {
      if (sx.indexOf(last) > -1) {
        isImg = true;
      } else {
        isImg = false;
      }
    }
    return isImg;
  }


}
