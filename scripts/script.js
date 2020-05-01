(function(){
    
    //start
    function BrickGame() {
        var BRICK_SIZE    = 23,
            SCREEN_WIDTH  = 10,
            SCREEN_HEIGHT = 20,
            LEFT          = 37, //left arrow keyCode
            UP            = 38,
            RIGHT         = 39, //right arrow keyCode
            DOWN          = 40,
            SPACE         = 32;
          
        player = {
            'position' : '194', //player can move from 190 to 199 (bottom line)
            
            'bulletPosition' : '0',
            
            'score' : '0',
            
            'curent' : function () {
                return document.getElementById('br' + player.position);
            },
            
            'getBrick' : function (id) {
                return document.getElementById('br' + id);
            },
            
            'set' : function () {
                this.curent().className += ' active';
            },
            
            'setBullet' : function () {
                this.getBrick(this.bulletPosition).className += ' active bullet';
            },
            
            'clear' : function (id) {
                this.getBrick(id).className=this.getBrick(id).className.replace(new RegExp('(\\s|^)active(\\s|$)'),' ').replace(/^\s+|\s+$/g, '');
                this.getBrick(id).className=this.getBrick(id).className.replace(new RegExp('(\\s|^)bullet(\\s|$)'),' ').replace(/^\s+|\s+$/g, '');
                this.getBrick(id).className=this.getBrick(id).className.replace(new RegExp('(\\s|^)enemy(\\s|$)'),' ').replace(/^\s+|\s+$/g, '');
            },
            
            'moveLeft' : function () {
                if(this.position > 190) { //left hand side of the screen
                    this.clear(this.position);
                    this.position--;
                    this.set();
                };
                console.log('active brick: ' + player.position);
            },
            
            'moveRight' : function () {
                if(this.position < 199) { //right hand side of the screen
                    this.clear(this.position);
                    this.position++;
                    this.set();
                };
                console.log('active brick: ' + player.position);
            },
            
            'isEnemy' : function (el) {
                return new RegExp('(\\s|^)'+'enemy'+'(\\s|$)').test(el.className);
            },
            
            'fire' : function () {
                vline = 190; //vertical line
                hline = 10;  //horizontal lone
                i = this.position - hline;
                
                function bulletAnimation() {
                    player.bulletPosition = i;
                    player.setBullet();
                    time = setTimeout(
                            function() {
                                player.clear(player.bulletPosition);
                                i = i - hline; 
                                if (i >= (player.position - vline)) {
                                    if(player.isEnemy(player.getBrick(player.bulletPosition - hline))){
                                        player.clear(player.bulletPosition - hline);
                                        player.score++;
                                        document.getElementById('value-score').innerHTML = player.score;
                                        console.log('Player score:' + player.score);
                                    } else {
                                        bulletAnimation();
                                    }  
                                }
                            }, 
                                1 //speed of bullet
                            );
                };
                bulletAnimation();
            },
            
            'shoot' : function () {
                hline = 10;
                this.getBrick(this.bulletPosition - hline);
            }    
        };
        
        invaders = {
            
            'dificult' : '0',
            
            'speed' : 800,
            
            'firstLine' : 1,
            
            'getBrick' : function (id) {
                return document.getElementById('br' + id);
            },
            
            'set' : function (id) {
                this.getBrick(id).className += ' active enemy';
            },
            
            'clear' : function (id) {
                this.getBrick(id).className=this.getBrick(id).className.replace(new RegExp('(\\s|^)active(\\s|$)'),' ').replace(/^\s+|\s+$/g, '');
                this.getBrick(id).className=this.getBrick(id).className.replace(new RegExp('(\\s|^)enemy(\\s|$)'),' ').replace(/^\s+|\s+$/g, '');
            },
            
            'fillLine' : function () {
                hline = 10; //horizontal line
                for(var i = 0; i < hline; i++) {
                    if((Math.round(Math.random() + this.dificult)) > 0) {
                        this.set(i);
                    }
                }
            },
            
            'isActive' : function (el) {
                    return new RegExp('(\\s|^)'+'active'+'(\\s|$)').test(el.className);
            },
            
            'moveLine' : function (line) {
                hline = 10; //horizontal line
                for(var i = (hline * (line) - hline); i < (hline * (line)); i++) {
                    if(player.isEnemy(this.getBrick(i))) {
                        this.clear(i);
                        this.set(i + hline);
                    }
                }
            },
            
            'moveScreen' : function () {
                timer = setInterval(
                        function () {
                            invaders.firstLine++;
                            for(var i = invaders.firstLine; i > 0; i--){
                               invaders.moveLine(i);
                            }
                            
                            isDestroyedLine = true;
                            for(var i = (invaders.firstLine * 10 - 10); i < invaders.firstLine * 10; i++) {
                                if(player.isEnemy(player.getBrick(i))) {
                                    isDestroyedLine = false;
                                }
                            }
                            if(isDestroyedLine) {
                                invaders.firstLine--;
                            }
                            console.log(invaders.firstLine + '===' + SCREEN_HEIGHT);     
                            if(invaders.firstLine === SCREEN_HEIGHT) {
                                window.clearInterval(timer);
                                alert('GAME OVER! Your score is ' + player.score);
                            }
                            invaders.fillLine();
                        },
                        this.speed);
            }
        };
        
        fillMainScreen = function() {
            var screen = document.getElementById('mainScreen');
            var bricksCount = SCREEN_WIDTH * SCREEN_HEIGHT;
            for(var i = 0; i < bricksCount; i++) {
                var brick = document.createElement('div');
                brick.style.width = BRICK_SIZE + 'px';
                brick.style.height = BRICK_SIZE + 'px';
                brick.id = 'br' + i;
                screen.appendChild(brick);
            }
        };

        playerAction = function(keyCode) {
            if(keyCode === LEFT) {
                player.moveLeft();
            } else if (keyCode === RIGHT) {
                player.moveRight();
            } else if (keyCode === SPACE) {
                console.log('fire!');
                player.fire();
            }
        };
        
        this.init = function() {
            fillMainScreen();
            player.set();
            invaders.fillLine();
            invaders.moveScreen();
            document.getElementById('startBtn').onclick = function() {
                location.reload();
            }; 
            document.body.onkeydown = function(e) {
                var e = e || window.event;
                playerAction(e.keyCode);
            };
        };
    }
    //end
    
    if (!window.brickGame) window.brickGame = new BrickGame();
    window.onload = function() {
        window.brickGame.init();
    };
})();