import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FirebaseService } from "../firebase.service";
import { UserService } from "../user.service";
import * as firebase from "firebase/app";

declare var $: any;

@Component({
  selector: "app-booking-room",
  templateUrl: "./booking-room.component.html",
  styleUrls: ["./booking-room.component.css"]
})
export class BookingRoomComponent implements OnInit {
  constructor(
    private router: Router,
    private udServ: UserService,
    private fServ: FirebaseService
  ) {}

  room;
  user_permission;
  isStaff;

  todate = new Date();

  showTable() {
    if ($("#datepick").val() !== "") {
      this.map_room = {};
      this.table = true;
      var time = $("#datepick").val().split("-");
      var day = time[2];
      var month = time[1];
      var year = time[0];
      this.date_show = day + "/" + month + "/" + year;
      this.fServ.getRoom("classroom").subscribe((val) => {
        this.room_table = val.map((e) => {
          for (let i = 0; i < e.payload.doc.data()["booking"].length; i++) {
            var date_db = new Date(
              e.payload.doc.data()["booking"][i]["startDate"].seconds * 1000
            );
            if (new Date($("#datepick").val()).getDay() === date_db.getDay()) {
              if (this.map_table[$("#datepick").val()] === undefined)
                this.map_table[$("#datepick").val()] = 1;
              else this.map_table[$("#datepick").val()] += 1;
            }
          }
          this.map_room[e.payload.doc.data()["roomname"]] = this.map_table;
          this.map_table = {};
          if (
            this.map_room[e.payload.doc.data()["roomname"]][
              $("#datepick").val()
            ] === 3
          ) {
            $("#" + e.payload.doc.data()["roomname"]).css({
              background: "#ff7675"
            });
            $("#" + e.payload.doc.data()["roomname"]).attr("data-target", "");
            $("#" + e.payload.doc.data()["roomname"]).css("cursor", "default");
          } else {
            $("#" + e.payload.doc.data()["roomname"]).css({
              background: "#78e08f"
            });
            $("#" + e.payload.doc.data()["roomname"]).attr(
              "data-target",
              "#editDateModal"
            );
            $("#" + e.payload.doc.data()["roomname"]).css("cursor", "pointer");
          }
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {})
          };
        });
      });
    }
  }

  ngOnInit() {
    if (localStorage.getItem("username") === "null") {
      this.router.navigate(["/"]);
    }
    this.fServ.getRoom("classroom").subscribe((val) => {
      this.room = val.map((e) => {
        return {
          id: e.payload.doc.id,
          ...(e.payload.doc.data() as {})
        };
      });
    });
    this.udServ.refreshLang();
    this.user_permission = localStorage.getItem("permission");
    if (this.user_permission === "staff") {
      this.isStaff = true;
    } else {
      this.isStaff = false;
    }
    setTimeout(() => {
      this.showTable();
    }, 1000);
  }

  table = false;
  date_show;

  room_table;
  map_table = {};
  map_room = {};
  str_date = "";

  room_name;
  detail;
  booking_time;

  room_today = [];

  start_date_book = [];
  end_date_book = [];
  room_capacity;

  detail_room;

  selectRoom(room_name) {
    this.subject = "";
    this.Examiner1 = "";
    this.Examiner2 = "";
    this.capacity = "";
    this.start_date_book = [];
    this.end_date_book = [];
    for (let i = 0; i < 3; i++) {
      $("#" + i).css({ background: "#78e08f" });
      if (this.isStaff) $("#" + i).css({ cursor: "pointer" });
    }
    this.room_name = room_name;
    this.fServ.getRoomDetail(room_name).subscribe((val) => {
      this.detail = val.map((e) => {
        this.room_capacity = e.payload.doc.data()["number"];
        this.booking_time = e.payload.doc.data()["booking"];
        for (let i = 0; i < this.booking_time.length; i++) {
          var date_db_start = new Date(
            e.payload.doc.data()["booking"][i]["startDate"].seconds * 1000
          );
          var date_db_end = new Date(
            e.payload.doc.data()["booking"][i]["endDate"].seconds * 1000
          );
          var start_date = date_db_start.getHours();
          var end_date = date_db_end.getHours();
          var index_time;

          if (start_date === 8 && end_date === 11) {
            index_time = 0;
          } else if (start_date === 12 && end_date === 15) {
            index_time = 1;
          } else if (start_date === 15 && end_date === 18) {
            index_time = 2;
          }
          if (
            new Date($("#datepick").val()).getDay() ===
              date_db_start.getDay() &&
            new Date($("#datepick").val()).getDay() === date_db_end.getDay()
          ) {
            $("#" + index_time).css({ background: "#ff7675" });
            $("#" + index_time).css({ cursor: "default" });
          }
        }
        return {
          id: e.payload.doc.id,
          ...(e.payload.doc.data() as {})
        };
      });
    });
  }

  addbooktime(id) {
    if (!this.isStaff) return false;
    var time = this.date_show.split("/");
    var start_date;
    var end_date;
    if (id === 0) {
      start_date = new Date(time[2], time[1], time[0], 8 + 7);
      end_date = new Date(time[2], time[1], time[0], 11 + 7);
    } else if (id === 1) {
      start_date = new Date(time[2], time[1], time[0], 12 + 7);
      end_date = new Date(time[2], time[1], time[0], 15 + 7);
    } else if (id === 2) {
      start_date = new Date(time[2], time[1], time[0], 15 + 7, 30);
      end_date = new Date(time[2], time[1], time[0], 18 + 7, 30);
    }

    if (
      this.hexc($("#" + id).css("background-color")) !== "#ff7675" &&
      this.hexc($("#" + id).css("background-color")) !== "#ffeeba"
    ) {
      $("#" + id).css({ background: "#ffeeba" });
      this.start_date_book.push(start_date);
      this.end_date_book.push(end_date);
    } else if (this.hexc($("#" + id).css("background-color")) === "#ffeeba") {
      $("#" + id).css({ background: "#78e08f" });
      this.start_date_book.splice(this.start_date_book.indexOf(start_date), 1);
      this.end_date_book.splice(this.end_date_book.indexOf(end_date), 1);
    }
  }

  subject;
  Examiner1;
  Examiner2;
  capacity;

  booking_db(id) {
    if (
      this.subject === "" ||
      this.Examiner1 === "" ||
      this.Examiner2 === "" ||
      this.capacity === 0 ||
      this.capacity === undefined ||
      this.capacity === "" ||
      this.room_capacity < this.capacity
    ) {
      alert("จองไม่สำเร็จ!");
      return false;
    }
    for (let i = 0; i < this.start_date_book.length; i++) {
      var temp_start = new Date(this.start_date_book[i]);
      var temp_end = new Date(this.end_date_book[i]);
      this.fServ.addbookingRoom(id, {
        username: localStorage.getItem("username"),
        startDate: new Date(temp_start.setHours(temp_start.getHours() - 7)),
        endDate: new Date(temp_end.setHours(temp_end.getHours() - 7)),
        subject: this.subject,
        Examiner1: this.Examiner1,
        Examiner2: this.Examiner2,
        Capacity: this.capacity
      });
    }
  }

  hexc(colorval) {
    var parts = colorval.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    delete parts[0];
    for (var i = 1; i <= 3; ++i) {
      parts[i] = parseInt(parts[i], 10).toString(16);
      if (parts[i].length === 1) parts[i] = "0" + parts[i];
    }
    return "#" + parts.join("");
  }
}
