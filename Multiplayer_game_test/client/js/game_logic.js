/***
 * 
 *   JavaScript file that all LOGIC of the game
 * 
 */
     // Init game         
	const canvas = document.getElementById("engin");
	const c = canvas.getContext("2d");
	canvas.width = 600;
     canvas.height = 600;

	class Player	{
		constructor(initPack)	{
			this.id = initPack.id;
			this.number = initPack.number;
			this.x = initPack.x;
               this.y = initPack.y;
               this.color = initPack.color;
			Player.list[this.id] = this;
		}
	}
	Player.list = {};

	class Bullet	{
		constructor(initPack)	{
			this.id = initPack.id;
			this.x = initPack.x;
			this.y = initPack.y;
			Bullet.list[this.id] = this;
		}
	}
	Bullet.list = {};

	socket.on('init', data =>	{

          // { player : [{id:123,number:'1',x:0,y:0},{id:1,number:'2',x:0,y:0}], bullet: []}
		for (let i = 0; i < data.player.length; i++)	{
			new Player(data.player[i]);
		}

		for (let i = 0; i < data.bullet.length; i++)	{
			new Bullet(data.bullet[i]);
		}

     });
     
     socket.on('update', data =>	{

		for (let i = 0; i < data.player.length; i++)	{
               var pack = data.player[i];
               var p = Player.list[pack.id];
			if (p)    {
                    if (pack.x != undefined) 
                         p.x = pack.x;
                    if (pack.y != undefined)
                         p.y = pack.y;
               }
          }
          
		for (let i = 0; i < data.bullet.length; i++)	{
               var pack = data.bullet[i];
               var b = Bullet.list[data.bullet[i].id];
			if (b)    {
                    if (pack.x != undefined) 
                         b.x = pack.x;
                    if (pack.y != undefined)
                         b.y = pack.y;
               }
		}

     }); 
     
     socket.on('remove', data =>   {

          for (let i = 0; i < data.player.length; i++) {
               delete Player.list[data.player[i]];
          }

          for (let i = 0; i < data.bullet.length; i++) {
               delete Bullet.list[data.bullet[i]];
          }

     });

     // Drawing here
     setInterval(function()   {
          c.clearRect(0, 0, canvas.width, canvas.height);

          for (var i in Player.list)    {
               c.fillStyle = Player.list[i].color;
               c.beginPath();
               c.arc(Player.list[i].x, Player.list[i].y, 20, 0, Math.PI * 2, false);
               c.fill();

               c.font = "30px Arial";
               c.fillStyle = "black";
               c.fillText(Player.list[i].number, Player.list[i].x - 8, Player.list[i].y + 10);
          }

          for (var i in Bullet.list)
               c.fillRect(Bullet.list[i].x - 5, Bullet.list[i].y - 5, 10, 10);         

     }, 1000 / 25);


