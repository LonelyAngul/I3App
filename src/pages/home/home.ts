import {Component} from '@angular/core';
import {Events, NavController} from 'ionic-angular';
import {HttpProvider} from "../../providers/http";
// import {StorageProvider} from "../../providers/storage";
// import {JpushProvider} from "../../providers/jpush";
import {HardwareProvider} from "../../providers/hardware";
// import {InfoPage} from "../info/info";
import {reqHost} from "../../utils/configs";
// import {PageView} from "../../app/page-view";
import {NativePageTransitions} from "@ionic-native/native-page-transitions";
import {pushOption} from "../../utils/constants";
import {CheckupdateProvider} from "../../providers/checkupdate";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  //轮播图
  carouselImgs = [];

  //咨询数据分页对象
  // pageView = new PageView(this.http, '/app/infomation/findData?classifyid=123');

  //是否显示首页菜单图标
  isShowTopMenu = true;

  //定义搜索值
  seacherVal = null;


  //定义权限
  perms = null;

  menu: any = null;


  constructor(public navCtrl: NavController,
              public http: HttpProvider,
              // public storage: StorageProvider,
              // public jpush: JpushProvider,
              public hardware: HardwareProvider,
              private events: Events,
             // public nativePageTransitions: NativePageTransitions
  ) {


    //显示正在加载
    this.http.showLoading();
    //查询轮播图
    //this.getCarouselImage();

    //查询咨询信息
    // this.pageView.searchData().then(() => {
    //   this.http.hideLoading();
    // });


    //定义数组
    let data = [{
      name: '企业查询',
      val: 'EnterpriseListPage',
      ico: 'assets/imgs/home/qycx.png'
    }, {
      name: '经营单位',
      val: 'ShopListPage',
      ico: 'assets/imgs/home/jydw.png'
    }, {
      name: '登记产品',
      val: 'PesticidesPage',
      ico: 'assets/imgs/home/cpdj.png'
    }, {
      name: '农药追溯',
      val: 'scan',
      ico: 'assets/imgs/home/nygh.png'
    }, {
      name: '违法举报',
      val: 'ViolationReportPage',
      ico: 'assets/imgs/home/wgjb.png'
    }, {
      name: '我的消息',
      val: 'MessagePage',
      ico: 'assets/imgs/home/wdxx.png'
    }, {
      name: '农药咨询',
      val: 'skipToInfo',
      ico: 'assets/imgs/home/nyzx.png'
    }];

    // this.storage.getItem("perms").then((res: any) => {
    //   let hasEnterpriseListPage = false;
    //   let hasShopListPage = false;
    //   let hasPesticidesPage = false;
    //   if (res != null) {
    //     res = JSON.parse(res);
    //     for (let a = 0; a < res.length; a++) {
    //       if (res[a] == '/pesticide/prodCorpInfo.xhtml') {
    //         hasEnterpriseListPage = true;
    //       }
    //       if (res[a] == '/pesticide/shop.xhtml') {
    //         hasShopListPage = true;
    //       }
    //       if (res[a] == '/pesticide/pesticides.xhtml') {
    //         hasPesticidesPage = true;
    //       }
    //
    //     }
    //   }
    //   if (hasEnterpriseListPage == false) {
    //     data.splice(this.getIndex(data, '企业查询'), 1);
    //   }
    //   if (hasShopListPage == false) {
    //     data.splice(this.getIndex(data, '经营单位'), 1);
    //   }
    //   if (hasPesticidesPage == false) {
    //     data.splice(this.getIndex(data, '登记产品'), 1);
    //   }
    //
    //
    //   //定义每行显示这么多个
    //   let subArrayNum: number = 4;
    //   let dataArr = new Array(Math.ceil(data.length / subArrayNum));
    //   for (let i = 0; i < dataArr.length; i++) {
    //     //新建数组
    //     dataArr[i] = new Array();
    //     //给每一列赋值
    //     for (let j = 0; j < subArrayNum; j++) {
    //       dataArr[i][j] = null;
    //     }
    //
    //   }
    //   //开始转换
    //   for (let i: number = 0; i < data.length; i++) {
    //     dataArr[parseInt((i / subArrayNum) + "")][i % subArrayNum] = data[i];
    //   }
    //   this.menu = dataArr;
    // });


  }

  /**
   * 获得索引
   * @param data
   * @param name
   */
  getIndex(data, name) {
    let index = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i].name == name) {
        index = i;
        break;
      }
    }

    return index;
  }


  //获得轮播图
  getCarouselImage() {
    this.http.get('/app/appCarouselImage/findData').subscribe((data: any) => {
      if (data.code == -100) {
        console.info('token验证失败')
        this.http.showToast('身份过期,请重新登录');
        this.events.publish('loginOut');
      }

      if (data.code == 0) {
        this.carouselImgs = [];
        for (let i = 0; i < data.obj.length; i++) {
          this.carouselImgs.push({
            'src': reqHost + '/' + data.obj[i].filePath,
            'title': data.obj[i].title
          });

        }
      }
    });

  }

  //返回显示菜单界面
  goHome() {
    this.isShowTopMenu = true;
  }

  //跳转到详细
  skipToDetail(id) {
    //this.nativePageTransitions.slide(pushOption);
    this.navCtrl.push('InfoDetailPage', {'id': id});
  }

  //跳转到咨询界面
  skipToInfo() {
    //this.nativePageTransitions.slide(pushOption);
    // this.navCtrl.push(InfoPage);
  }

  skipTo(page: string) {
    if (page == 'scan') {
      this.scan();
      return;
    }
    if (page == 'skipToInfo') {
      this.skipToInfo();
      return;
    }
    //this.nativePageTransitions.slide(pushOption);
    this.navCtrl.push(page);
  }


  scan(){
    this.navCtrl.push('PesticidePlanningPage', {
      'str': 'https://www.hao123.com'
    });
  }
  //扫码
  scan1() {
    this.hardware.scanner().then(barcodeData => {
      console.info(barcodeData);
      //没有取消扫描
      if (barcodeData.cancelled == false) {

        let txt = barcodeData.text;

        this.navCtrl.push('PesticidePlanningPage', {
              'str': txt
        });

        // if (this.isURL(txt)) {
        //   //是个链接
        //   let el = document.createElement("a");
        //   el.target = '_blank';
        //   el.href = txt;
        //   el.click();
        // } else {
        //   //this.nativePageTransitions.slide(pushOption);
        //   this.navCtrl.push('PesticidePlanningPage', {
        //     'str': txt
        //   });
        // }
      }

    })
  }

  private isURL(reqURL) {
    let reg = /^http(s)?:\/\//;
    if (reg.test(reqURL) == true)
      return true;
    return false;
  }


  //点击搜索
  seacherBar(val?: string) {
    console.info(this.seacherVal)

    if (val && val == 'clear') {
      this.seacherVal = null;
    }

    // this.pageView.searchData({
    //   'title': this.seacherVal
    // })
  }


  //获得焦点
  focusInput() {
    this.isShowTopMenu = false;
  }

  //失去焦点
  blurInput() {
  }

}
