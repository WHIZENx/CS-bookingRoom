import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { DatePipe } from "@angular/common";
import { FirebaseService } from "../firebase.service";
import { UserService } from "../user.service";
import * as firebase from "firebase/app";

declare var $: any;

@Component({
  selector: "app-user-booking",
  templateUrl: "./user-booking.component.html",
  styleUrls: ["./user-booking.component.css"]
})
export class UserBookingComponent implements OnInit {
  constructor(
    private router: Router,
    private datepipe: DatePipe,
    private udServ: UserService,
    private fServ: FirebaseService
  ) {}

  dtOptions: DataTables.Settings = {};

  isShow = false;
  room;
  map_room = {};

  username;

  ngOnInit() {
    if (localStorage.getItem("username") === "null") {
      this.router.navigate(["/"]);
    }
    this.username = localStorage.getItem("username");
    this.fServ.getRoom("classroom").subscribe((data) => {
      this.room = [];
      data.map((item) => {
        item.payload.doc.data()["booking"].forEach((e) => {
          if (this.username === e.username) {
            let date_start = this.datepipe.transform(
              new Date(e.startDate.seconds * 1000),
              "dd/MM/yyyy HH:mm"
            );
            let date_end = this.datepipe.transform(
              new Date(e.endDate.seconds * 1000),
              "HH:mm"
            );
            let i = {
              roomname: item.payload.doc.data()["roomname"],
              subject: e.subject,
              rangetime: date_start + " - " + date_end,
              Examiner1: e.Examiner1,
              Examiner2: e.Examiner2,
              obj: e
            };
            this.room.push(i);
          }
        });
      });
      //Datatable settings and showing
      this.dtOptions = {
        pagingType: "full_numbers",
        pageLength: 5,
        lengthMenu: [5, 10, 25],
        processing: true,
        columnDefs: [{ targets: 5, searchable: false, orderable: false }]
      };
      this.isShow = true;
    });
  }
  couse_list;
  subject;

  room_name;
  date_time;
  item_obj;

  get_detail(roomname, item) {
    this.item_obj = item.obj;
    this.room_name = roomname;
    this.date_time = item.rangetime;
  }

  cancel() {
    this.fServ.cancelBooking(this.room_name, this.item_obj);
  }
}
