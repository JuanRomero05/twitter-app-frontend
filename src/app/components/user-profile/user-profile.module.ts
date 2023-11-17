import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './user-profile.component';
import { UsersModule } from '../users/users.module';
import { SharedTweetComponentModule } from '../tweet/shared-tweet-component.module';

@NgModule({
  declarations: [UserProfileComponent],
  imports: [
    CommonModule,
    UsersModule
  ],
  exports: [UserProfileComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})

export class UserProfileModule { }
