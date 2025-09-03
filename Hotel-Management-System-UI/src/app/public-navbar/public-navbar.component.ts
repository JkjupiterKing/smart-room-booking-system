import { Component, EventEmitter, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-public-navbar",
  templateUrl: "./public-navbar.component.html",
  styleUrls: ["./public-navbar.component.css"],
})
export class PublicNavbarComponent implements OnInit {
  @Output() loginClicked = new EventEmitter<void>();
  @Output() registerClicked = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}
}
