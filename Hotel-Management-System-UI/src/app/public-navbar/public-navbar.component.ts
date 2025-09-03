import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-public-navbar",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./public-navbar.component.html",
  styleUrls: ["./public-navbar.component.css"],
})
export class PublicNavbarComponent implements OnInit {
  @Output() loginClicked = new EventEmitter<void>();
  @Output() registerClicked = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}
}
