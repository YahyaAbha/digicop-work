function Draw() {
    // Private variables
    var c,ctx,line;

    function drawBoard() {
        animateLine(c.width/3, 0, c.width/3, c.height);
        setTimeout(function(){animateLine(c.width*2/3, 0, c.width*2/3, c.height);},200);
        setTimeout(function(){animateLine(0, c.height/3, c.width, c.height/3);},500);
        setTimeout(function(){animateLine(0, c.height*2/3, c.width, c.height*2/3);},700);
    }

    function drawLine(x1,y1,x2,y2,ratio, color) {
        ctx.beginPath();
        ctx.moveTo(x1,y1);
        ctx.lineWidth = line.width;
        ctx.strokeStyle = color || line.color;
        x2 = (ratio != null) ? x1 + ratio * (x2-x1) : x2;
        y2 = (ratio != null) ? y1 + ratio * (y2-y1) : y2;
        ctx.lineTo(x2,y2);
        ctx.stroke();
        ctx.closePath();
    }

    function animateLine(x1,y1,x2,y2,ratio, speed, color) {
        var ratio = ratio || 0;
        var speed = speed || 0.1;
        if(ratio<1) {
            drawLine(x1,y1,x2,y2,ratio,color);
            requestAnimationFrame(function() {
                animateLine(x1,y1,x2,y2,ratio + speed,speed,color);
            });
        }
    }

    function drawCircle(x,y,r,ratio,color) {
        ctx.beginPath();
        ctx.lineWidth = line.width;
        ctx.strokeStyle = color || line.color;
        var angle = (ratio != null) ? 2*Math.PI*ratio : 2*Math.PI;
        ctx.arc(x, y, r, 0, angle);
        ctx.stroke();
        ctx.closePath();
    }

    function animateCircle(x,y,r,ratio, speed, color) {
        var ratio = ratio || 0;
        var speed = speed || 0.1;
        if(ratio<1) {
            drawCircle(x,y,r,ratio,color);
            requestAnimationFrame(function() {
                animateCircle(x,y,r,ratio+speed,speed,color);
            });
        }
    }

    // Public Functions
    this.init = function () {
        c = document.getElementById("ticktac");
        ctx = c.getContext("2d");

        c.height = 800;
        c.width = 800;
        line = {
            width: 10,
            color: "white"
        };
        drawBoard();
    }

    this.getMousePos = function (evt) {
        var rect = c.getBoundingClientRect();
        return {
          x: Math.floor((evt.clientX-rect.left)/(rect.right-rect.left)*c.width),
          y: Math.floor((evt.clientY-rect.top)/(rect.bottom-rect.top)*c.height)
        };
    }

    this.getCol = function (m) {
        var col = -1;
        if (m.x > 0 && m.x < c.width/3) {
            col = 1;
        } else if (m.x > c.width/3 && m.x < c.width*2/3) {
            col = 2;
        } else if (m.x > c.width*2/3 && m.x < c.width) {
            col = 3;
        } else {
            console.log("outside bounds");
        }
        return col;
    }

    this.getRow = function (m) {
        var row = -1;
        if (m.y > 0 && m.y < c.height/3) {
            row = 1;
        } else if (m.y > c.height/3 && m.y < c.height*2/3) {
            row = 2;
        } else if (m.y > c.height*2/3 && m.y < c.height) {
            row = 3;
        } else {
            console.log("outside bounds");
        }
        return row;
    }

    this.drawSymbol = function (col,row,xTurn) {
        var x = col * c.width/3 - c.width/6;
        var y = row * c.height/3 - c.height/6;

        if (xTurn) {
            animateLine(x-40,y-40,x+40,y+40);
            setTimeout(function() {
                animateLine(x+40,y-40,x-40,y+40);
            }, 100);
        } else {
            animateCircle(x,y,45);
        }
    }

    this.toCell = function (col,row) {
        return (row * 3) + col - 4;
    }

    this.clear = function () {
        ctx.clearRect(0, 0, c.width, c.height);
        drawBoard();
    }

    this.winningLine = function (col, row, dia) {
        if (col != null) {
            var x = col * c.width/3 - c.width/6;
            var y1 = 1 * c.height/3 - c.height/6;
            var y2 = 3 * c.height/3 - c.height/6;
            animateLine(x,y1, x, y2, null,null, "#F44336");
            return;
        } 
        if (row != null) {
            var x1 = 1 * c.width/3 - c.width/6;
            var x2 = 3 * c.width/3 - c.width/6;
            var y = row * c.height/3 - c.height/6;
            animateLine(x1, y, x2, y, null,null, "#F44336");
            return;
        } 
        if (dia != null) {
            var x1 = (dia*2-1) * c.width/3 - c.width/6;
            var x2 = (-2*dia+5) * c.width/3 - c.width/6;
            var y1 = (dia*0+1) * c.height/3 - c.height/6;
            var y2 = (0*dia+3) * c.height/3 - c.height/6;
            animateLine(x1,y1, x2, y2, null,null, "#F44336");
            return;
        } 
    }
}

