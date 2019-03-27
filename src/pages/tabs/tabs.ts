import {Component, ViewChild} from '@angular/core';

import {MinePage} from '../mine/mine';
import {HomePage} from '../home/home';
import {Events, NavController, Tabs} from "ionic-angular";

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  @ViewChild('mainTabs') tabs: Tabs;

  tab1Root = HomePage;
  tab2Root = 'TestPage';
  tab3Root = MinePage;

  constructor(private nav: NavController, private events: Events,/* public storage: StorageProvider*/) {

    let funLoginOut = () => {
      //this.storage.clear();
      this.nav.setRoot('LoginPage');
    };

    //跳转到登录页面
    this.events.unsubscribe('loginOut');
    this.events.subscribe('loginOut', funLoginOut);


  }

  ionViewDidLoad() {
    let funMsgDetail = (data) => {
      this.nav.push('MessageDetailPage', {
        data: data
      });
    };

    //跳转到消息详细界面
    this.events.unsubscribe('msgDetail');
    this.events.subscribe('msgDetail', funMsgDetail);
  }

}
