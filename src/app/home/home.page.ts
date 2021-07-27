import {ChangeDetectorRef, Component} from '@angular/core';
import {InAppPurchase2} from "@ionic-native/in-app-purchase-2/ngx";
import {IAPProduct} from "@ionic-native/in-app-purchase-2";
import {AlertController, Platform} from "@ionic/angular";

const test1 = 'xoals.xoals.test1';
const test2 = 'xoals.xoals.test2';
const test3 = 'xoals.xoals.test3';
const test4 = 'xoals.xoals.test11';
const test5 = 'xoals.xoals.test12';
const test6 = 'xoals.xoals.test13';
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
  freeAfterDay= false;
  freeAfterDay2= false;
  freeAfterDay3= false;
  constructor(private plt: Platform, private store: InAppPurchase2, private alertController: AlertController, private ref: ChangeDetectorRef) {
    this.plt.ready().then(() => {
      // Only for debugging!
      // this.store.verbosity = this.store.DEBUG;
      this.setupListeners();
      this.registerProducts();


      // Get the real product information
      this.store.ready(() => {
        this.products = this.store.products;
        this.ref.detectChanges();
      });
    });
  }

  registerProducts() {
    this.store.register([{
        id: test1,
        type: this.store.PAID_SUBSCRIPTION
      },{
        id: test2,
        type: this.store.PAID_SUBSCRIPTION
      },{
        id: test3,
        type: this.store.FREE_SUBSCRIPTION
      },{
        id:test4,
        type: this.store.FREE_SUBSCRIPTION
      },{
        id:test5,
        type: this.store.FREE_SUBSCRIPTION
      },{
        id:test6,
        type: this.store.FREE_SUBSCRIPTION
      }]
    );
    this.store.refresh();
  }

  setupListeners() {
    this.store.validator ='https://validator.fovea.cc/v1/validate?appName=com.xoals.inapp.exam&apiKey=1f5c8723-04dd-4773-8c8b-17d0b3425264';
    // General query to all products
    this.store.when('product').approved((p: IAPProduct) => {
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
      else if(p.id === test4){
        this.freeAfterDay = true;
      }
      else if(p.id === test5){
        this.freeAfterDay2 = true;
      }
      else if(p.id === test6){
        this.freeAfterDay3 = true;
      }
      this.ref.detectChanges();

      return p.verify();
    })
    .verified((p: IAPProduct) => p.finish());


    this.store.when('product').updated(({id, owned}: IAPProduct)=>{
      if(owned){
        console.log("데이터 발생 확인1 product.id : "+id);
        console.log('p1.owned : '+ owned);
        if(id === test1){
          this.isMonthOneMore = true;
        }
        else if(id === test2){
          this.isDayOneMore = true;
        }
        else if(id === test3){
          this.isDayNo = true;
        }
        else if(id === test4){
          this.freeAfterDay = true;
        }
        else if(id === test5){
          this.freeAfterDay2 = true;
        }
        else if(id === test6){
          this.freeAfterDay3 = true;
        }
      }
      else{
        console.log("데이터 발생 확인2 product.id : "+id);
        console.log('p2.owned : '+ owned);
        if(id === test1){
          this.isMonthOneMore = false;
        }
        else if(id === test2){
          this.isDayOneMore = false;
        }
        else if(id === test3){
          this.isDayNo = false;
        }
        else if(id === test4){
          this.freeAfterDay = false;
        }
        else if(id === test5){
          this.freeAfterDay2 = false;
        }
        else if(id === test6){
          this.freeAfterDay3 = false;
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
    console.log(this.store.products.length);
    this.store.refresh();
    console.log(this.store.products.length);
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
