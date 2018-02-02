// on page load
$(function () {
  $('#update').on('click', function(){
    console.log('update');
    $.ajax({
      method: "GET",
      url: "/scrape"
    }).then(function(data){
      console.log(data);
      setTimeout(function(){
        location.reload();
      },8000)
    })
  })
});