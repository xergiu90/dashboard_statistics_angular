import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule, HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';

// used to create fake backend
import {fakeBackendProvider} from './_helpers';

import {AppComponent} from './app.component';
import {AppRouterModule} from './app.routing';

import {AlertComponent} from './_components';
import {JwtInterceptor, ErrorInterceptor} from './_helpers';
import {HomeComponent} from './home';
import {LoginComponent} from './login';
import {RegisterComponent} from './register';
import {MaterialModule} from '@app/material.module';
import {CommonModule} from '@angular/common';
import {ChartsModule} from 'ng4-charts';
import {MatIconModule} from '@angular/material';
import {HomeService} from '@app/home/services/home.service';
import {HttpService} from '@app/_services/http.service';
import {ConfigurationService} from '@app/core/configuration.service';
import {RouterModule} from '@angular/router';
import {ConversionRateResolver, NewUsersResolver, ScreenFlowResolver, TotalAccountsResolver} from '@app/home/services/home.resolver';
import {BackendInterceptor} from '@app/core/interceptor/backend.interceptor';

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRouterModule,
        MaterialModule,
        CommonModule,
        ChartsModule,
        FormsModule,
        MatIconModule,
        RouterModule
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        LoginComponent,
        RegisterComponent
    ],
    providers: [
        {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
        // provider used to create fake backend
        fakeBackendProvider,
        HomeService,
        NewUsersResolver,
        ScreenFlowResolver,
        TotalAccountsResolver,
        ConversionRateResolver,
        ConfigurationService,
        {
            provide: APP_INITIALIZER,
            useFactory: configFactory,
            multi: true,
            deps: [ConfigurationService]
        }
        ,
        {
            provide: HttpService,
            useFactory: httpServiceFactory,
            deps: [HttpClient]
        }
        ,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: BackendInterceptor,
            multi: true
        },
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
}

export function configFactory(configurationService: ConfigurationService) {
    return () => {
        return configurationService
            .loadConfiguration()
            .catch((error) => {
                // If the configuration cannot be loaded, the app should display a visual indication to the user
                return Promise.reject(error);
            });
    };
}


export function httpServiceFactory(httpClient: HttpClient) {
    return new HttpService(httpClient);
}
