import { Injectable, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs/Observable';
import {UserRole} from '../models/userRole';

@Injectable()
export class ApiPrivilegesService implements OnInit {

  private userPrivilege: UserRole;

  constructor(private http: HttpClient) { }

  public getUserPrivilege(): Observable<UserRole> {
    const self = this;
    if (this.userPrivilege == null) {
      return this.http
        .get(environment.baseUrl + '/privileges')
        .map(response => {
          self.userPrivilege = <UserRole>response;
          return self.userPrivilege;
        });
    } else {
      return Observable.create(function(observer) {
        observer.next(self.userPrivilege);
      });
    }
  }

  public clearUserPrivilege() {
    this.userPrivilege = null;
  }

  ngOnInit() {
    this.userPrivilege = null;
  }

}
