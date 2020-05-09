import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '@environments/environment';

export interface IParametrizedUrl {
    path: string;
    params: {
        [pid: string]: string | number;
    }
}

export interface IRequestOptions {
    headers?: HttpHeaders;
    observe?: 'body';
    params?: HttpParams;
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
    body?: any;
}

/**
 * Extends HttpClient with per request configuration using dynamic interceptors.
 */
@Injectable()
export class HttpService {

    private static apiHeader(options?: IRequestOptions): IRequestOptions {
        let newOptions = options;
        if (!newOptions) {
            newOptions = {};
        }
        if (!newOptions.headers) {
            newOptions.headers = new HttpHeaders();
        }

        return newOptions;
    }

    public constructor(
        public http: HttpClient,
    ) {
    }

    /**
     * GET request
     * @param {IParametrizedUrl | string} url
     * @param {IRequestOptions} options options of the request like headers, body, etc.
     * @returns {Observable<T>}
     */
    public get<T>(url: IParametrizedUrl | string, options?: IRequestOptions): Observable<T> {
        return this.http.get<T>(this.getUrl(url), HttpService.apiHeader(options));
    }

    /**
     * POST request
     * @param {IParametrizedUrl | string} url
     * @param body
     * @param {IRequestOptions} options options of the request like headers, body, etc.
     * @returns {Observable<T>}
     */
    public post<T>(url: IParametrizedUrl | string, body: any | null, options?: IRequestOptions): Observable<T> {
        return this.http.post<T>(this.getUrl(url), body, HttpService.apiHeader(options));
    }

    /**
     * PUT request
     * @param {IParametrizedUrl | string} url
     * @param {* | null} body
     * @param {IRequestOptions} options options of the request like headers, body, etc.
     * @returns {Observable<T>}
     */
    public patch<T>(url: IParametrizedUrl | string, body: any | null, options?: IRequestOptions): Observable<T> {
        return this.http.patch<T>(this.getUrl(url), body, HttpService.apiHeader(options));
    }

    /**
     * PUT request
     * @param {IParametrizedUrl | string} url
     * @param {* | null} body
     * @param {IRequestOptions} options options of the request like headers, body, etc.
     * @returns {Observable<T>}
     */
    public put<T>(url: IParametrizedUrl | string, body: any | null, options?: IRequestOptions): Observable<T> {
        return this.http.put<T>(this.getUrl(url), body, HttpService.apiHeader(options));
    }

    /**
     * DELETE request
     * @param {IParametrizedUrl | string} url
     * @param {IRequestOptions} options options of the request like headers, body, etc.
     * @returns {Observable<T>}
     */
    public delete<T>(url: IParametrizedUrl | string, options?: IRequestOptions): Observable<T> {
        return this.http.delete<T>(this.getUrl(url), HttpService.apiHeader(options));
    }

    private getUrl(url: IParametrizedUrl | string): string {
        if (typeof url === 'object'
            && url.hasOwnProperty('path')
            && url.hasOwnProperty('params')
        ) {
            const parameterMatcher: RegExp = /(:\w+)/gi;
            const matches: RegExpMatchArray = url.path.match(parameterMatcher);
            let result: string = url.path;
            matches.forEach((value) => {
                if (value[0] === ':') {
                    const paramName = value.substring(1);
                    result = result.replace(value, `${url.params[paramName]}`);
                }
            });
            return result;
        }
        return <string>url;
    }
}
