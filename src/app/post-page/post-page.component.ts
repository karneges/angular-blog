import { Component, OnInit } from '@angular/core';
import { PostsService } from '../shared/posts.service';
import { ActivatedRoute, Params, Route } from '@angular/router';
import { Post } from '../shared/interfaces';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.scss']
})
export class PostPageComponent implements OnInit {
  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute
  ) {}
  public post$: Observable<Post>;
  ngOnInit(): void {
    this.post$ = this.route.params.pipe(
      switchMap((params: Params) => {
        return this.postsService.getById(params.id);
      })
    );
  }
}
