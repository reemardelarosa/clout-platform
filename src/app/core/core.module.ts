import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { OwlModule } from 'ng2-owl-carousel';
import { Ng2FlatpickrComponent } from 'ng2-flatpickr/ng2-flatpickr';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PercentPipe, AlphabeticCoinsPipe } from './../pipes';

// components
import {
  HeaderComponent,
  ShellComponent,
  CoinsAlphabeticDropdownComponent
} from './shell';
import {
  LoginComponent,
  RegisterComponent,
  ConfirmUserComponent,
  SocialFacebookComponent,
  ResetInputBtnComponent,
  FacebookAuthBtnComponent,
  ModalComponent,
  CommentListComponent,
  FollowBtnComponent,
  LoaderLineComponent,
  ResetPasswordComponent,
  NavsSwitcherComponent
} from './components';
import {
  CommentItemComponent
} from './components/comment-list/components';
import { AutomaticGetDataByUrlDirective } from '../directives/automatic-get-data-by-url.directive';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    OwlModule
  ],
  declarations: [
    HeaderComponent,
    ShellComponent,
    LoginComponent,
    RegisterComponent,
    ConfirmUserComponent,
    SocialFacebookComponent,
    ResetInputBtnComponent,
    FacebookAuthBtnComponent,
    ModalComponent,
    CommentListComponent,
    CommentItemComponent,
    FollowBtnComponent,
    LoaderLineComponent,
    ResetPasswordComponent,
    PercentPipe,
    AlphabeticCoinsPipe,
    AutomaticGetDataByUrlDirective,
    CoinsAlphabeticDropdownComponent,
    NavsSwitcherComponent,
    Ng2FlatpickrComponent
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    CommentListComponent,
    ModalComponent,
    FollowBtnComponent,
    LoaderLineComponent,
    PercentPipe,
    AutomaticGetDataByUrlDirective,
    NavsSwitcherComponent,
    ResetInputBtnComponent,
    Ng2FlatpickrComponent
  ]
})
export class CoreModule { }
