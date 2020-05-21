import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

export default (
  _context: any,
  inject: (arg0: string, arg1: firebase.app.App) => void
) => {
  let fireApp: firebase.app.App;
  if (!firebase.apps.length) {
    // 先ほどコンソールでコピーしたコードのfirebaseConfigの中身を貼り付け
    fireApp = firebase.initializeApp({
      apiKey: "AIzaSyA74g6vB2J0LGxg_zc2jQ77T71qLTt0rU8",
      authDomain: "qa-sample-b339f.firebaseapp.com",
      databaseURL: "https://qa-sample-b339f.firebaseio.com",
      projectId: "qa-sample-b339f",
      storageBucket: "qa-sample-b339f.appspot.com",
      messagingSenderId: "106355549263",
      appId: "1:106355549263:web:e8b15a52c6f23e9ba6f63a"
    });
  } else {
    fireApp = firebase.app();
  }
  inject("fireApp", fireApp);
};
