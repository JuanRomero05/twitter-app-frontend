import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.scss'],
})
export class FollowingComponent implements OnInit {

  isFollowing = false;

  toggleFollow() {
    this.isFollowing = !this.isFollowing;
  }

  constructor() { }

  ngOnInit() { }

}
