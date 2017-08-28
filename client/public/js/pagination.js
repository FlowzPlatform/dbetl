
var pageSize = 10;
var pageCount =  $(".line-content").length / pageSize;
for(var i = 0 ; i<pageCount;i++) {
    $("#pagin").append('<li><a href="#">'+(i+1)+'</a></li> ');
}
$("#pagin li").first().find("a").addClass("current")
showPage = function(page) {
    $(".line-content").hide();
    $(".line-content").each(function(n) {
        if (n >= pageSize * (page - 1) && n < pageSize * page)
        $(this).show();
    });
}
showPage(1);
$("#pagin li a").click(function() {
    $("#pagin li a").removeClass("current");
    $(this).addClass("current");
    showPage(parseInt($(this).text()))
});

