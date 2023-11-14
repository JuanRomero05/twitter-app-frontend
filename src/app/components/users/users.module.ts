import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';

@NgModule({
  declarations: [UsersComponent],
  imports: [
    CommonModule
  ],
  exports: [UsersComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class UsersModule { }
