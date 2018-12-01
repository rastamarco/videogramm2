import { Component } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  templateUrl: './login.component.html'
})
export class LoginComponent {
  credentials: TokenPayload = {
    email: '',
    password: ''
  };

  constructor(private auth: AuthenticationService, private router: Router) {}

  login() {
    if(this.credentials.email == "" || this.credentials.password == ""){
      swal("Ooopss", "Os campos não podem ser vazios!","error");
    }else {
      this.auth.login(this.credentials).subscribe(() => {
        this.router.navigateByUrl('/profile');
      }, (err) => {
        swal("Ooopss", "Algo está errado: Senha ou email inválidos!","error");
      }); 

    }
  
  }
}
