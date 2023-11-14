import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchPageRoutingModule } from './search-routing.module';

import { SearchPage } from './search.page';
import { SharedTweetComponentModule } from 'src/app/components/tweet/shared-tweet-component.module';
import { UsersModule } from 'src/app/components/users/users.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchPageRoutingModule,
    SharedTweetComponentModule,
    UsersModule
  ],
  declarations: [SearchPage]
})
export class SearchPageModule { }
