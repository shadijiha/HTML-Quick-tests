
/**
 * Client side script for Shado Todo app
 */

    var toDoList = [];

    async function getData()    {
        const request = await fetch("/readDB");
        const json = await request.json();
        const data = json.results;

        toDoList = data;
    }

    function formateTime(time)  {

        // Convert time to seconds from milliseconds
        time = time / 1000;

        // time in seocnds
        var days = Math.floor(time / 86400);
        var hours = Math.floor((time - (days * 86400)) / 3600);
        var min = Math.floor((time -  (days * 86400) - (hours * 3600)) / 60 );
        var seconds = Math.floor( time -  (days * 86400) - (hours * 3600) - (min * 60) );

        days = days < 10 ? ('0' + days) : days;
        hours = hours < 10 ? ('0' + hours) : hours;
        min = min < 10 ? ('0' + min) : min;
        seconds = seconds < 10 ? ('0' + seconds) : seconds;

        return `${days}D ${hours}:${min}:${seconds}`;

    }

    function displayData(data)  {

        const BODY = document.getElementById("data_display");

        var str = `<table class="formated_table">
            <tr class="first_row">
                <th>Color</th>
                <th>Task</th>
                <th>Deadline</th>
                <th>Time left</th>
                <th>Options</th>
            </tr>`;

        // Sort data by the most urgent to least urgent
        data.sort(function(a, b)    {
            var t1 = new Date(a.deadline).getTime() - new Date().getTime();
            var t2 = new Date(b.deadline).getTime() - new Date().getTime();
            return t1 - t2;
        }); 

        for (let i = 0; i < data.length; i++)   {

            // Format the remaining time and date
            var timeLeft =  new Date(data[i].deadline).getTime() - new Date().getTime();
            var dateString = formateTime(timeLeft);

            var style = "";
             
            // Add colors to show emergency
            if ( Math.abs(timeLeft) < 6 * 60 * 60 * 1000) {
                style = "background-color: red; color: white; font-weight: bold;";
            } else if ( Math.abs(timeLeft) < 12 * 60 * 60 * 1000)    {
                style = "background-color: orange;"
            }

            str += "<tr>";
            
            str += `<td><div class="round" style="background-color: ${data[i].color}; color: ${data[i].color};">.</div></td>
                    <td>${data[i].todo}</td>
                    <td style="text-align: center;">${new Date(data[i].deadline).toLocaleString()}</td>
                    <td style="${style} text-align: center;" id="${data[i]._id}_td">${dateString}</td>
                    <td style="text-align: center;">
                        <img src="delete-trash-pngrepo-com.png" OnClick="deleteToDo('${data[i]._id}')" height="25"/>
                    </td>`

            str += "</tr>";

        }

        str += "</table>";

        BODY.innerHTML = str;
    }

    async function addData()  {

        var task = document.getElementById("task").value;
        var tempDeadline = document.getElementById("deadline").value;

        tempDeadline = tempDeadline.split("-");
        
        // Convert dead line from YYYY-MM-DD to 
        var deadline_hours = document.getElementById("deadline_hour").value;
        deadline_hours = deadline_hours.split(":");

        var deadline = new Date(Number(tempDeadline[0]), Number(tempDeadline[1] - 1), Number(tempDeadline[2]), Number(deadline_hours[0]), Number(deadline_hours[1]) );

        var color = document.getElementById("color").value;

        const data = { todo: task, deadline: deadline, color: color };
		
        const options = {
            method: 'POST',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(data)
        };

        const response = await fetch('/addTodo', options);	
        const json = await response.json();

        getData();

    }

    async function deleteToDo(id)   {

		const data = {id: id};
		
		const options = {
			method: 'POST',
			headers: {
				"Content-type": "application/json"
			},
			body: JSON.stringify(data)
		};
			
		const response = await fetch('/deleteTodo', options);
        
        for (let i = 0; i < 10; i++)    {
            getData();
        }		

    }

    function displayCalendar()  {

        var str = `<table>`;

        for (let i = 1; i <= 4; i++) {
            str += `<tr>`;
            for (let j = 1; j <= 7; j++) {
                str += `<td style="width: 50px; height: 50px;">${i * j}</td>`;
            }
            str += `</tr>`;
        }

        str += `</table>`;

        document.getElementById("data_display").innerHTML = str;
    }

    getData();

    setInterval(function()  {
        displayData(toDoList);
    }, 1000);

    //displayCalendar();
