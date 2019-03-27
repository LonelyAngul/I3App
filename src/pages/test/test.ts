import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
//import {PageView} from "../../app/page-view";
import {HttpProvider} from "../../providers/http";
import {Camera, CameraOptions} from '@ionic-native/camera';
import {ImagePicker, ImagePickerOptions} from "@ionic-native/image-picker";
import {FileserviceProvider} from "../../providers/fileservice";

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import {forkJoin} from "rxjs/observable/forkJoin";
import {HardwareProvider} from "../../providers/hardware";

/**
 * Generated class for the TestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-test',
  templateUrl: 'test.html',
})
export class TestPage {

  //pageView = new PageView(this.httpProvider, "/app/infomation/findData?classifyid=2");//分页数据对象

  constructor(public httpProvider: HttpProvider,
              public navCtrl: NavController,
              public navParams: NavParams,
              private camera: Camera,
              private imagePicker: ImagePicker,
              public fileSev: FileserviceProvider,
              public hardware: HardwareProvider
  ) {


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TestPage');
    // this.httpProvider.get('').mergeMap(aa => {
    //   return this.httpProvider.get('22')
    // }).subscribe();

    //this.httpProvider.get('').switchMap


    // let character = this.httpProvider.get('https://swapi.co/api/people/1');
    // let characterHomeworld = this.httpProvider.get('http://swapi.co/api/planets/1');
    //
    // character.subscribe()
    // characterHomeworld.subscribe()
    //
    //
    // forkJoin([character, characterHomeworld]).subscribe(results => {
    //   // results[0] is our character
    //   // results[1] is our character homeworld
    //   results[0].homeworld = results[1];
    //   let res = results[0];
    // });

  }

  img = null;

  xx() {
    //this.pageView.searchData();

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {

      console.info(imageData)
      //this.img = imageData;
      this.fileSev.uploadFile(imageData, '1212', '/app/appFileUpload/fileUpload', {
        ownerid: '123456',
        uploadFolder: 'app',
        lastModifiedDate: ''
      }).then(res => {
        console.info('++', res)
      })

      // this.fileSev.convertImgToBase64(this.img).subscribe(res => {
      //   console.info(res);
      //   this.img = res;
      // })

      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      let base64Image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error

      console.info(err)

    });

  }

  yy() {

    const options: ImagePickerOptions = {
      maximumImagesCount: 15,
      width: 1024,
      height: 1024,
      quality: 100,
      outputType: 0

    }

    this.imagePicker.getPictures(options).then((results) => {
      if (results.length > 0) {
        this.img = results[0];
      }
      for (var i = 0; i < results.length; i++) {
        console.log('Image URI: ' + results[i]);
      }
    }, (err) => {
    });
  }


  tt() {
    Observable.forkJoin(
      // this.http.get('/links.json').map((response:Response) => response.json()),
      // this.http.get('/bookmarks.json').map((response:Response) => response.json())
    ).subscribe(
      data => {
        // this.links = data[0]
        // this.bookmarks = data[1]
      },
      error => console.error(error)
    );
  }


  ck = [
    {
      a: true,
      b: '1'
    },
    {
      a: false,
      b: '2'
    }, {
      a: false,
      b: '3'
    }
  ]

  updateCucumber() {
    console.log(this.ck);
  }

  getLocation() {
    // alert('请求定位')

  }

}
