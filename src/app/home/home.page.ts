import {ChangeDetectorRef, Component} from '@angular/core';
import {InAppPurchase2} from "@ionic-native/in-app-purchase-2/ngx";
import {IAPProduct} from "@ionic-native/in-app-purchase-2";
import {AlertController, Platform} from "@ionic/angular";

const test1 = 'xoals.xoals.test1';
const test2 = 'xoals.xoals.test2';
const test3 = 'xoals.xoals.test3';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  gems = 0;
  isPro = false;
  products: IAPProduct[] = [];
  isMonthOneMore= false;
  isDayOneMore= false;
  isDayNo= false;
  constructor(private plt: Platform, private store: InAppPurchase2, private alertController: AlertController, private ref: ChangeDetectorRef) {
    this.plt.ready().then(() => {
      // Only for debugging!
      // this.store.verbosity = this.store.DEBUG;

      this.registerProducts();
      this.setupListeners();

      // Get the real product information
      this.store.ready(() => {
        this.products = this.store.products;
        for(var i=0; i<this.products.length; i++){
          console.log(' products id 확인 : '+this.products[i].id);
          console.log(' products id owned확인 : '+this.products[i].owned);
        }
        this.ref.detectChanges();
      });
    });
  }

  registerProducts() {
    this.store.register([{
        id: test2,
        type: this.store.PAID_SUBSCRIPTION
      },{
        id: test3,
        type: this.store.PAID_SUBSCRIPTION
      },{
        id: test1,
        type: this.store.PAID_SUBSCRIPTION
      }]
    );
    this.store.refresh();
  }

  setupListeners() {
    this.store.validator ='https://billing.fovea.cc/아이디:xoals22421';
    // General query to all products
    this.store.when('product')
    .approved((p: IAPProduct) => {
      // Handle the product deliverable
      if(p.id === test1){
        this.isMonthOneMore = true;
      }
      else if(p.id === test2){
        this.isDayOneMore = true;
      }
      else if(p.id === test3){
        this.isDayNo = true;
      }
      this.ref.detectChanges();

      return p.verify();
    })
    .verified((p: IAPProduct) => p.finish());


    this.store.when('product').updated((p : IAPProduct)=>{
      if(p.owned){
        console.log("데이터 발생 확인1 product.id : "+p.id);
        console.log('p1.owned : '+ p.owned);
        if(p.id === test1){
          this.isMonthOneMore = true;
        }
        else if(p.id === test2){
          this.isDayOneMore = true;
        }
        else if(p.id === test3){
          this.isDayNo = true;
        }
      }
      else{
        console.log("데이터 발생 확인2 product.id : "+p.id);
        console.log('p2.owned : '+ p.owned);
        if(p.id === test1){
          this.isMonthOneMore = false;
        }
        else if(p.id === test2){
          this.isDayOneMore = false;
        }
        else if(p.id === test3){
          this.isDayNo = false;
        }
      }
      this.ref.detectChanges();
    });
  }

  purchase(product: IAPProduct) {
    console.log(product.id);
    this.store.order(product).then(p => {
      // Purchase in progress!
    }, e => {
      this.presentAlert('Failed', `Failed to purchase: ${e}`);
    });
  }

  // To comply with AppStore rules
  restore() {
    this.store.refresh();
  }

  async presentAlert(header, message) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

}
