/***  
 * JavaScript main file for "Root" project 
 * 
 * 
 */
 
 
	window.onload = function()	{

		// Setting a random background
		const BODY = document.querySelector("body");

		var bgs = [
			"photo-1501854140801-50d01698950b.jpg",
			"photo-1466854076813-4aa9ac0fc347.jpg",
			"photo-1452570053594-1b985d6ea890.jpg",
			"photo-1504681869696-d977211a5f4c.jpg",
			"photo-1470071459604-3b5ec3a7fe05.jpg",
			"photo-1442508748335-fde9c3f58fd9.jpg",
			"photo-1490617033217-c50a46c169ec.jpg",
			"photo-1502261159926-e31d770eb6e1.jpg"
		];

		BODY.style.background = `url('Data/Backgrounds/${bgs[Math.floor(Math.random() * bgs.length)]}')`;

		setInterval(function()	{
			BODY.style.background = `url('Data/Backgrounds/${bgs[Math.floor(Math.random() * bgs.length)]}')`;
		}, 5000);

		// Setting clock
		const CLOCK = document.getElementById("current_time");
		const DATE = document.getElementById("date")
		
		setInterval(function()	{

			var hours = new Date().getHours();
			var min = new Date().getMinutes();
	
			if (hours.toString().length < 2)	{
				hours = "0" + hours;
			}
	
			if (min.toString().length < 2)	{
				min = "0" + min;
			}
	
			CLOCK.innerHTML = `${hours}:${min}`;

			// Day and month
			var day = new Date().getDay();
			var monthDay = new Date().getDate();
			var month = new Date().getMonth();
			var year = new Date().getFullYear();

			switch(day)	{
				case 0: 
					day = "Sun";
					break;
				case 1: 
					day = "Mon";
					break;
				case 2: 
					day = "Tue";
					break;
				case 3: 
					day = "Wed";
					break;
				case 4: 
					day = "Thu";
					break;
				case 5: 
					day = "Fri";
					break;
				case 6: 
					day = "Sat";
					break;
			}

			switch(month)	{
				case 0: 
					month = "Jan";
					break;
				case 1: 
					month = "Feb";
					break;
				case 2: 
					month = "Mar";
					break;
				case 3: 
					month = "Apr";
					break;
				case 4: 
					month = "May";
					break;
				case 5: 
					month = "Jun";
					break;
				case 6: 
					month = "Jul";
					break;
				case 7: 
					month = "Aug";
					break;
				case 8: 
					month = "Sep";
					break;
				case 9: 
					month = "Oct";
					break;
				case 10: 
					month = "Nov";
					break;
				case 11: 
					month = "Dec";
					break;
			}

			DATE.innerHTML = `${day}. ${monthDay} ${month}. ${year}`;

		}, 1000);


 
	}