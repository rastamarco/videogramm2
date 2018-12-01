import { Component } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';


@Component({
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  credentials: TokenPayload = {
    email: '',
    name: '',
    password: ''
  };

  constructor(private auth: AuthenticationService, private router: Router) {}

  register() {
    if(this.credentials.email === "" || this.credentials.email === "" || this.credentials.password === ""){
      swal("Ooopss", "Os campos não podem ser vazios!","error");
    }else {
      this.auth.register(this.credentials).subscribe(() => {
        this.router.navigateByUrl('/profile');
      }, (err) => {
        console.error(err);
        swal("Ooopss", "Algo está errado: Credenciais incorretas!","error");
      });
    }
  }
}
