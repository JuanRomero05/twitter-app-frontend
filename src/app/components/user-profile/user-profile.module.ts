import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './user-profile.component';

@NgModule({
  declarations: [UserProfileComponent],
  imports: [
    CommonModule
  ],
  exports: [UserProfileComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})

export class UserProfileModule { }
