import { ToastrService } from 'ngx-toastr';
import { AccountService } from './../_services/account.service';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { countries } from '../_utils/countries_dictionary';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Router } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  @Output() closeForm = new EventEmitter();
  registerForm: FormGroup;
  inputFieldErrors = {};
  bsConfig: Partial<BsDatepickerConfig>;
  maxRegisterDate: Date;
  registerErrors: string[] = [];

  countries: string[] = countries;

  constructor(
    private readonly accountService: AccountService,
    private readonly toastNotifications: ToastrService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.bsConfig = {
      ...this.bsConfig,
      containerClass: 'theme-dark-blue',
      dateInputFormat: 'DD MMMM YYYY',
    };
  }

  model: any = {};

  ngOnInit(): void {
    this.initializeForm();
    this.maxRegisterDate = new Date();
    this.maxRegisterDate.setFullYear(this.maxRegisterDate.getFullYear() - 18);
  }

  initializeForm() {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      gender: ['male'],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
        ],
      ],
      confirmPassword: [
        '',
        [Validators.required, this.matchValues('password')],
      ],
    });
    this.registerForm.controls.password.valueChanges.subscribe(() => {
      this.registerForm.controls.confirmPassword.updateValueAndValidity();
    });
  }

  fieldIsInvalid(fieldName: string) {
    const errorDiscovered =
      this.registerForm.get(fieldName).errors &&
      this.registerForm.get(fieldName).touched;
    if (errorDiscovered) {
      const errorType = Object.keys(this.registerForm.get(fieldName).errors)[0];
      this.markExistingInputErrors(fieldName, errorType);
    } else {
      this.inputFieldErrors[fieldName] = '';
    }
    return errorDiscovered;
  }

  markExistingInputErrors(fieldName: string, errorType: string) {
    switch (errorType) {
      case 'required': {
        this.inputFieldErrors[fieldName] = `This field is required!`;
        return;
      }
      case 'minlength': {
        this.inputFieldErrors[fieldName] = `${fieldName} should be longer!`;
        return;
      }
      case 'maxlength': {
        this.inputFieldErrors[fieldName] = `${fieldName} should be shorter!`;
        return;
      }
      case 'passwordsMismatch': {
        this.inputFieldErrors['confirmPassword'] = `Passwords don't match`;
        return;
      }
      default:
        return;
    }
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.controls[matchTo].value
        ? null
        : { passwordsMismatch: true };
    };
  }

  register() {
    this.accountService.register(this.registerForm.value).subscribe({
      next: (response) => {
        this.router.navigateByUrl('/members');
      },
      error: (error) => {
        this.registerErrors = error;
      },
    });
  }

  cancelRegistration() {
    this.closeForm.emit(false);
  }
}
