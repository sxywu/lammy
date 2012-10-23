  $("#navi").click(function(e) {
		var y = e.pageY,
			top;
		$(".section").each(function(i, section) {
			var sectionY = $(section).offset().top;
			if (sectionY > y) {
				top = sectionY;
				return false;
			}
		});
    $('html, body').stop().animate({
      scrollTop: top - 50
    }, 1000);

    e.preventDefault();
  });
  $("i.icon-arrow-up").tooltip({"animation": true, "placement": "bottom", "title": "click to<br> upvote", "trigger": "hover"});

/ * d3 shit to make the fucking pies */
var radius = 75,
	width = 300,
	height = 175,
	green = "#6CBF91",
	gray = "#888",
	blue = "#268bd2",
	arc = d3.svg.arc()
		.innerRadius(radius * .8)
		.outerRadius(radius);

var svg = d3.selectAll("svg")
	.attr("width", width)
	.attr("height", height);

svg.each(function() {
	var data = parseInt($(this).attr("data")),
		pi = 1.5 * Math.PI,
		startAngle = -.75 * Math.PI,
		endAngle = .75 * Math.PI,
		path1 = {},
		path2 = {};
	
	var g = d3.select(this).select("g")
		.attr("transform", "translate(" + width / 2 + ", " + height / 2 + ")");

	path1.data = path1.value = data;
	path1.startAngle = startAngle;
	path1.endAngle = startAngle + data * pi;
	g.append("path")
		.attr("class", "attending")
		.data([path1]).attr("fill", green)
			.attr("stroke", gray);
		
	path2.data = path2.value = 1 - data;
	path2.startAngle = startAngle + data * pi;
	path2.endAngle = endAngle;
	g.append("path")
		.attr("class", "flaking")
		.data([path2]).attr("fill", "white")
			.attr("stroke", gray);
});

d3.selectAll("path")
	.attr("d", arc);
	
d3.selectAll("text.date")
	.attr("x", 0)
	.attr("y", 0)
	.attr("width", 150)
	.attr("height", 40)
	.attr("text-anchor", "middle")
	.attr("fill", green);
	
d3.selectAll("text.time")
	.attr("x", 0)
	.attr("y", 20)
	.attr("width", 150)
	.attr("height", 20)
	.attr("text-anchor", "middle")
	.attr("fill", gray);
	
d3.selectAll("text.rsvp")
	.attr("x", 0)
	.attr("y", 60)
	.attr("width", 150)
	.attr("height", 20)
	.attr("text-anchor", "middle")
	.attr("fill", blue)
	.text("RSVP")
	.on("click", RSVP);
	
function RSVP() {
	console.log(this);
	d3.select(this).text("yay!");
}


/* ajax requests*/
$(".icon-arrow-up").click(function(e) {
	var parent = $(e.target).parents(".gift"),
		id = parent.attr("id");
	console.log(id);
	$.ajax({
	    url: "/upvote",
	    type: "POST",
	    dataType: "json",
 	    data: {objectData: {"id": id}},
	    // contentType: "application/json",
	    // 	    cache: false,
	    // 	    timeout: 5000,
	    complete: function() {
	      console.log('process complete');
	    },

	    success: function(data) {
	      console.log(data);
	      console.log('process sucess');
				parent.find(".upvotes")
					.text(data.data + " upvotes");
	   },

	    error: function() {
	      console.log('process error');
	    },
	  });
});
