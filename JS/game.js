var width = 450, 
        height = 600,
        gLoop,
        points = 0,
        state = true,
        c = document.getElementById('c'), 
        ctx = c.getContext('2d');
                        
        c.width = width;
        c.height = height;
var userPlayer = new Image();
userPlayer.src = "gfx/ges.png";
function Button(x,y, width, height, text, colorBackground,colorText,ctx){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.text = text;
	this.colorBackground = colorBackground;
	this.colorText = colorText;
	this.ctx = ctx;
	this.drawButton = function () {
	  this.ctx.fillStyle = this.colorBackground;
	  this.ctx.fillRect(this.x, this.y, this.width,this.height);
	  this.ctx.fillStyle = this.colorText;
	  this.ctx.font = "bold 16px Arial, sans-serif";
	  var textSize = ctx.measureText(this.text);
	  var XCord = (this.width/2) - (textSize.width/2);
	  this.ctx.fillText(this.text,XCord+this.x,(this.height/2)+this.y+5);
	};
};

var buttons = [];

//Menu created      
function startMenu(){
		var buttons = [];
 	 	ctx.fillStyle = '#e0e8f5';
 	 	ctx.fillRect(0, 0, width, height);
 	 	
 	 	buttons.push(new Button(width/2-(width/4),height/3,width/2,height/20,'Zacznij grę','#000','#fff',ctx));
 	 	buttons.push(new Button(width/2-(width/4),buttons[0].y+buttons[0].height+10,width/2,height/20,'Regulamin','#000','#fff',ctx));
 	 	buttons.push(new Button(width/2-(width/4),buttons[1].y+buttons[1].height+10,width/2,height/20,'Jak grać?','#000','#fff',ctx));
 	 	buttons.push(new Button(width/2-(width/4),buttons[2].y+buttons[2].height+10,width/2,height/20,'Najlepszy gracz','#000','#fff',ctx));
 	 	for (var i=0; i < buttons.length; i++) {
			buttons[i].drawButton();
		  };
		 c.addEventListener('click',onclicks, false);
		 // Onmouseup event handler
		function onclicks(event){
		   	event = event || window.event;
		
		    var canvas = document.getElementById('c'),
		    x = event.pageX - canvas.offsetLeft,
		    y = event.pageY - canvas.offsetTop;
		    for( var i=0; i < buttons.length; i++){
		    	if(buttons[i].x < x && (buttons[i].x+ buttons[i].width) > x && buttons[i].y < y && (buttons[i].y + buttons[i].height) >y)
		    		if(buttons[i].text === 'Zacznij grę')
		    			GameLoop();
		    }
		    
		    
		}
};




var clear = function(){
        ctx.fillStyle = '#d0e7f9';
        ctx.clearRect(0, 0, width, height);
        ctx.beginPath();
        ctx.rect(0, 0, width, height);
        ctx.closePath();
        ctx.fill();
};

var howManyCircles = 10, circles = [];

for (var i = 0; i < howManyCircles; i++) 
        circles.push([Math.random() * width, Math.random() * height, Math.random() * 100, Math.random() / 2]);

