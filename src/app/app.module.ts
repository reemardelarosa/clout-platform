import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { OwlModule } from 'ng2-owl-carousel';

// modules
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { IcoModule } from './ico/ico.module';
import { FeedModule } from './feed/feed.module';
import { AltcoinModule } from './altcoin/altcoin.module';
import {
  AuthService,
  ApiService,
  ApiHelperService,
  BroadcastService,
  ModalService,
  CommentService,
  FollowService,
  FeedService
} from './services';

import { NumberSeparator } from './pipes';
import { HttpModule } from '@angular/http';

// components
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'ico-ng'}),
    // external modules
    NgbModule.forRoot(),
    // internal modules
    CoreModule,
    FeedModule,
    AltcoinModule,
    IcoModule,
    // base routing modules
    AppRoutingModule,
    HttpModule,
    OwlModule,
    InfiniteScrollModule
  ],
  providers: [AuthService, ApiService, ApiHelperService, BroadcastService, NumberSeparator, ModalService, CommentService, FollowService, FeedService],
  bootstrap: [AppComponent]
})
export class AppModule { }
