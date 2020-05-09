import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {HomeService} from '@app/home/services/home.service';

@Injectable()
export class NewUsersResolver implements Resolve<Observable<{}>> {
    constructor(private homeService: HomeService) {}

    resolve(route: ActivatedRouteSnapshot) {
        return this.homeService.getNewUsers('month');
    }
}

@Injectable()
export class ScreenFlowResolver implements Resolve<Observable<{}>> {
    constructor(private homeService: HomeService) {}

    resolve(route: ActivatedRouteSnapshot) {
        return this.homeService.getScreenFlow('month');
    }
}

@Injectable()
export class TotalAccountsResolver implements Resolve<Observable<{}>> {
    constructor(private homeService: HomeService) {}

    resolve(route: ActivatedRouteSnapshot) {
        return this.homeService.getTotalAccounts('month');
    }
}

@Injectable()
export class ConversionRateResolver implements Resolve<Observable<{}>> {
    constructor(private homeService: HomeService) {}

    resolve(route: ActivatedRouteSnapshot) {
        return this.homeService.getConversionRate('month');
    }
}
