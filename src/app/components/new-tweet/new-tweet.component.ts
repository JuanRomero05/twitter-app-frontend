import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-tweet',
  templateUrl: './new-tweet.component.html',
  styleUrls: ['./new-tweet.component.scss'],
})
export class NewTweetComponent implements OnInit {

  isModalOpen = true;
  newTweetForm: FormGroup;

  constructor(
    public fb: FormBuilder,
  ) {

    this.newTweetForm = this.fb.group({
      'newTweet': new FormControl("", Validators.required),
    });

  }

  ngOnInit() { }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }
}
