
// Initialize Firebase
  var config = {
    apiKey: "AIzaSyCA22_-RWAMuD6vTue3XwjmBlp-0kwCniw",
    authDomain: "gatordb-62e35.firebaseapp.com",
    databaseURL: "https://gatordb-62e35.firebaseio.com",
    storageBucket: "gatordb-62e35.appspot.com",
    messagingSenderId: "866976750728"
  };
  firebase.initializeApp(config);

//Google Login- Sets up the code to allow a user to authenticate with Google on Firebase. 
var provider = new firebase.auth.GoogleAuthProvider();
console.log(provider);
function googleSignIn(){
  firebase.auth().signInWithPopup(provider).then(function(result) {
  // This gives you a Google Access Token. You can use it to access the Google API.
  var token = result.credential.accessToken;
  // The signed-in user info.
  var user = result.user;
  // ...
}).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  console.log("Error Code: "+errorCode);
  console.log("Error Message: "+errorMessage);
  // ...

});
}

//Initialize each APi with dummy data to populate the page with the latest news. 
redditInit();
nytSearch('google');
nprSearch('reddit');

//Jquery onclick event to handle the googleSignIn function. 
$(document).on('click', '#google', function(){
  googleSignIn()
  if(user){
      $('#signIn').html("<a class='waves-effect waves-light btn' id = 'signedIn>Signed In</a>");
  }
  else{
      $('#')
  }
});

//Jquery for when enter is pressed in the search field. This tricks the browser into thinking the searchbtton was clicked.
$("#search").keyup(function(event){
    if(event.keyCode == 13){
        $("#searchButton").click();
    }
  return false; 
});

//Searches each API with the searchTerm. 
$(document).on('click', '#searchButton', function(){
  var searchTerm = $('#search').val().trim();
  redditSearch(searchTerm);
  nytSearch(searchTerm);
  nprSearch(searchTerm);
})

//Reddit Functions
//Function to initialize the page with Reddit information in order to have data populate on a first log in. 
function redditInit(){
   $.getJSON(
        "https://www.reddit.com/r/news+worldnews.json?jsonp=?",
        function postUp(data)
        { console.log(data)
          $.each(
            data.data.children.slice(0, 25),
            function (i, post) {
              $("#reddit").append( "<li class = 'collection-item avatar><img src = '"+post.data.url+"' alt ='' class = 'circle><span class='title'>" + post.data.title+"</span><br><a href = '"+post.data.url+"'>View on Reddit!</a></li>");
            }
          )
        }
      );
}
//Function to allow for searching via the search bar. 
function redditSearch(searchTerm){
  $('#reddit').empty();
  var redditURL = "https://www.reddit.com/search.json?q="+searchTerm;
  $.ajax({url: redditURL, method: 'GET'}).done(function(response){
    console.log(response);
    console.log(response.data.children[0].url);
    for(var i = 0; i < 25; i++){
       $("#reddit").append( "<li class = 'collection-item avatar><img src = '"+response.data.children[i].data.url+"' alt ='' class = 'circle><span class='title'>" + response.data.children[i].data.title+"</span><br><a href = '"+response.data.children[i].data.url+"'>View on Reddit!</a></li>");
    }
  })
 }


//NYT- Grabs the JSON for the search criteria. Review this as it is not fully working just yet. 

function nytSearch(searchTerm){
  $('#nyt').empty();
  var nytApiKey = "&api-key=0a156cdac7664279a87c57512ec0bbe7";
  var q = "?q="+searchTerm;  
  var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
  var number;
  queryURL+= q; 
  //Sets the number of articles to return based on the number selected by the user.
  number = 25;
  //Completes the queryURL by adding the APIkey to the end. 
  queryURL+= nytApiKey;

  //Runs the query and appends each article to the #wellSection inside of its own well. 
    $.ajax({url: queryURL, method: 'GET'}).done(function(response) {
      console.log(response);
      for(var i = 0; i < number; i++){
        $('#nyt').append("<li class = 'collection-item avatar' id = 'article-'"+i+"><span class = 'title'>"+response.response.docs[i].headline.main+"</span><br><a href ='"+response.response.docs[i].web_url+"'>View on New York Times!</a></div>");       
      }
    });
    queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
return false; 
}

//NPR API- Grabs the JSON for the search criteria.
function nprSearch(searchTerm){
  $('#npr').empty();
  var nprAPIKey = "MDI2OTU2OTcxMDE0NzUwMjM5NjYwZDAxNQ000";
  var nprQuery = searchTerm; 
  var nprQueryUrl = "https://api.npr.org/query?requiredAssets=text,image&searchTerm="+nprQuery+"&dateType=story&output=JSON&searchType=fullContent&apiKey="+nprAPIKey;

  $.ajax({url: nprQueryUrl, method: 'GET'}).done(function(response){
    var npr = JSON.parse(response);
    console.log(npr.list);
  for(var i = 0; i < 10; i++){
     $('#npr').append("<li class = 'collection-item avatar' id = 'article-'"+i+"><span class = 'title'>"+npr.list.story[i].title.$text+"</span><p>"+npr.list.story[i].teaser.$text+"</p><a href ='"+npr.list.story[i].link.$text+"'>View on NPR!</a></div>");       
  }
  })
}
