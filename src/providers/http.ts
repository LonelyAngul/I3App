import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';

import "rxjs/add/operator/map";
import 'rxjs/add/operator/toPromise';
import "rxjs/add/operator/catch";
import 'rxjs/add/observable/throw';

import {Observable} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {reqHost} from "../utils/configs";
import {LayerProvider} from "./base/layer";
import {AlertController, LoadingController, ModalController, ToastController} from "ionic-angular";

/**
 * 网络请求
 * @author SCY
 */
@Injectable()
export class HttpProvider extends LayerProvider {

  constructor(protected http: HttpClient,
              protected modalCtrl: ModalController,
              protected loadingCtrl: LoadingController,
              protected alertCtrl: AlertController,
              protected toast: ToastController) {
    super(modalCtrl, loadingCtrl, alertCtrl, toast);
  }

  //设置token,默认没有token
  public token: string = null;

  /**
   * get请求
   * @param {string} reqURL 请求地址
   * @param {{}} parameter 请求参数
   * @returns {Promise<any>}
   */
  public get(url: string, parameter?: {}): Observable<any> {
    let httpParams = new HttpParams();
    if (parameter) {
      for (let key in parameter) {
        if (parameter[key])
          httpParams = httpParams.append(key, parameter[key]);
      }
    }
    let httpHeaders = new HttpHeaders();

    //设置token
    if (this.token) {
      httpHeaders = httpHeaders.append('token', this.token);
    }

    httpHeaders = httpHeaders.append('Content-Type', 'text/plain');

    return this.http.get(this.URL(url), {
      headers: httpHeaders,
      params: httpParams
    }).pipe(
      map(body => {
        return body || {}
      }),
      catchError((error: Response | any) => {
        console.info('get请求失败:', error);
        this.hideLoading();
        this.showHttpErrInfo();
        return Observable.throw(error);
      })
    );
  }


  /**
   * post请求
   * @param {string} url 请求地址
   * @param body 请求数据体
   * @param {{}} parameter 请求参数
   * @param {string} contentType Content-Type类型
   * @returns {Promise<any>}
   */
  public post(url: string, body?: any, parameter?: {}, contentType?: string) {
    let httpParams = new HttpParams();
    if (parameter) {
      for (let key in parameter) {
        if (parameter[key])
          httpParams = httpParams.append(key, parameter[key]);
      }
    }
    let httpHeaders = new HttpHeaders();

    //设置token
    if (this.token) {
      httpHeaders = httpHeaders.append('token', this.token);
    }

    //自定义参数传输形式
    if (contentType && contentType.length > 0) {
      httpHeaders = httpHeaders.append('Content-Type', contentType);

      //转换字串
      if (contentType == 'application/x-www-form-urlencoded') {
        let tempArray = [];
        for (let key in body) {
          tempArray.push(key + '=' + body[key]);
        }
        body = tempArray.join('&');
      }

    } else
    //--复杂请求:不设置则body必须为json对象,不能使用JSON.stringify()转换成json字串,设置application/json;charset=UTF-8以后body转不转都可以
      httpHeaders = httpHeaders.append('Content-Type', 'application/json');

    //--默认类型
    //httpHeaders = httpHeaders.append('Content-Type', 'text/plain');

    //--form表单形式传输
    //httpHeaders = httpHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

    //--文件传输
    //httpHeaders = httpHeaders.append('Content-Type', 'multipart/form-data');

    return this.http.post(this.URL(url), body, {
      headers: httpHeaders,
      params: httpParams
    }).pipe(
      map(body => {
        return body || {}
      }),
      catchError((error: Response | any) => {
        console.info('post请求失败:', error);
        this.hideLoading();
        this.showHttpErrInfo();
        return Observable.throw(error);
      })
    );

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

  /**
   * get请求(同步)
   * 形如:let res = await this.wget('...')
   * @param url
   * @param parameter
   */
  public wget: any = (url: string, parameter?: {}) => {
    return new Promise((resolve) => {
      this.get(url, parameter).subscribe((body) => {
        resolve(body);
      })
    });
  };

  /**
   * post请求(同步)
   * @param url
   * @param body
   * @param parameter
   * @param contentType
   */
  public wpost: any = (url: string, body?: any, parameter?: {}, contentType?: string) => {
    return new Promise((resolve) => {
      this.post(url, parameter, contentType).subscribe((body) => {
        resolve(body);
      })
    });
  };
}
