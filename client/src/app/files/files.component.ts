import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';

import { File } from '../file';
import { FileService } from '../file.service';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit {
  public uploader:FileUploader = new FileUploader({url:'http://localhost:3000/api/files/upload'});

    files: File[];

    constructor(private fileService: FileService) { }

    ngOnInit() {
      this.getFiles();
    }

    // Listar os arquivos
    getFiles(): void {
      this.fileService.getFiles()
          .subscribe(files => this.files = files);
    }

    // Inserir os arquivos
    add( originalname:string ): void {
      originalname = originalname.trim();
      if (!originalname) { return; }
      this.fileService.addFile({ originalname } as File)
        .subscribe(file => {
          this.files.push(file);
        });
    }

    //Deletar arquivos
    delete(file: File): void {
      this.files = this.files.filter(h => h !== file);
      this.fileService.deleteFile(file).subscribe();
    }

}
