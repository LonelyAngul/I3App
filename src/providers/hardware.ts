import {Injectable} from '@angular/core';
import {NativeProvider} from "./base/native";
import {Platform} from "ionic-angular";
import {BarcodeScanner} from "@ionic-native/barcode-scanner";

/**
 *  @author SCY
 *
 * 扫码功能
 * $ ionic cordova plugin add phonegap-plugin-barcodescanner
 * $ npm install --save @ionic-native/barcode-scanner
 *
 *
 */

//定义百度地图变量
declare var baidumap_location;

@Injectable()
export class HardwareProvider extends NativeProvider {

  constructor(protected platform: Platform, protected barcodeScanner: BarcodeScanner) {
    super(platform);
  }

  /**
   * 硬件扫描
   */
  async scanner() {
    if (this.isMobile()) {
      return this.barcodeScanner.scan().then(barcodeData => barcodeData, () => null);
    }
    console.info('网页端不可调用');
    return null;
  }

  /**
   * 获取当前位置信息
   * @returns {Promise<any>}
   */
  getBaiduMapLocation() {


  }

}
