import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
<<<<<<< HEAD
import { TweetComponent } from 'src/app/components/tweet/tweet.component';
import { NewTweetComponent } from 'src/app/components/new-tweet/new-tweet.component';
=======
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
/*import { TweetComponent } from 'src/app/components/tweet/tweet.component';
import { NewTweetComponent } from 'src/app/components/new-tweet/new-tweet.component';*/
>>>>>>> caf429e3892ffac80ab0c69cb46c1eb5c96d9d24

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    SharedComponentsModule
  ],
  declarations: [ProfilePage, TweetComponent, NewTweetComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class ProfilePageModule { }
