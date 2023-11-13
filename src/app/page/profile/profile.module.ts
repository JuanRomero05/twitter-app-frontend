import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import { SharedTweetComponentModule } from 'src/app/components/tweet/shared-tweet-component.module';
import { FollowingModule } from 'src/app/components/following/following.module';
import { FollowersModule } from 'src/app/components/followers/followers.module';
//import { SharedNewTweetComponentModule } from 'src/app/components/new-tweet/shared-new-tweet-component.module';
//import { SharedComponentsModule } from 'src/app/components/shared-components.module';
//import { TweetComponent } from 'src/app/components/tweet/tweet.component';
//import { NewTweetComponent } from 'src/app/components/new-tweet/new-tweet.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    SharedTweetComponentModule,
    FollowingModule,
    FollowersModule
    //SharedNewTweetComponentModule,
    /* SharedComponentsModule */
  ],
  declarations: [ProfilePage/*, TweetComponent, NewTweetComponent */],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class ProfilePageModule { }
