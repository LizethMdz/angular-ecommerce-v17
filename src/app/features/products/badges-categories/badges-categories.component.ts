import { Component, OnInit, input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-badges-categories',
  templateUrl: './badges-categories.component.html',
  standalone : true
})
export class BadgesCategoriesComponent implements OnInit {

  nameCategory = input<string>("");

  @Output() selectCategory = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  getCategoryProducts() {
    this.selectCategory.emit(this.nameCategory());
  }

}
