import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import {MatAutocompleteSelectedEvent, MatDialog, MatRadioChange} from '@angular/material';

import {find} from 'lodash';
import {Court} from '../models/court';
import { CourtsService } from '../services/courts.service';
import {JudgeComponent} from '../judge/judge.component';
import {Judge} from '../models/judge';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';

enum PageAction {
  NONE,
  ADD,
  EDIT,
  DELETE
}

@Component({
  selector: 'app-court',
  templateUrl: './court.component.html',
  styleUrls: ['./court.component.css'],
  providers: [JudgeComponent]
})

export class CourtComponent implements OnInit {
  citationDoesNotExpire: boolean;
  daysUntilCitationExpires: number;
  showCourtForm: boolean;
  showCourtSelector: boolean;
  showPageMessage: boolean;
  courtCtrl: FormControl = new FormControl();
  filteredCourts: Observable<any[]>;
  court: Court;
  courts: Court[];
  judges: Judge[];
  pageMessage: String = '';
  currentAction: PageAction = PageAction.NONE;
  courtSelectorPlaceholder: String = '';

  constructor(public dialog: MatDialog, private courtService: CourtsService) {
    this.assignCourts();
    this.assignFilterCourts();
  }

  addCourt() {
    this.court = new Court();
    this.court.citationExpiresAfterDays = -1;
    this.citationDoesNotExpire = true;
    this.currentAction = PageAction.ADD;
    this.showPageMessage = false;
    this.showCourtForm = true;
    this.showCourtSelector = false;
  }

  editCourt() {
    this.currentAction = PageAction.EDIT;
    this.assignFilterCourts();
    this.courtSelectorPlaceholder = 'Select court to be edited';
    this.showPageMessage = false;
    this.showCourtForm = false;
    this.showCourtSelector = true;
    this.courtCtrl.setValue('');
  }

  deleteCourt() {
    this.currentAction = PageAction.DELETE;
    this.assignFilterCourts();
    this.courtSelectorPlaceholder = 'Select court to be deleted';
    this.showPageMessage = false;
    this.showCourtForm = false;
    this.showCourtSelector = true;
    this.courtCtrl.setValue('');
  }

  saveForm() {
    if (this.citationDoesNotExpire === true) {
      this.court.citationExpiresAfterDays = -1;
    }else {
      this.court.citationExpiresAfterDays = this.daysUntilCitationExpires;
    }
    this.courtService.save(this.court).subscribe((court) => {
      this.pageMessage = court.name + ' saved';
      this.showPageMessage = true;
      this.showCourtForm = false;
      this.showCourtSelector = false;
      this.currentAction = PageAction.NONE;

      if (this.court.id == null) {
        this.courts.push(court);
      }
    });
  }

  formatPhoneNumber() {
    // formats a 10 digit phone number to use just '.' as the separation character
    if (this.court.phone !== '') {
      this.court.phone = this.court.phone.replace(/[- .()]/g, '');
      this.court.phone = this.court.phone.slice(0, 6) + '.' + this.court.phone.slice(6);
      this.court.phone = this.court.phone.slice(0, 3) + '.' + this.court.phone.slice(3);
    }
  }

  private assignCourts(): void {
    this.courtService.getAll().subscribe(
      (courts) => {
        this.courts = courts;
      }
    );
  }

  onCourtSelected(event: MatAutocompleteSelectedEvent) {
    this.court = find(this.courts, {'name': event.option.value});

    switch ( this.currentAction ) {
      case PageAction.DELETE:
        const index = this.courts.indexOf(this.court);
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          width: '250px',
          data: {message: 'Remove \'' + this.court.name + '\'? This will remove the court from the database permanently.' }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.courtService.delete(this.court.id);
            this.removeCourtFromArray(index);
            this.resetPageView();
            this.pageMessage = this.court.name + ' was removed';
            this.showPageMessage = true;
          }
        });
        break;
      case PageAction.EDIT:
        this.citationDoesNotExpire = (this.court.citationExpiresAfterDays === -1);
        if (!this.citationDoesNotExpire) {
          this.daysUntilCitationExpires = this.court.citationExpiresAfterDays;
        }else {
          this.daysUntilCitationExpires = null;
        }

        this.resetPageView();
        this.showCourtForm = true;
        break;
    }
  }

  onExpiresChange(event: MatRadioChange) {
    if (event.value) {
      this.daysUntilCitationExpires = null;
    }
  }

  assignFilterCourts() {
    this.filteredCourts = this.courtCtrl.valueChanges
      .startWith(null)
      .map(court => court ? this.filterCourts(court) : this.courts.slice());
  }

  filterCourts(name: string) {
    return this.courts.filter(court =>
      court.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  private removeCourtFromArray(index: number): void {
    if (index >= 0) {
      this.courts.splice(index, 1);
    }
  }

  private resetPageView(): void {
    this.currentAction = PageAction.NONE;
    this.showPageMessage = false;
    this.showCourtForm = false;
    this.showCourtSelector = false;
  }

  ngOnInit() {
    this.resetPageView();
    this.court = new Court();
  }
}
