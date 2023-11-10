import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewTweetComponent } from './new-tweet.component';

@NgModule({
  declarations: [NewTweetComponent],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule
  ],
  exports: [NewTweetComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]

})
export class SharedNewTweetComponentModule { }
