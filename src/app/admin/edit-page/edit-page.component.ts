import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { PostsService } from '../../shared/posts.service';
import { switchMap } from 'rxjs/operators';
import { Post } from '../../shared/interfaces';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent implements OnInit {
  form: FormGroup;
  currentPost: Post;
  submited = false;
  constructor(
    public route: ActivatedRoute,
    public postsService: PostsService
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params: Params) => {
          return this.postsService.getById(params.id);
        })
      )
      .subscribe((post: Post) => {
        this.currentPost = post;
        this.form = new FormGroup({
          title: new FormControl(post.title, Validators.required),
          text: new FormControl(post.text, Validators.required)
        });
      });
  }

  submit() {
    if (this.form.invalid) {
      return;
    }
    console.log(this.currentPost);
    this.submited = true;
    this.postsService
      .update({
        ...this.currentPost,
        text: this.form.value.text,
        title: this.form.value.title
      })
      .subscribe(() => {
        this.submited = false;
      });
  }
}
