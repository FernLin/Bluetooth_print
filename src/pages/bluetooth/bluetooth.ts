///<reference path="../../services/gbk.d.ts"/>
import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, LoadingController, IonicPage } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';

@IonicPage()
@Component({
  selector: 'page-bluetooth',
  templateUrl: 'bluetooth.html',
})
export class BluetoothPage {

  items: Array<any> = [];
  line: string;
  gbkdata;
  addBtnShow: boolean = true;
  resetBtnShow: boolean = false;
  address;
  name;
  loading;


  constructor(public navCtrl: NavController,
    public cd: ChangeDetectorRef,
    private bluetoothSerial: BluetoothSerial,
    public loadingCtrl: LoadingController, ) {
    this.line =
      '! 0 200 200 520 1' + '\r\n' +
      'JOURNAL' + '\r\n' +
      'CONTRAST 0' + '\r\n' +
      'TONE 0' + '\r\n' +
      'PW 568' + '\r\n' +
      'COUNTRY CHINA' + '\r\n' +
      'SETMAG 2 2 \r\n' + '\r\n' +
      ";// PAGE 0000000004000237" + '\r\n' +
      'T 55 0 200 10 不合格标识' + '\r\n' +
      'SETMAG 1 2 \r\n' + '\r\n' +
      'T 55 0 60 60 退料单位: K2' + '\r\n' +
      'T 55 0 60 100 物料编号: 2220294701' + '\r\n' +
      'T 55 0 60 140 物料名称: 底壳组件' + '\r\n' +
      'T 55 0 60 180 退料数量: 1' + '\r\n' +
      'T 55 0 60 220 生产厂家: 984041' + '\r\n' +
      'T 55 0 60 260 型号规格: 1' + '\r\n' +
      'T 55 0 60 300 接收单位: 物资回收中心' + '\r\n' +
      'T 55 0 60 340 备注: 来料不良' + '\r\n' +
      'BARCODE-TEXT 0 0 0\r\n' + '\r\n' +
      'B 128 1 30 70 150 400 WZH1803200001' + '\r\n' +
      // 'FORM' + '\r\n' +
      'PRINT' + '\r\n';//换行符结束命令，开始执行命令
    this.loading = this.loadingCtrl.create({});
    this.loading.present();
  }

  ionViewDidEnter() {
    this.loading.dismiss();
    //如果localstorage中有对应的值，则隐藏【添加设备】按钮，显示【重置设备】按钮
    if (window.localStorage.getItem('address') != null) {
      this.address = window.localStorage.getItem('address');
      this.name = window.localStorage.getItem('name');
      this.addBtnShow = false;
      this.resetBtnShow = true;
    }

  }

  //打印数据
  print() {
    if (window.localStorage.getItem('address') == null) {
      alert("请先添加蓝牙打印设备！");
      return;
    }
    this.conect();
  }

  //连接设备并打印数据
  conect(loader: boolean = true) {
    let loading = this.loadingCtrl.create({});
    if (loader) {
      loading.present();
    }
    this.bluetoothSerial.connect(this.address).subscribe(res => {
      if (loader) {
        loading.dismiss();
      }
      this.bluetoothSerial.write(this.stringToArrayBuffer(this.line));
    });

  }

  //添加设备：跳转至添加设备页面
  add() {
    this.navCtrl.push('PrintPage');
  }

  //重置设备
  reset() {
    window.localStorage.clear();
    this.bluetoothSerial.disconnect();
    this.addBtnShow = true;
    this.resetBtnShow = false;
    this.ionViewDidEnter();
  }


  /**
     * 将字符串转化为字节数组
     * @param str 待转义字符串
     */
  stringToArrayBuffer(str) {
    var ret = new Uint8Array(this.getStringLength(str));
    for (var i = 0, j = 0; i < str.length; i++ , j++) {
      if (str.charCodeAt(i) > 19968 && str.charCodeAt(i) < 40869) {
        this.gbkdata = $URL.encode(str.charAt(i)).split("%");
        for (var k = 1; k < 3; k++ , j++) {
          ret[j] = parseInt(this.gbkdata[k], 16);
        }
        j--;
      } else {
        ret[j] = str.charCodeAt(i);
      }
    }
    return ret.buffer;
  }

  //获取字符串的长度（有一个汉字，长度+1）
  getStringLength(str: string) {
    var stringLength = str.length;
    for (var i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) > 19968 && str.charCodeAt(i) < 40869) {
        stringLength++;
      }
    }
    return stringLength;
  }
}
