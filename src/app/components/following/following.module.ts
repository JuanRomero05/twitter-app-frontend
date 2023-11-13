import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FollowingComponent } from './following.component';

@NgModule({
  declarations: [FollowingComponent],
  imports: [
    CommonModule
  ],
  exports: [FollowingComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class FollowingModule { }
