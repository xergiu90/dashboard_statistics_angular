import {Injectable} from '@angular/core';
import {HttpService} from '@app/_services/http.service';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {Logger} from '@app/core/logger.service';
import {miselfConfig} from '@app/core/configuration.service';

const log = new Logger('HomeService');

@Injectable()
export class HomeService {

    private logError = (error: any): Observable<never> => {
        log.error(error);
        return throwError(error);
    };

    constructor(private httpService: HttpService) {
    }

    getNewUsers(period: string): Observable<{}> {
        const data: any = Object.assign({},
            {
                period: period
            }
        );
        return this.httpService
            .get<{}>(miselfConfig.apiResource.newUsers, {
                params: data,
            })
            .pipe(
                map((daysData: {}) => {
                    return daysData;
                }),
                catchError((error) => this.logError(error))
            );
    }

    getScreenFlow(period: string): Observable<{}> {
        const data: any = Object.assign({},
            {
                period: period
            }
        );
        return this.httpService
            .get<{}>(miselfConfig.apiResource.screenFlow, {
                params: data,
            })
            .pipe(
                map((daysData: {}) => {
                    return daysData;
                }),
                catchError((error) => this.logError(error))
            );
    }

    getTotalAccounts(period: string): Observable<{}> {
        const data: any = Object.assign({},
            {
                period: period
            }
        );
        return this.httpService
            .get<{}>(miselfConfig.apiResource.totalAccounts, {
                params: data,
            })
            .pipe(
                map((daysData: {}) => {
                    return daysData;
                }),
                catchError((error) => this.logError(error))
            );
    }

    getConversionRate(period: string): Observable<{}> {
        const data: any = Object.assign({},
            {
                period: period
            }
        );
        return this.httpService
            .get<{}>(miselfConfig.apiResource.conversionRate, {
                params: data,
            })
            .pipe(
                map((daysData: {}) => {
                    return daysData;
                }),
                catchError((error) => this.logError(error))
            );
    }
}
