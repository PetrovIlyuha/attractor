import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastrModule } from 'ngx-toastr';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { FileUploadModule } from 'ng2-file-upload';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    FontAwesomeModule,
    NgxGalleryModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
    }),

    FileUploadModule,
  ],
  exports: [
    BsDropdownModule,
    TabsModule,
    NgxGalleryModule,
    FontAwesomeModule,
    ToastrModule,
    FileUploadModule,
  ],
})
export class SharedModule {}
