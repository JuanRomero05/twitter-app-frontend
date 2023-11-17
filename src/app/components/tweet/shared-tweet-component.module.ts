import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TweetComponent } from './tweet.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserProfileModule } from '../user-profile/user-profile.module';

@NgModule({
  declarations: [TweetComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UserProfileModule
  ],
  exports: [TweetComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class SharedTweetComponentModule { }
