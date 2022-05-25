import { ToastrService } from 'ngx-toastr';
import { MembersService } from 'src/app/_services/members.service';
import { AccountService } from './../../_services/account.service';
import { environment } from 'src/environments/environment';
import { Component, Input, OnInit } from '@angular/core';
import { Member } from 'src/app/_models/member.interface';
import { FileUploader } from 'ng2-file-upload';
import { User } from 'src/app/_models/user.interface';
import { take } from 'rxjs';
import { faUpload, faBan, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Photo } from 'src/app/_models/photo.interface';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css'],
})
export class PhotoEditorComponent implements OnInit {
  trashIcon = faTrash;
  uploadIcon = faUpload;
  banIcon = faBan;

  @Input() member: Member;
  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  user: User;

  constructor(
    private accountService: AccountService,
    private memberService: MembersService,
    private toastNotifications: ToastrService
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => {
        this.user = user;
      },
    });
  }

  ngOnInit(): void {
    this.initializeUploader();
  }

  fileOverBase(e: any) {
    this.hasBaseDropZoneOver = e;
  }

  setMainPhoto(photo: Photo) {
    this.memberService.setPhotoAsMain(photo.id).subscribe({
      next: () => {
        this.user.photoUrl = photo.url;
        this.accountService.setCurrentUser(this.user);
        this.member.photoUrl = photo.url;
        this.member.photos = this.member.photos.map((p) => {
          if (p.isMain) p.isMain = false;
          if (p.id === photo.id) p.isMain = true;
          return p;
        });
        this.toastNotifications.success('Your main photo has been updated!');
      },
    });
  }

  deletePhoto(photo: Photo) {
    this.memberService.deletePhoto(photo.id).subscribe({
      next: () => {
        this.member.photos = this.member.photos.filter(
          (p) => p.id !== photo.id
        );
        this.toastNotifications.success('This photo has been deleted!');
      },
    });
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: `${this.baseUrl}/appusers/add-photo`,
      authToken: `Bearer ${this.user.token}`,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024,
    });
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const photo = JSON.parse(response);
        this.member.photos.push(photo);
        this.toastNotifications.success('New photo was added to your gallery!');
      }
    };
  }
}
