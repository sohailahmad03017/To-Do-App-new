  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-analytics.js";
  import { getDatabase, ref, push, set, onValue } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-database.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAOuP7f3kWMagsNaPq9QBgk80-lsiVYHfc",
    authDomain: "alibaba-s-landing-page.firebaseapp.com",
    projectId: "alibaba-s-landing-page",
    storageBucket: "alibaba-s-landing-page.appspot.com",
    messagingSenderId: "723759497850",
    appId: "1:723759497850:web:52774f7d15fc716025b1c3",
    measurementId: "G-B5H671CFQK"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const db = getDatabase();

  window.add = function(){
    //getting input element to get value
    var inputVal = document.getElementById('inputVal');
    //Input validation
    if(inputVal.value != ""){
        // Create a new post reference with an auto-generated id
        const postListRef = ref(db, 'posts');
        const newPostRef = push(postListRef);
        set(newPostRef, { text: inputVal.value});
        //clearing value of input
        inputVal.value = "";

        //Rendering data
        renderData();
    }
    else{
        alert("Please, Enter text and then add.")
    }
  }

function renderData(){
    var parent = document.getElementById("parent");
    parent.innerHTML = "";

    //getting Data from firebase
    const dbRef = ref(db, 'posts/');

    onValue(dbRef, (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key;
        const childData = childSnapshot.val();
        //Rendering data
        parent.innerHTML += ` <p class="bg-light shadow border border-dark-50 my-2 py-2 px-3 d-flex justify-content-between" style="width: 96% ;">
        <span>${childData.text}</span>
        <span class="d-flex align-items-baseline" >
            <button onclick="edit('${childKey}',this)" class="btn-primary px-2 rounded">Edit</button>
            <button onclick="del('${childKey}',this)" class=" ms-2 btn-danger px-2 rounded">Delete</button>
        </span>
    </p>`
      });
    }, {
      onlyOnce: true
    });
}


window.edit = function(key,editBtn){
    // console.log(editBtn.parentNode.parentNode.firstElementChild.textContent);
    var val = prompt("Please, Enter new note", editBtn.parentNode.parentNode.firstElementChild.textContent);
    editBtn.parentNode.parentNode.firstElementChild.textContent = val;
    set(ref(db, 'posts/' + key), {text: val});
}

window.del = function(key,delBtn){
    //Deleting from database
    set(ref(db, 'posts/' + key), { value : null});
    //Deleting from parent
    delBtn.parentNode.parentNode.remove();

}

window.delAll = function(){
    //Deleting from database
    set(ref(db, 'posts'), {value: null});
    //Deleting from parent
    document.getElementById("parent").innerHTML = "";
}


renderData();