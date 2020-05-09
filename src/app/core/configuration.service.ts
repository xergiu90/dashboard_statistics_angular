import {Injectable} from '@angular/core';
import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Logger} from '@app/core/logger.service';
import {environment} from '@environments/environment';

const log = new Logger('ConfigurationService');

/**
 * Declaration of configuration interface
 */
export interface Configuration {
    hostname: string;
    apiResource: {
        newUsers: string,
        screenFlow: string,
        totalAccounts: string,
        conversionRate: string,
    };
}


/**
 * Global variable containing actual config to use. Initialised via ajax call
 */
export let miselfConfig: Configuration = {
    hostname: '',
    apiResource: {
        newUsers: '/newusers/',
        screenFlow: '/screenflow/',
        totalAccounts: '/totalaccounts/',
        conversionRate: '/conversionrate/',
    },
};

/**
 * Global variable: target route url set on NavigationStart, and removed on NavigationFinish
 */
export let TARGET_ROUTE_URL: string = null;

/**
 * Service in charge of dynamically initialize configuration
 */
@Injectable()
export class ConfigurationService {

    constructor(private http: HttpClient) {
    }

    loadConfiguration(): Promise<boolean> {
        log.debug('Loading configuration...');
        return this.http
            .get(`/assets/config/${environment.configFile}.json`)
            .pipe(catchError((error: any): any => {
                log.error('Configuration loading failed.');
                return throwError(error);
            }))
            .toPromise()
            .then((envResponse: any) => {
                log.debug('Configuration loaded.');
                if (envResponse.hostname !== 'https://myself-statistics-backend.azurewebsites.net') {
                    envResponse.hostname = 'https://myself-statistics-backend.azurewebsites.net';
                }
                miselfConfig = Object.assign(miselfConfig, envResponse);
                return true;
            })
            .catch(() => Promise.reject(false));
    }

    set targetRouteUrl(url: string) {
        TARGET_ROUTE_URL = url;
    }
}