function Game(){

    this.results = [];
    this.turnsLeft;
    this.xTurn = true;
    var resultEle = document.getElementById("result");
    this.games = {
        x: 0,
        o: 0
    };

    this.init = function(clickFunction){
        document.getElementById("ticktac").addEventListener("click", clickFunction);
        for (var i = 0; i < 3; i++){
            this.results[i] = [];
            for (var j = 0; j < 3; j++){
                this.results[i][j] = 0;
            }
        }
        this.turnsLeft = 9;
        this.xTurn = true;
        resultEle.innerHTML = "Lets Begin!";
        this.updateScore();
    }

    this.validMove = function (col,row, xTurn) {
        if (this.results[row-1][col-1] === 0 && this.turnsLeft != -1){
            this.results[row-1][col-1] = (xTurn) ? -1 : 1;
            return true;
        } else {
            return false;
        }
    }

    this.updateScore = function(xTurn) {
        if (xTurn == null) {
            document.getElementById("player1Score").innerHTML = this.games.x;
            document.getElementById("player2Score").innerHTML = this.games.o;
            return;
        }

        if (xTurn) {
            document.getElementById("player1Score").innerHTML = ++this.games.x;
        } else {
            document.getElementById("player2Score").innerHTML = ++this.games.o;
        }
    }

    this.checkIfWon = function () {
        var sumRow = 0 ,sumCol = 0, row = 0, col = 0, dia = 0;

        for (var i = 0; i < 3; i++) {
            var sum = Math.abs(this.results[i][0] + this.results[i][1] + this.results[i][2]);
            row = (sum > sumRow) ? i+1 : row;
            sumRow = (sum > sumRow) ? sum : sumRow;
            sum = Math.abs(this.results[0][i] + this.results[1][i] + this.results[2][i]);
            col = (sum > sumCol) ? i+1 : col;
            sumCol = (sum > sumCol) ? sum : sumCol;
        }
        var sumD1 = this.results[0][0] + this.results[1][1] + this.results[2][2];
        var sumD2 = this.results[0][2] + this.results[1][1] + this.results[2][0];

        if (sumRow === 3 || sumRow === -3 || sumCol === 3 || sumCol === -3 || sumD1 === 3 || sumD1 === -3 || sumD2 === 3 || sumD2 === -3) {
            resultEle.innerHTML = (this.xTurn) ? "Player 1 Won the game" : "Player 2 Won the game";
            this.updateScore(this.xTurn);
            this.turnsLeft = -1;
            row = (sumRow === 3 || sumRow === -3) ? row : null;
            col = (sumCol === 3 || sumCol === -3) ? col : null;
            if (sumD1 === 3 || sumD1 === -3) { dia = 1; } else if (sumD2 === 3 || sumD2 === -3) { dia = 2; } else { dia = null; };
            setTimeout (function(){draw.winningLine(col,row,dia);},200);
            return;
        }

        if (this.turnsLeft === 0) {
            resultEle.innerHTML = "No More turns Left";
            return;
        }
    }

    this.reset = function () {
        modalActivate("Reset the game?","Are you sure you want to RESET the scores?", function () {
            game.games.x = 0;
            game.games.o = 0;
            draw.clear();
            game.init();
        }); 
    }

    this.clear = function () {
        modalActivate("Clear the board?","Are you sure you want to clear the board?",function () {
            draw.clear();
            game.init();
        });
    }

}

var game = new Game();
var draw = new Draw();

draw.init();
game.init(selectCell);

function selectCell(e) {
    var m = draw.getMousePos(e);
    var row = draw.getRow(m),
        col = draw.getCol(m),
        cell= draw.toCell(col,row); // Cells are ordered 0-8... 0,1,2 in the first row

    if (game.validMove(col,row,game.xTurn)) {
        draw.drawSymbol(col,row,game.xTurn);
        game.turnsLeft = (game.turnsLeft != 0) ? --game.turnsLeft : 0;
        game.checkIfWon();
        game.xTurn = !game.xTurn;
    }
}

// Modal functions
function modalActivate(title, msg, callback) {
    // reset addEventListeners for modal
    removeElementEventListeners("alert");

    var modal = document.getElementById("alert");
    var container = document.getElementById("container");
    var modalTitle = document.getElementById("modal-title");
    var modalMsg = document.getElementById("modal-msg");
    var modalYes = document.getElementById("modal-yes");
    var modalNo = document.getElementById("modal-no");

    modalTitle.innerHTML = title;
    modalMsg.innerHTML = msg;
    modal.classList.add("show");
    container.classList.add("blur");

    
    modalYes.addEventListener("click",function (e) {
        callback();
        container.classList.remove("blur");
        modal.classList.add("out");
        setTimeout(function() {
            modal.classList.remove("show");
            modal.classList.remove("out");
        }, 500);
    });
    modalNo.addEventListener("click",function () {
        container.classList.remove("blur");
        modal.classList.add("out");
        setTimeout(function() {
            modal.classList.remove("show");
            modal.classList.remove("out");
        }, 500);
    })
}

function removeElementEventListeners(element) {
    var el = document.getElementById(element),
    elClone = el.cloneNode(true);
    el.parentNode.replaceChild(elClone, el);
}
