import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthService } from './auth-service';
import { LoginRequest } from './login-request';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnInit{
  form!: UntypedFormGroup;
  constructor(private authService:AuthService){

  }
  ngOnInit(): void {
    this.form = new UntypedFormGroup({
       username: new FormControl('', Validators.required),
       password: new FormControl('',Validators.required)
    });
  }
   onSubmit(){
    let loginRequest = <LoginRequest>{
      username: this.form.controls["username"].value,
      password: this.form.controls["password"].value
   }
    this.authService.login(loginRequest).subscribe({
      next: result =>{
      console.log(result);
    },
    error: result =>{
      console.log("Error" + result)
    }
   });
  }
}