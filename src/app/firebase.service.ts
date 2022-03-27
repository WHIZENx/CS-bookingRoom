import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import axios, { AxiosResponse } from "axios";

import * as firebase from "firebase/compat/app";

@Injectable({
  providedIn: "root"
})
export class FirebaseService {
  constructor(private firestore: AngularFirestore) {}

  checkTransaction(collection, id, dataObj) {
    var databaseRef = this.firestore.firestore.collection(collection).doc(id);

    dataObj["pin"] = 0;

    this.firestore.firestore
      .runTransaction(function (transaction) {
        return transaction.get(databaseRef).then(function (pinDoc) {
          if (!pinDoc.exists) {
            return true;
          }
          let newPinScore = pinDoc.data().pins + 1;
          transaction.update(databaseRef, { pin: newPinScore });
        });
      })
      .then(function () {
        console.log("Transaction successfully committed!");
        databaseRef.set(dataObj);
        alert("เพิ่มห้องสำเร็จ!");
      })
      .catch(function (err) {
        console.log("Transaction failed: ", err);
        alert("เพิ่มห้องไม่สำเร็จ!");
      });
  }

  checkTransactionBooking(collection, id, dataObj) {
    var databaseRef = this.firestore.firestore.collection(collection).doc(id);

    databaseRef.update({ pin: 0 });

    this.firestore.firestore
      .runTransaction(function (transaction) {
        return transaction.get(databaseRef).then(function (pinDoc) {
          if (!pinDoc.exists) {
            throw "Document does not exist!";
          }

          let newPinScore = pinDoc.data().pins + 1;
          transaction.update(databaseRef, { pin: newPinScore });
        });
      })
      .then(function () {
        console.log("Transaction successfully committed!");
        databaseRef.update({
          booking: firebase.default.firestore.FieldValue.arrayUnion(dataObj)
        });
        alert("จองห้องสำเร็จ!");
      })
      .catch(function (err) {
        console.log("Transaction failed: ", err);
        alert("จองห้องไม่สำเร็จ!");
      });
  }

  checkTransactionCancelBooking(collection, id, dataObj) {
    var databaseRef = this.firestore.firestore.collection(collection).doc(id);

    databaseRef.update({ pin: 0 });

    this.firestore.firestore
      .runTransaction(function (transaction) {
        return transaction.get(databaseRef).then(function (pinDoc) {
          if (!pinDoc.exists) {
            throw "Document does not exist!";
          }

          let newPinScore = pinDoc.data().pins + 1;
          transaction.update(databaseRef, { pin: newPinScore });
        });
      })
      .then(function () {
        console.log("Transaction successfully committed!");
        databaseRef.update({
          booking: firebase.default.firestore.FieldValue.arrayRemove(dataObj)
        });
        alert("ยกเลิกจองห้องสำเร็จ!");
      })
      .catch(function (err) {
        console.log("Transaction failed: ", err);
        alert("ยกเลิกจองห้องไม่สำเร็จ!");
      });
  }

  async getRoomAPI(collection: string, id: string) {
    const response = await axios.get(
      "https://firestore.googleapis.com/v1/projects/environmentmenager/databases/(default)/documents/" +
        collection
    );
    return response.data;
  }

  async getRoomDetailAPI(collection: string, id: string) {
    const response = await axios.get(
      "https://firestore.googleapis.com/v1/projects/environmentmenager/databases/(default)/documents/" +
        collection +
        "/" +
        id
    );
    return response.data;
  }

  addObjAPI(obj) {
    axios
      .post(
        "https://firestore.googleapis.com/v1/projects/environmentmenager/databases/(default)/documents/classroom",
        obj,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
      .then((response: AxiosResponse) => {
        alert("สำเร็จ!");
      });
  }

  updateRoomAPI(roomname, obj) {
    axios
      .patch(
        "https://firestore.googleapis.com/v1/projects/environmentmenager/databases/(default)/documents/classroom/" +
          roomname +
          "?updateMask.fieldPaths=booking",
        obj
      )
      .then((response: AxiosResponse) => {
        alert("ยกเลิกจองสำเร็จ!");
      });
  }

  getRoom(collection: string) {
    return this.firestore.collection(collection).snapshotChanges();
  }

  getRoomDetail(id: string) {
    return this.firestore
      .collection("classroom", (ref) =>
        ref.where("roomname", "==", id).limit(1)
      )
      .snapshotChanges();
  }

  updateRoom(id: string, number) {
    return this.firestore
      .collection("classroom")
      .doc(id)
      .update({ number: number });
  }

  addbookingRoom(id, book) {
    this.checkTransactionBooking("classroom", id, book);
  }

  cancelBooking(roomname, obj) {
    this.checkTransactionCancelBooking("classroom", roomname, obj);
  }

  addRoom(id, data) {
    this.checkTransaction("classroom", id, data);
  }
}
