import { NgModule } from '@angular/core';
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
  exports: [TweetComponent, NewTweetComponent]
})
export class SharedComponentsModule { }
