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
  $("img").tooltip({"animation": true, "placement": "right", "trigger": "hover"});


/ * d3 shit to make the fucking pies */
var radius = 75,
	width = 300,
	height = 175,
	green = "#6CBF91",
	gray = "#888",
	blue = "#268bd2",
	duration = 700,
	arc = d3.svg.arc()
		.innerRadius(radius * .8)
		.outerRadius(radius);

var svg = d3.selectAll("svg")
	.attr("width", width)
	.attr("height", height);
	
svg.each(function() {
	var data = parseInt($(this).attr("data")),
		total = parseInt($(this).attr("total"));
	pie(this, data / total);
});

setting();

function pie(s, data) {
	var pi = 1.5 * Math.PI,
		startAngle = -.75 * Math.PI,
		endAngle = .75 * Math.PI,
		path1 = {},
		path2 = {};

	var g = d3.select(s).select("g")
		.attr("transform", "translate(" + width / 2 + ", " + height / 2 + ")");
	
	g.selectAll("path").remove();
	
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
}

function setting() {
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
		.text("rsvp")
		.on("click", RSVP);

	d3.selectAll("text.going")
		.attr("x", 0)
		.attr("y", 60)
		.attr("width", 150)
		.attr("height", 20)
		.attr("text-anchor", "middle")
		.attr("fill", blue)
		.text("going!")
		.on("click", cancel);
}

/* ajax requests*/

function RSVP() {
	
	d3.select(this).classed("going", true)
		.classed("rsvp", false);

	var id = $(this).parents(".date").attr("id"),
		svg = $(this).parents("svg");
	$.ajax({
	    url: "/rsvp",
	    type: "POST",
	    dataType: "json",
 	    data: {objectData: {"id": id}},
	    success: function(data) {
				var total = data.total,
					totalattending = parseInt($(svg).attr("data")) + 1;
				d3.selectAll("svg").each(function() {
					var totalattending = parseInt($(this).attr("data"));
					$(this).attr("total");
					pie(this, totalattending / total);
				});
				pie(svg[0], totalattending / total);
				$(svg).attr("data", totalattending);
				$(svg).attr("total", total);
				
				setting();
					
				if (data.gender == "female") {
					var img = $("<img></img>").attr("src", "images/girl.png")
						.attr("id", data.name)
						.attr("data-original-title", data.name);
					$(svg).siblings(".females").append(img);
				} else {
					var img = $("<img></img>").attr("src", "images/boy.png")
						.attr("id", data.name)
						.attr("data-original-title", data.name);
					$(svg).siblings(".males").append(img);
				}
	   },
  });
}

function cancel() {
	d3.select(this).classed("rsvp", true)
		.classed("going", false);
		
	var id = $(this).parents(".date").attr("id"),
		svg = $(this).parents("svg");
	$.ajax({
	    url: "/cancel",
	    type: "POST",
	    dataType: "json",
 	    data: {objectData: {"id": id}},
	    success: function(data) {
				var total = data.total,
					totalattending = parseInt($(svg).attr("data")) - 1;
				d3.selectAll("svg").each(function() {
					var totalattending = parseInt($(this).attr("data"));
					$(this).attr("total");
					pie(this, totalattending / total);
				});
				pie(svg[0], totalattending / total);
				$(svg).attr("data", totalattending);
				$(svg).attr("total", total);

				setting();
				
				if (data.gender == "female") {
					$(svg).siblings(".females").find("img:last-child").remove();
				} else {
					$(svg).siblings(".males").find("img:last-child").remove();
				}
	   },
  });
}



/* for upvoting */
$(".icon-arrow-up").click(function(e) {
	var parent = $(e.target).parents(".gift"),
		id = parent.attr("id");
	$.ajax({
	    url: "/upvote",
	    type: "POST",
	    dataType: "json",
 	    data: {objectData: {"id": id}},
	    success: function(data) {
				parent.find(".upvotes")
					.text(data.data + " upvotes");
				parent.attr("data", data.data);
				d3.selectAll(".gift").each(function() {
					var upvote = parseInt($(this).attr("data"));
					d3.select(this).data([upvote]);
				});
				d3.selectAll(".gift").sort(function(a, b) {
					if (a > b) {
						return -1; 
					} else {
						return 1;
					}
				});
	   }
	  });
});
