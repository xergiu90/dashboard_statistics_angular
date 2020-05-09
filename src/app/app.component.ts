import {Component, OnInit, OnDestroy} from '@angular/core';
import {AuthenticationService} from './_services';
import {User} from './_models';
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {ConfigurationService} from '@app/core/configuration.service';
import {filter} from 'rxjs/operators';

@Component({selector: 'app-root', templateUrl: 'app.component.html'})
export class AppComponent implements OnInit, OnDestroy {
    currentUser: User;
    routerEvent: Subscription;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private configurationService: ConfigurationService,
    ) {
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }

    ngOnInit() {
        // Route check
        this.routerEvent = this.router.events
            .pipe(filter((event) => {
                return event instanceof NavigationStart
                    || event instanceof NavigationEnd
                    || event instanceof NavigationError
                    || event instanceof NavigationCancel;
            }))
            .subscribe((event) => {
                this.configurationService.targetRouteUrl = event instanceof NavigationStart
                    ? event.url
                    : null;
            });
    }

    ngOnDestroy(): void {
        this.routerEvent.unsubscribe();
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }


}
