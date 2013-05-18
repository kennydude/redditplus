// Reddit+
function inject_script(script){
    // in future, this part could be moved out if you wanted it on FireFox etc.
    chrome.runtime.sendMessage({ "script" : script });
}

// Domain specific handlers
var handlers = {
	"imgur.com" : function(link){
		if(link.indexOf("imgur.com/a/") != -1 || link.indexOf("imgur.com/gallery") != -1){
			var id = "re" + link.substring( link.lastIndexOf("/") + 1 );
			$.get(link, function(response){
				$("#" + id).html("");
				var x = 0, img = "";
				while( (x = response.indexOf('<a class="zoom"', x)) != -1 ){
					var y = response.indexOf('http://i.imgur.com', x);
					var src = response.substring( y, response.indexOf('"', y) );

					console.log(id);
					img = make_image_expando( src );
					img.appendTo( $("#" + id) );


					x += '<a class="zoom"'.length;
				}
			});
			return $("<div>").attr("id", id ).html("...");
		} else{
			link = link.replace("imgur.com", "i.imgur.com");
			link = link + ".jpg";
			return make_image_expando(link);
		}
	},
	"qkme.me" : function(link){
		link = link.replace("qkme.me", "i.qkme.me");
		link = link + ".jpg";
		return make_image_expando(link);
	},
	"play.google.com" : function(link){
		var ap = getQueryVariable(link, "id");
		var content = '<div class="pb-app-box" data-theme="light" data-lang="en"><a href="http://playboard.me/app/'+ap+'">App</a></div>';
		inject_script("http://playboard.me/widgets/pb-app-box/1/pb_load_app_box.js");
		return $("<div>").html(content);
	},
    "vimeo.com" : function(link){
        var videoid = link.substring( link.lastIndexOf("/") + 1 );
        return $("<iframe>").attr({
            "src" : "http://player.vimeo.com/video/" + videoid,
            "frameborder" : "0",
            "webkitAllowFullScreen" : "true",
            "mozalllowfullscreen" : "true",
            "allowfullscreen" : "true",
        }).css({
            "width" : "100%",
            "max-width" : "600px",
            "height" : "300px"
        });
    }
};
var domains = Object.keys(handlers);
var image_extensions = [ ".png", ".jpg", ".gif" ];

function make_image_expando(src){
	var img = $("<img>").attr("src", src).attr("href", src).addClass("redditplus-image");
	img.magnificPopup({type:'image'});
	return img;
}

function getQueryVariable(href, variable) {
    var query = href.substring( href.indexOf("?") + 1 );
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    console.log('Query variable %s not found', variable);
}

function expando_click(f, cls, ex){
	if(cls == undefined){
		cls = ".entry";
	} if( ex == undefined) {
		ex = "";
	}
	return function(){
		if($(this).html() == "r+"){
			var entry = $(this).closest( cls );
			console.log(entry);

			var exp = f(this);
			exp.addClass("redditplus-expando");
			if(ex != ""){
				exp.addClass(ex);
			}
			exp.appendTo( entry );
			$(this).html("r-");

			var ddx = $("<div>").addClass("redditplus-expando redditplus-backup").html("back up").appendTo(entry).click(function(){
				window.scrollTo(0, $(this).closest( cls ).position().top);
			});
			if(ex != ""){
				ddx.addClass(ex);
			}
		} else{
			if(ex != ""){ p = "." + ex; }
			$(".redditplus-expando" + p,  $(this).closest( cls )).remove();
			$(this).html("r+")
		}
	};
}

// Each post on Reddit
$(".link").each(function() {
	var href = $("a.title", this).attr("href");

	var expando = $("<div>").addClass("redditplus-button fl").html("r+").attr("title", "Preview link");

	var x = href.indexOf("//") + 2;
	var domain = href.substring( x, href.indexOf("/", x) );
	var extension = href.substring( href.lastIndexOf(".") );

	expando.data("href", href).data("domain", domain);

	if( domains.indexOf( domain ) != -1 ){
		expando.click(expando_click(function(self){
			return handlers[ $(self).data("domain") ]( $(self).data("href") );
		})).insertAfter( $("p.title", this) );
	} else if(image_extensions.indexOf(extension) != -1){
		expando.click(expando_click(function(self){
			return make_image_expando( $(self).data("href") );
		})).insertAfter( $("p.title", this) );
	}
});

// Each link inside of a comment
var i = 0;
$(".commentarea .usertext-body a").each(function(){
	var href = $(this).attr("href");

	var expando = $("<span>").addClass("redditplus-button").html("r+").attr("title", "Preview link");

	var x = href.indexOf("//") + 2;
	var domain = href.substring( x, href.indexOf("/", x) );
	var extension = href.substring( href.lastIndexOf(".") );

	expando.data("href", href).data("domain", domain);

	if( domains.indexOf( domain ) != -1 ){
		expando.click(expando_click(function(self){
			return handlers[ $(self).data("domain") ]( $(self).data("href") );
		}, ".usertext-body", "exp" + i)).insertAfter( $(this) );
	} else if(image_extensions.indexOf(extension) != -1){
		expando.click(expando_click(function(self){
			return make_image_expando( $(self).data("href") );
		}, ".usertext-body", "exp" + i)).insertAfter( $(this) );
	}
	i++;
});
