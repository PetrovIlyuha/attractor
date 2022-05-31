import { ToastrService } from 'ngx-toastr';
import { AccountService } from './../_services/account.service';
import {
  AfterContentChecked,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';

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

  constructor(
    private readonly accountService: AccountService,
    private readonly toastNotifications: ToastrService,
    private fb: FormBuilder
  ) {}

  model: any = {};

  ngOnInit(): void {
    this.initializeForm();
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
        this.inputFieldErrors[
          fieldName
        ] = `${fieldName} should be longer for improved security!`;
        return;
      }
      case 'maxlength': {
        this.inputFieldErrors[
          fieldName
        ] = `${fieldName} should be shorter according to our rules!`;
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
    console.log(this.registerForm.value);
    // this.accountService.register(this.model).subscribe({
    //   next: (response) => {
    //     this.cancelRegistration();
    //   },
    //   error: ({ error }) => {
    //     if (typeof error === 'string') {
    //       this.toastNotifications.error(error);
    //     } else {
    //       let errorsOccurred = Object.values(error.errors).flat();
    //       for (let error of errorsOccurred) {
    //         this.toastNotifications.error(error as string);
    //       }
    //     }
    //   },
    // });
  }

  cancelRegistration() {
    this.closeForm.emit(false);
  }
}
