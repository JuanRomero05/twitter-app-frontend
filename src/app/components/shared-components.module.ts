<<<<<<< HEAD
/* import { NgModule } from '@angular/core';
=======
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
>>>>>>> caf429e3892ffac80ab0c69cb46c1eb5c96d9d24
import { CommonModule } from '@angular/common';
import { TweetComponent } from "./tweet/tweet.component";
import { NewTweetComponent } from './new-tweet/new-tweet.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [TweetComponent, NewTweetComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [TweetComponent, NewTweetComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class SharedComponentsModule { }
 */