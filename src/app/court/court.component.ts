import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import {MatAutocompleteSelectedEvent} from '@angular/material';
import _ from 'lodash';
import {Court} from '../models/court';
import { CourtsService } from '../services/courts.service';
import {JudgeComponent} from '../judge/judge.component';
import {Judge} from '../models/judge';

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
  courtCtrl: FormControl = new FormControl();
  filteredCourts: Observable<any[]>;
  court: Court;
  courts: Court[];
  judges: Judge[];

  addCourt() {
    this.showCourtForm = true;
    this.showCourtSelector = false;
  }

  editCourt() {
    this.showCourtForm = false;
    this.showCourtSelector = true;
  }

  deleteCourt() {
    this.showCourtForm = false;
    this.showCourtSelector = true;
  }

  saveForm() {
    if (this.citationDoesNotExpire === true) {
      this.court.citationExpiresAfterDays = -1;
    }else{
      this.court.citationExpiresAfterDays = this.daysUntilCitationExpires;
    }
    this.courtService.save(this.court).subscribe((court) => {
      const currentCourtIndex = this.courts.indexOf(this.court);
      this.courts[currentCourtIndex] = court[0];
    });
  }

  private assignCourts(): void {
    this.courtService.getAll().subscribe(
      (courts) => {
        this.courts = courts;
      }
    );
  }

  onCourtSelected(event: MatAutocompleteSelectedEvent) {
    this.court = _.find(this.courts, {'name': event.option.value});
    this.citationDoesNotExpire = (this.court.citationExpiresAfterDays === -1);
    if (!this.citationDoesNotExpire) {
     this.daysUntilCitationExpires = this.court.citationExpiresAfterDays;
    }else {
      this.daysUntilCitationExpires = null;
    }

    this.showCourtForm = true;
    this.showCourtSelector = false;
  }

  constructor(private courtService: CourtsService) {
    this.assignCourts();
    this.filteredCourts = this.courtCtrl.valueChanges
      .startWith(null)
      .map(court => court ? this.filterCourts(court) : this.courts.slice());

  }

  filterCourts(name: string) {
    return this.courts.filter(court =>
      court.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  ngOnInit() {
    this.showCourtForm = false;
    this.showCourtSelector = false;
    this.court = new Court();
  }
}
