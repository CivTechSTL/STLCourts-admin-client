import { TestBed, getTestBed } from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

import { CourtsService } from './courts.service';
import { environment} from '../../environments/environment';
import {Court} from '../models/court';

describe('CourtsService', () => {
  let injector;
  let service: CourtsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CourtsService]
    });

    injector = getTestBed();
    service = injector.get(CourtsService);
    httpMock = injector.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should get all', () => {
    const dummyCourtData = [
      { id: 1, name: 'One Court'},
      { id: 2, name: 'Two Court'}
    ];

    service.getAll().subscribe(courts => {
      expect(courts.length).toBe(2);
      expect(courts[0].name).toEqual('One Court');
    });

    const req = httpMock.expectOne(environment.readBaseUrl + '/courts');
    expect(req.request.method).toBe('GET');
    req.flush(dummyCourtData);
  });

  it('should save', () => {
    const dummyCourtData = new Court();
    dummyCourtData.id = 1;
    dummyCourtData.name = 'One Court';

    service.save(dummyCourtData).subscribe(court => {
      expect(court.name).toEqual('One Court');
    });

    const req = httpMock.expectOne(environment.readBaseUrl + '/courts');
    expect(req.request.method).toBe('POST');
    req.flush(dummyCourtData);
  });

  afterEach(() => {
    httpMock.verify();
  });

});
