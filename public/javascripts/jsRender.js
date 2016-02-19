(function($) {
	$(document).ready(function() {
		var $container = $('ul.tweets'),
			socket = io.connect('http://localhost:3000'),
			template = $('#tweetTemplate');
			
 
	    socket.on('twitter', function(data) {
	        $container.append(template.render(data));
	    });
	});
})(jQuery);