var DrawCircles = function(){
        for (var i = 0; i < howManyCircles; i++) {
                ctx.fillStyle = 'rgba(255, 255, 255, ' + circles[i][3] + ')';
                ctx.beginPath();
                ctx.arc(circles[i][0], circles[i][1], circles[i][2], 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.fill();
        }
};

var MoveCircles = function(e){
        for (var i = 0; i < howManyCircles; i++) {
                if (circles[i][1] - circles[i][2] > height) {
                        circles[i][0] = Math.random() * width;
                        circles[i][2] = Math.random() * 100;
                        circles[i][1] = 0 - circles[i][2];
                        circles[i][3] = Math.random() / 2;
                }
                else {
                        circles[i][1] += e;
                }
        }
};

var player = new (function(){
  var that = this;
  that.image = new Image();

  that.image.src = "gfx/ges.png";
  that.width = 65;
  that.height = 90;
  that.frames = 1;
  that.actualFrame = 0;
  that.X = 0;
  that.Y = 0;  

  that.isJumping = false;
  that.isFalling = false;
  that.jumpSpeed = 0;
  that.fallSpeed = 0;
  
    that.jump = function() {
    if (!that.isJumping && !that.isFalling) {
      that.fallSpeed = 0;
      that.isJumping = true;
      that.jumpSpeed = 17;
    }
  };
  
  that.checkJump = function() {
    //a lot of changes here
        
    if (that.Y > height*0.4) {
      that.setPosition(that.X, that.Y - that.jumpSpeed);    
    }
    else {
      if (that.jumpSpeed > 10) 
        points++;
      // if player is in mid of the gamescreen
      // dont move player up, move obstacles down instead
      MoveCircles(that.jumpSpeed * 0.5);
      
      platforms.forEach(function(platform, ind){
        platform.y += that.jumpSpeed;
        
        //if (e.posY<highestObst) highestObst = e.posY; //distance of highest obstacle
        // necessary for creating new obst.
        
        if (platform.y > height) {
          var type = ~~(Math.random() * 5);
          if (type == 0) 
            type = 1;
          else 
            type = 0;
          //platforms[ind] = new Platform(Math.random() * (width - 70), e.y - height, type);
          platforms[ind] = new Platform(Math.random() * (width - platformWidth), platform.y - height, type);
        }
      });
    };
    
    
    that.jumpSpeed--;
    if (that.jumpSpeed == 0) {
      that.isJumping = false;
      that.isFalling = true;
      that.fallSpeed = 1;
    }
  
  };
  
  that.fallStop = function(){
    that.isFalling = false;
    that.fallSpeed = 0;
    that.jump();  
  };
  
  that.checkFall = function(){
    if (that.Y < height - that.height) {
      that.setPosition(that.X, that.Y + that.fallSpeed);
      that.fallSpeed++;
    } else {
      if (points == 0) 
        that.fallStop();
      else 
        GameOver();
    }
  };
  
  that.moveLeft = function(){
    if (that.X > 0) {
      that.setPosition(that.X - 5, that.Y);
    }
  };
  
  that.moveRight = function(){
    if (that.X + that.width < width) {
      that.setPosition(that.X + 5, that.Y);
    }
  };

  
  that.setPosition = function(x, y){
    that.X = x;
    that.Y = y;
  };
  
  that.interval = 0;
  that.draw = function(){
    try {
      ctx.drawImage(that.image, 0, that.height * that.actualFrame, that.width, that.height, that.X, that.Y, that.width, that.height);
    } 
    catch (e) {
    };
    
    if (that.interval == 4 ) {
      if (that.actualFrame == that.frames) {
        that.actualFrame = 0;
      }
      else {
        that.actualFrame++;
      }
      that.interval = 0;
    }
    that.interval++;    
  };
})();


player.setPosition(~~((width-player.width)/2), height - player.height);
player.jump();

document.onmousemove = function(e){
  if (player.X + c.offsetLeft > e.pageX) {
    player.moveLeft();
  } else if (player.X + c.offsetLeft < e.pageX) {
    player.moveRight();
  }
  
};
  var nrOfPlatforms = 7, 
    platforms = [],
    platformWidth = 70,
    platformHeight = 20;
     
  var Platform = function(x, y, type){
    var that=this;
    
    that.firstColor = '#FF8C00';
    that.secondColor = '#EEEE00';
    that.onCollide = function(){
      player.fallStop();
    };
    
    if (type === 1) {
      that.firstColor = '#AADD00';
      that.secondColor = '#698B22';
      that.onCollide = function(){
        player.fallStop();
        player.jumpSpeed = 50;
      };
    }
    
    

    that.x = ~~ x;
    that.y = y;
    that.type = type;
    
    //NEW IN PART 5
    that.isMoving = ~~(Math.random() * 2);
    that.direction= ~~(Math.random() * 2) ? -1 : 1;
      
    that.draw = function(){
      ctx.fillStyle = 'rgba(255, 255, 255, 1)';
      var gradient = ctx.createRadialGradient(that.x + (platformWidth/2), that.y + (platformHeight/2), 5, that.x + (platformWidth/2), that.y + (platformHeight/2), 45);
      gradient.addColorStop(0, that.firstColor);
      gradient.addColorStop(1, that.secondColor);
      ctx.fillStyle = gradient;
      ctx.fillRect(that.x, that.y, platformWidth, platformHeight);
    };
  
    return that;
  };
    
  var generatePlatforms = function(){
    var position = 0, type;
    for (var i = 0; i < nrOfPlatforms; i++) {
      type = ~~(Math.random()*5);
      if (type == 0) 
        type = 1;
      else 
        type = 0;
      platforms[i] = new Platform(Math.random() * (width - platformWidth), position, type);
      if (position < height - platformHeight) 
        position += ~~(height / nrOfPlatforms);
    }
  }();
        
        var checkCollision = function(){
        platforms.forEach(function(e, ind){
                if (
                (player.isFalling) && 
                (player.X < e.x + platformWidth) && 
                (player.X + player.width > e.x) && 
                (player.Y + player.height > e.y) && 
                (player.Y + player.height < e.y + platformHeight)
                ) {
                        e.onCollide();
                }
        });
        };

var GameLoop = function(){
        clear();
        //MoveCircles(5);
        DrawCircles();

        if (player.isJumping) player.checkJump();
        if (player.isFalling) player.checkFall();
        
        player.draw();
        
        platforms.forEach(function(platform, index){
                if (platform.isMoving) {
                        if (platform.x < 0) {
                                platform.direction = 1;
                        } else if (platform.x > width - platformWidth) {
                                platform.direction = -1;
                        }
                                platform.x += platform.direction * (index / 2) * ~~(points / 100);
                        }
                platform.draw();
        });
        
        checkCollision();
        
        ctx.fillStyle = "Black";
        ctx.fillText("POINTS:" + points, 10, height-10);
        
        if (state)
                gLoop = setTimeout(GameLoop, 1000 / 50);
};

        var GameOver = function(){
        		var data = points;
        		$.post("php/result.php",{postpoints:data,postname:name,postsecoundname:secoundname,postmail:mail});
                state = false;
                clearTimeout(gLoop);
                setTimeout(function(){
                        clear();
                        
                        ctx.fillStyle = "Black";
                        ctx.font = "10pt Arial";
                        ctx.fillText("GAME OVER", width / 2 - 60, height / 2 - 50);
                        ctx.fillText("YOUR RESULT:" + points, width / 2 - 60, height / 2 - 30);
						buttons.push(new Button(width / 4 ,height / 2 + 10,width/2,height/20,'Zagraj jeszcze raz','#000','#fff',ctx));
                        for (var i=0; i < buttons.length; i++) {
							buttons[i].drawButton();
		  				};
                }, 100);
                 c.addEventListener('click',onclicks, false);
				 // Onmouseup event handler
				function onclicks(event){
				   	event = event || window.event;
				
				    var canvas = document.getElementById('c'),
				    x = event.pageX - canvas.offsetLeft,
				    y = event.pageY - canvas.offsetTop;
				    for( var i=0; i < buttons.length; i++){
				    	if(buttons[i].x < x && (buttons[i].x+ buttons[i].width) > x && buttons[i].y < y && (buttons[i].y + buttons[i].height) >y)
				    		if(buttons[i].text === 'Zagraj jeszcze raz'){
				    			reloadPage();
				    		}
				    			
				    }
				
				    
		    
				}
        };
 function reloadPage(){
   window.location.reload();
}
        
window.onload = startMenu;