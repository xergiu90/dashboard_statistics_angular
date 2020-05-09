import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '@environments/environment';
import {miselfConfig} from '@app/core/configuration.service';

/**
 * Prefixes all requests with `kermitConfig.hostname`.
 */
@Injectable()
export class BackendInterceptor implements HttpInterceptor {

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (request.headers) {
            request = request.clone({
                url: miselfConfig.hostname + request.url,
                withCredentials: true,
                headers: request.headers
                    .delete(environment.noErrorInterceptHeader)
                    .append('Content-Type', 'application/json')
            });
        }
        return next.handle(request);
    }

}
