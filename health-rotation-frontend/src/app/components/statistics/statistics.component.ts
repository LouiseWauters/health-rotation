import { Component, OnInit } from '@angular/core';
import {FoodService} from "../../services/food.service";

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  statistics: { date: Date, count: number }[] | undefined = undefined;
  calendarDays: { label: string | number, isHeader: boolean, content?: string | number, isToday: boolean }[] = [];
  currentMonth: number = new Date().getMonth();
  currentYear: number = new Date().getFullYear();
  headerText: string = new Date().toLocaleString('default', {month: 'long', year: 'numeric'});


  constructor(
    private foodService: FoodService
  ) { }

  ngOnInit(): void {
    this.getStatistics();
  }

  getStatistics() {
    this.foodService.getStatistics().subscribe(statistics => {
      this.statistics = statistics.map(obj => ({date: new Date(obj.date), count: obj.count}));
      this.generateCalendar(this.currentYear, this.currentMonth);
    });
  }

  generateCalendar(year: number, month: number) {
    this.calendarDays = [];
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    // Add headers
    for (const day of daysOfWeek) {
      this.calendarDays.push({label: day, isHeader: true, isToday: false});
    }

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Add blank days until the first day of the current month
    for (let i = 1; i < firstDay; i++) {
      this.calendarDays.push({label: '', isHeader: false, isToday: false});
    }

    // Add days of the current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const content = this.findStatisticsByDate(date)?.count;
      this.calendarDays.push({label: i, isHeader: false, content: content === undefined ? '?' : content, isToday: this.compareDates(date, new Date())});
    }

    // Optionally fill the last row to keep the grid layout consistent
    const totalDays = (firstDay - 1) % 7 + daysInMonth;
    const remainingDays = 7 - (totalDays % 7);
    if (remainingDays < 7) {
      for (let i = 0; i < remainingDays; i++) {
        this.calendarDays.push({label: '', isHeader: false, isToday: false});
      }
    }
  }

  compareDates(d1: Date, d2: Date) {
    d1.setHours(0,0,0,0);
    d2.setHours(0,0,0,0);
    return d1.getTime() === d2.getTime();
  }

  findStatisticsByDate(date: Date) {
    return this.statistics?.find(stat => this.compareDates(stat.date, date));
  }

  nextMonth() {
    if (this.currentMonth < 11) {
      this.currentMonth++;
    } else {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.setHeaderText();
    this.generateCalendar(this.currentYear, this.currentMonth);
  }

  previousMonth() {
    if (this.currentMonth > 0) {
      this.currentMonth--;
    } else {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.setHeaderText();
    this.generateCalendar(this.currentYear, this.currentMonth);
    // TODO: get new statistics that are older if necessary
  }

  setHeaderText() {
    this.headerText = new Date(this.currentYear, this.currentMonth).toLocaleString('default', {month: 'long', year: 'numeric'});
  }

}
