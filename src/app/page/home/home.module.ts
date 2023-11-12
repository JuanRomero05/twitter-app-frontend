import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { SharedTweetComponentModule } from 'src/app/components/tweet/shared-tweet-component.module';
import { NewTweetComponent } from 'src/app/components/new-tweet/new-tweet.component';
//import { SharedNewTweetComponentModule } from 'src/app/components/new-tweet/shared-new-tweet-component.module';
//import { SharedComponentsModule } from 'src/app/components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    HomePageRoutingModule,
    SharedTweetComponentModule,
    //SharedNewTweetComponentModule
    //SharedComponentsModule
  ],
  declarations: [HomePage, NewTweetComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class HomePageModule { }
