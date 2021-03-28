var request = "";


window.onload = function(){
$("#sidebar").hide();
  $('.ui.sticky')
    .sticky({
      context: '#content'
    })
  ;

  request = $.ajax({
    type: "POST",
    url: "scripts/get_stories.php",
    data: {
    },
    beforeSend: function() {

    }
  }).done(function (data) {
    //$("#sidebar").html(data);
    $("#content").html(data).hide().fadeIn();
  });

  request = $.ajax({
    type: "POST",
    url: "scripts/get_schools.php",
    data: {
    },
    beforeSend: function() {

    }
  }).done(function (data) {
    //$("#sidebar").html(data);
    //$("#sidebar").html(data).hide().fadeIn();
  });

}
//
// function loadStory(id){
//
//   request = $.ajax({
//     type: "POST",
//     url: "scripts/load_story.php?id=" + id,
//     data: {
//     },
//     beforeSend: function() {
//       $("#sidebar").hide();
//       $("#content").hide();
//     }
//   }).done(function (data) {
//     //$("#sidebar").html(data);
//     $("#main").prepend(data).hide().fadeIn();
//   });
//
//
// }
