import {Routes, RouterModule, Router} from '@angular/router';

import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { AuthGuard } from './_guards';
import {ConversionRateResolver, NewUsersResolver, ScreenFlowResolver, TotalAccountsResolver} from '@app/home/services/home.resolver';
import {NgModule} from '@angular/core';

const appRoutes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard], resolve: {
            newUsers: NewUsersResolver,
            screenFlow: ScreenFlowResolver,
            totalAccounts: TotalAccountsResolver,
            conversionRate: ConversionRateResolver,
        }},
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule],
    providers: [NewUsersResolver]
})
export class AppRouterModule {}
