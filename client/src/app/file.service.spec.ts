import { TestBed, inject } from '@angular/core/testing';

import { FileService } from './file.service';

describe('FileService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FileService]
    });
  });

  it('Deve ser criado o FileService', inject([FileService], (service: FileService) => {
    expect(service).toBeTruthy();
  }));
});
