import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FirebaseService } from "../firebase.service";
import { UserService } from "../user.service";
import * as firebase from "firebase/app";

declare var $: any;

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  constructor(
    private router: Router,
    private udServ: UserService,
    private fServ: FirebaseService
  ) {}

  room;
  user_permission;
  isStaff;

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
  }

  number = 0;
  roomname = "";
  typeroom = "";

  addRoom() {
    // if (this.number === 0 || this.roomname === "" || this.typeroom === "") {
    //   return false;
    // }
    let data = {
      booking: [],
      number: this.number,
      roomname: this.roomname,
      typeroom: this.typeroom
    };
    this.fServ.addRoom(this.roomname, data);
  }

  room_name;
  room_number;
  room_number_2;

  typeroom_2;

  edit_room = false;

  editroom() {
    this.edit_room = true;
  }

  seeroom(roomname) {
    this.edit_room = false;
    this.room_name = roomname;
    this.fServ.getRoomDetail(roomname).subscribe((val) => {
      val.map((e) => {
        this.room_number = e.payload.doc.data()["number"];
        this.room_number_2 = e.payload.doc.data()["number"];
        this.typeroom = e.payload.doc.data()["typeroom"];
        this.typeroom_2 = e.payload.doc.data()["typeroom"];
      });
    });
  }

  edit_suc() {
    this.fServ.updateRoom(this.room_name, this.room_number_2);
    alert("แก้ไขห้องสำเร็จ!");
  }
}
