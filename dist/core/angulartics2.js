import { Injectable, Optional } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Location } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { TransitionService, UrlService } from '@uirouter/angular';
import 'rxjs/add/operator/filter';
var Angulartics2 = /** @class */ (function () {
    function Angulartics2(location, router, transitionService, urlService) {
        this.settings = {
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
        this.pageTrack = new ReplaySubject(10);
        /*
          @Param: ({action: any, properties: any})
         */
        this.eventTrack = new ReplaySubject(10);
        /*
          @Param: (properties: any)
         */
        this.exceptionTrack = new ReplaySubject(10);
        /*
          @Param: (alias: string)
         */
        this.setAlias = new ReplaySubject(10);
        /*
          @Param: (userId: string)
         */
        this.setUsername = new ReplaySubject(10);
        /*
          @Param: ({action: any, properties: any})
         */
        this.setUserProperties = new ReplaySubject(10);
        /*
          @Param: (properties: any)
         */
        this.setUserPropertiesOnce = new ReplaySubject(10);
        /*
          @Param: (properties: any)
         */
        this.setSuperProperties = new ReplaySubject(10);
        /*
          @Param: (properties: any)
         */
        this.setSuperPropertiesOnce = new ReplaySubject(10);
        /*
          @Param: (properties: any)
         */
        this.userTimings = new ReplaySubject(10);
        if (router) {
            this.trackLocationWithRouter(location, router);
        }
        if (transitionService && urlService) {
            this.trackLocationWithTransition(location, transitionService, urlService);
        }
    }
    Angulartics2.prototype.trackLocationWithRouter = function (location, router) {
        var _this = this;
        router.events
            .filter(function (event) { return event instanceof NavigationEnd; })
            .subscribe(function (event) {
            if (!_this.settings.developerMode) {
                _this.trackUrlChange(event.urlAfterRedirects, location);
            }
        });
    };
    Angulartics2.prototype.trackLocationWithTransition = function (location, transitionService, urlService) {
        var _this = this;
        transitionService.onFinish({}, function (transition) {
            if (!_this.settings.developerMode) {
                _this.trackUrlChange(urlService.path(), location);
            }
        });
    };
    Angulartics2.prototype.virtualPageviews = function (value) {
        this.settings.pageTracking.autoTrackVirtualPages = value;
    };
    Angulartics2.prototype.excludeRoutes = function (routes) {
        this.settings.pageTracking.excludedRoutes = routes;
    };
    Angulartics2.prototype.firstPageview = function (value) {
        this.settings.pageTracking.autoTrackFirstPage = value;
    };
    Angulartics2.prototype.withBase = function (value) {
        this.settings.pageTracking.basePath = (value);
    };
    Angulartics2.prototype.developerMode = function (value) {
        this.settings.developerMode = value;
    };
    Angulartics2.prototype.trackUrlChange = function (url, location) {
        if (!this.settings.developerMode) {
            if (this.settings.pageTracking.autoTrackVirtualPages && !this.matchesExcludedRoute(url)) {
                this.pageTrack.next({
                    path: this.settings.pageTracking.basePath.length ? this.settings.pageTracking.basePath + url : location.prepareExternalUrl(url),
                    location: location
                });
            }
        }
    };
    Angulartics2.prototype.matchesExcludedRoute = function (url) {
        for (var _i = 0, _a = this.settings.pageTracking.excludedRoutes; _i < _a.length; _i++) {
            var excludedRoute = _a[_i];
            if ((excludedRoute instanceof RegExp && excludedRoute.test(url)) || url.indexOf(excludedRoute) > -1) {
                return true;
            }
        }
        return false;
    };
    Angulartics2.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    Angulartics2.ctorParameters = function () { return [
        { type: Location, },
        { type: Router, decorators: [{ type: Optional },] },
        { type: TransitionService, decorators: [{ type: Optional },] },
        { type: UrlService, decorators: [{ type: Optional },] },
    ]; };
    return Angulartics2;
}());
export { Angulartics2 };
