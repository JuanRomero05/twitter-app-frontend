import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FollowersComponent } from './followers.component';

@NgModule({
  declarations: [FollowersComponent],
  imports: [
    CommonModule
  ],
  exports: [FollowersComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class FollowersModule { }
