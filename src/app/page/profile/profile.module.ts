import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import { TweetComponent } from 'src/app/components/tweet/tweet.component';
import { NewTweetComponent } from 'src/app/components/new-tweet/new-tweet.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ProfilePageRoutingModule
  ],
  declarations: [ProfilePage, TweetComponent, NewTweetComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class ProfilePageModule { }
