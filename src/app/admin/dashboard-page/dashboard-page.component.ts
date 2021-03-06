import { Component, OnDestroy, OnInit } from '@angular/core';
import { PostsService } from '../../shared/posts.service';
import { Post } from '../../shared/interfaces';
import { Subscription } from 'rxjs';
import { log } from 'util';
import { AlertServices } from '../shared/services/alert.services';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  posts: Post[];
  pSub: Subscription;
  search = '';
  constructor(public postsService: PostsService, public alert: AlertServices) {}
  ngOnInit(): void {
    this.pSub = this.postsService.getAll().subscribe(posts => {
      console.log(posts);
      this.posts = posts;
    });
  }

  ngOnDestroy(): void {
    if (this.pSub) {
      this.pSub.unsubscribe();
    }
  }

  onRemove(id: string) {
    this.postsService.remove(id).subscribe(() => {
      this.alert.danger('Пост удалён');
      this.posts = this.posts.filter(post => post.id !== id);
    });
  }
}
