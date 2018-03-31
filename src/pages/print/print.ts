import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';


@IonicPage()
@Component({
  selector: 'page-print',
  templateUrl: 'print.html',
})
export class PrintPage {

  items: Array<any> = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private bluetoothSerial: BluetoothSerial,
    public loadingCtrl: LoadingController, ) {
    window.localStorage.clear();
  }

  //发现设备
  search(loader: boolean = true) {
    let loading = this.loadingCtrl.create({});
    if (loader) {
      loading.present();
    }
    this.bluetoothSerial.isEnabled().then(res => {
      this.bluetoothSerial.discoverUnpaired().then(res => {
        if (loader) {
          loading.dismiss();
        }
        this.items = res;
      }).catch(res => {
        alert("无可用设备");
        alert(res);
      });
    }).catch(res => {
      alert("未启用蓝牙");
      if (loader) {
        loading.dismiss();
      }
    });
  }

  //添加目标设备后断开连接并返回打印页面
  add(item, loader: boolean = true) {
    let loading = this.loadingCtrl.create({});
    if (loader) {
      loading.present();
    }
    this.bluetoothSerial.connect(item.address).subscribe(res => {
      if (loader) {
        loading.dismiss();
      }
      window.localStorage.setItem('address', item.address);
      window.localStorage.setItem('name', item.name);
      this.disconnect(item.name);
    });
  }

  //断开连接并返回打印页面
  disconnect(printername: string) {
    this.bluetoothSerial.disconnect().then(res => {
      alert('成功添加设备：' + printername);
      this.navCtrl.pop();
    })
  }

}
