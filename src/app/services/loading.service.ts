import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {

    loading = null;

    constructor(
        public loadingController: LoadingController
    ) { }

    async presentLoading() {
        if (this.loading) {
            this.loading.dismiss();
            this.loading = null;
        }
        this.loading = await this.loadingController.create({
            spinner: "crescent",
            translucent: true,
            cssClass: 'my-loading-class',
        });
        await this.loading.present();
    }
    dismissLoading(event = null) {
        if (this.loading) {
            this.loading.dismiss();
        } else if(!event) {
            setTimeout(()=>{ this.dismissLoading() },100);
        }
        if (event && event.target) {
            event.target.complete();
        }
        this.loading = null;
    }
}
