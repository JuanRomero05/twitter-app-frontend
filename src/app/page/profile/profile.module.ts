import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
/* import { SharedComponentsModule } from 'src/app/components/shared-components.module'; */
import { SharedTweetComponentModule } from 'src/app/components/tweet/shared-tweet-component.module';
import { SharedNewTweetComponentModule } from 'src/app/components/new-tweet/shared-new-tweet-component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    SharedTweetComponentModule,
    SharedNewTweetComponentModule
  ],
  declarations: [ProfilePage]
})
export class ProfilePageModule { }
