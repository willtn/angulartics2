import { Injectable, Optional } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Location } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { TransitionService, UrlService } from '@uirouter/angular';
import 'rxjs/add/operator/filter';

@Injectable()
export class Angulartics2 {
  public settings: any = {
    pageTracking: {
      autoTrackVirtualPages: true,
      basePath: '',
      excludedRoutes: []
    },
    eventTracking: {},
    developerMode: false
  };

  /*
    @Param: ({url: string, location: Location})
   */
  public pageTrack: ReplaySubject<any> = new ReplaySubject(10);

  /*
    @Param: ({action: any, properties: any})
   */
  public eventTrack: ReplaySubject<any> = new ReplaySubject(10);

  /*
    @Param: (properties: any)
   */
  public exceptionTrack: ReplaySubject<any> = new ReplaySubject(10);

  /*
    @Param: (alias: string)
   */
  public setAlias: ReplaySubject<any> = new ReplaySubject(10);

  /*
    @Param: (userId: string)
   */
  public setUsername: ReplaySubject<any> = new ReplaySubject(10);

  /*
    @Param: ({action: any, properties: any})
   */
  public setUserProperties: ReplaySubject<any> = new ReplaySubject(10);

  /*
    @Param: (properties: any)
   */
  public setUserPropertiesOnce: ReplaySubject<any> = new ReplaySubject(10);

  /*
    @Param: (properties: any)
   */
  public setSuperProperties: ReplaySubject<any> = new ReplaySubject(10);

  /*
    @Param: (properties: any)
   */
  public setSuperPropertiesOnce: ReplaySubject<any> = new ReplaySubject(10);

  /*
    @Param: (properties: any)
   */
  public userTimings: ReplaySubject<any> = new ReplaySubject(10);

  constructor(location: Location, @Optional() router: Router, @Optional() transitionService: TransitionService, @Optional() urlService: UrlService) {
    if (router) {
      this.trackLocationWithRouter(location, router);
    }

    if (transitionService && urlService) {
      this.trackLocationWithTransition(location, transitionService, urlService);
    }
  }

  trackLocationWithRouter(location: Location, router: Router) {
    router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe((event: NavigationEnd) => {
        if (!this.settings.developerMode) {
          this.trackUrlChange(event.urlAfterRedirects, location);
        }
      });
  }

  trackLocationWithTransition(location: Location, transitionService: TransitionService, urlService: UrlService) {
    transitionService.onFinish({}, (transition) => {
      if (!this.settings.developerMode) {
        this.trackUrlChange(urlService.path(), location);
      }
    })
  }

  virtualPageviews(value: boolean) {
    this.settings.pageTracking.autoTrackVirtualPages = value;
  }
  excludeRoutes(routes: Array<string | RegExp>) {
    this.settings.pageTracking.excludedRoutes = routes;
  }
  firstPageview(value: boolean) {
    this.settings.pageTracking.autoTrackFirstPage = value;
  }
  withBase(value: string) {
    this.settings.pageTracking.basePath = (value);
  }
  developerMode(value: boolean) {
    this.settings.developerMode = value;
  }

  protected trackUrlChange(url: string, location: Location) {
    if (!this.settings.developerMode) {
      if (this.settings.pageTracking.autoTrackVirtualPages && !this.matchesExcludedRoute(url)) {
        this.pageTrack.next({
          path: this.settings.pageTracking.basePath.length ? this.settings.pageTracking.basePath + url : location.prepareExternalUrl(url),
          location: location
        });
      }
    }
  }

  protected matchesExcludedRoute(url: string): boolean {
    for (let excludedRoute of this.settings.pageTracking.excludedRoutes) {
      if ((excludedRoute instanceof RegExp && excludedRoute.test(url)) || url.indexOf(excludedRoute) > -1) {
        return true;
      }
    }
    return false;
  }
}
