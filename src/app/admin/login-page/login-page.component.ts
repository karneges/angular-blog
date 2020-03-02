import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { User } from '../../shared/interfaces';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  form: FormGroup;

  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.email, Validators.required]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6)
      ])
    });
  }

  submit() {
    if (this.form.invalid) {
      return;
    }
    const user: User = {
      returnSecureToken: true,
      email: this.form.value.email,
      password: this.form.value.password
    };

    this.auth.login(user).subscribe((res) => {
      console.log(res);
      this.form.reset();
      this.router.navigate(['/admin', 'dashboard']);
    });
  }
}