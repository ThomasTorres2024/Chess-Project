import ChessBoard from "/board/chessboard.js"

function changePiecePosition(newColor)
{
    var rect = element.getBoundingClientRect();
    //console.log(rect.top, rect.right, rect.bottom, rect.left);
}

//begins with coord pair for where the piece is located as a chess coordinate string, e.g. A1, A2, and then the piece type, e.g. black_pawn
let piece_location = new Map([

    //black pieces 
    ["A8","rook_black"],
    ["B8","horse_black"],
    ["C8","bishop_black"],
    ["D8","queen_black"],
    ["E8","king_black"],
    ["F8","bishop_black"],
    ["G8","horse_black"],
    ["H8","rook_black"],

    //white pieces 
    ["A1","rook_white"],
    ["B1","horse_white"],
    ["C1","bishop_white"],
    ["D1","queen_white"],
    ["E1","king_white"],
    ["F1","bishop_white"],
    ["G1","horse_white"],
    ["H1","rook_white"],

]

);

//Abstract  Class for a Chess Piece 
class ChessPiece{

    //Constructor 
    constructor(chessCoords,color)
    {   
        this.chessCoords = chessCoords;
        this.setColor(color);
        this.cartesianCoords = convertChessCoordsCartesian(chessCoords);
    }

    setType(newType)
    {
        this.type = newType;
    }

    setColor(newColor)
    {
        this.color = newColor;
    }

    //returns the type of the piece, e.g. rook, horse etc 
    getType()
    {
        return this.type;
    }

    //Returns piece color
    getColor()
    {
        return this.color;
    }

    //Returns the chess coordinates of a piece ((A....H),(1....8))
    getCoordsChess()
    {
        return this.chessCoords;
    }

    //Returns the Cartesian (x,y) coordinates of a chess piece
    getCoordsCartesian()
    {
        return this.cartesianCoords;
    }

    toString()
    {
        return`Coords: ${this.cartesianCoords}\nChess Coords: ${this.chessCoords}\nType: ${this.type}\nColor: ${this.color}`;
    }

    //Returns the chess coordinates of a list of squares which the current piece can be moved to 
    getMoveableSquare()
    {
        //Abstract Function, depends upon the piece type 
        

    }

}

//Pawn subclass 
class Pawn extends ChessPiece{
    //Constructor 
    constructor(chessCoords,color)
    {
        super(chessCoords,color);
        this.setType("pawn");

        //important to check if the pawn can move 1 or 2 squares
        this.hasMoved = false; 
    }

    //Determine Moveable Coords 
    
    getMoveableSquare()
    {
        //Check for pieces above, below, left, and right of current square 
        let moveableCoords = [];
        let x = this.getCoordsCartesian()[0];
        let y = this.getCoordsCartesian()[1];

        let increment_constant = 60; 
        if (this.color == "black")
        {
            increment_constant*=-1;
        }
        
        //if the pawn has moved, it can't be at 480, so increment it 
        if(this.hasMoved)
        {
            moveableCoords.push(convertCartesianChessCoords([x,y+increment_constant]))
        }
        else
        {
            moveableCoords.push(convertCartesianChessCoords([x,y+increment_constant],[x,y+2*increment_constant]))
        }
        return moveableCoords;
    }
}

class Queen extends ChessPiece{

    constructor(cartesianCoords,color)
    {
        super(cartesianCoords,color);
        this.type = "Queen";
    }

    //Needs to be defined 
    getMoveableSquare()
    {

    }
}

class Bishop extends ChessPiece{

    constructor(cartesianCoords,color)
    {
        super(cartesianCoords,color);
        this.type = "Bishop";
    }

    //Needs to be defined 
    getMoveableSquare()
    {

    }
}


class Horse extends ChessPiece{

    constructor(cartesianCoords,color)
    {
        super(cartesianCoords,color);
        this.type = "Horse";
    }

    //Needs to be defined 
    getMoveableSquare()
    {

    }
}

//Rook Subclass
class King extends ChessPiece{

    constructor(cartesianCoords,color)
    {
        super(cartesianCoords,color);
        this.type = "Rook";
    }

    //Determine moveable coords 
    getMoveableSquare()
    {
        //Check for pieces above, below, left, and right of current square 
        let moveableCoords = []
        //let x = 0;
        let y = 0;

        //console.log(this.cartesianCoords)
        let chars = ["A","B","C","D","E","F","G","H"]

        let y_pos = this.getCoordsCartesian()[1];
        let x_pos = this.getCoordsCartesian()[0];
        let char = convertBoardNumberToChar(x_pos);
        let boardNum = y_pos/60;
        console.log(y_pos)

        moveableCoords.push(this.getCoordsChess);

        //cycyle through 8 times, the amount of times needed to get from 60 to 480, the edge of the board
        for (let i = 0; i<8;i++)
        {   
            //console.log(this.getCoordsCartesian()[0],y)
            let converted_up = String(chars[i]+boardNum);
            //console.log(converted_up);
            let converted_side = String(char+(i+1)) ;
        
            moveableCoords.push(converted_up);
            moveableCoords.push(converted_side);

            y+=60;
        }

        
        return moveableCoords;
    }
}

//Rook Subclass
class Rook extends ChessPiece{

    constructor(cartesianCoords,color)
    {
        super(cartesianCoords,color);
        this.type = "Rook";
    }

    //Determine moveable coords 
    getMoveableSquare()
    {
        //Check for pieces above, below, left, and right of current square 
        let moveableCoords = []
        //let x = 0;
        let y = 0;

        //console.log(this.cartesianCoords)
        let chars = ["A","B","C","D","E","F","G","H"]

        let y_pos = this.getCoordsCartesian()[1];
        let x_pos = this.getCoordsCartesian()[0];
        let char = convertBoardNumberToChar(x_pos);
        let boardNum = y_pos/60;
        console.log(y_pos)

        moveableCoords.push(this.getCoordsChess);

        //cycyle through 8 times, the amount of times needed to get from 60 to 480, the edge of the board
        for (let i = 0; i<8;i++)
        {   
            //console.log(this.getCoordsCartesian()[0],y)
            let converted_up = String(chars[i]+boardNum);
            console.log(converted_up);
            let converted_side = String(char+(i+1)) ;
        
            moveableCoords.push(converted_up);
            moveableCoords.push(converted_side);

            y+=60;
        }

        
        return moveableCoords;
    }
}

function generate_board_pieces()
{   

    let pieceMap  = new Map([
        //white pieces 
        ["A1",new Rook("A1","white")],
        ["H1",new Rook("H1","white")],
        ["B1",new Rook("B1","white")],
        ["G1",new Rook("G1","white")],
        ["C1",new Bishop("C1","white")],
        ["F1",new Bishop("F1","white")],
        ["D1",new King("D1","white")],
        ["E1",new Queen("E1","white")],

        //black pieces 
        ["A8",new Rook("A8","black")],
        ["H8",new Rook("H8","black")],
        ["B8",new Rook("B8","black")],
        ["G8",new Rook("G8","black")],
        ["C8",new Bishop("C8","black")],
        ["F8",new Bishop("F8","black")],
        ["D8",new King("D8","black")],
        ["E8",new Queen("E8","black")],
    ]) 

        //add pawns 
        for(let i = 65; i<73;i++)
        {   

            blackPos = String.fromCharCode(i)+7
            whitePos = String.fromCharCode(i)+2

            console.log(blackPos)
            console.log(whitePos)

            //add white pawn
            pieceMap.set(whitePos,new Pawn(whitePos,"white"))

            //add black  pawn
            pieceMap.set(blackPos,new Pawn(blackPos,"black"))
        }

    return pieceMap  
}

//for a test 
function gen_coords()
{
    let coord_list = []
    for (let i = 0; i < 8; i++) {
        let x = (i+1)*60;
        for  (let j = 0; j<8;j++)
        {   
            let y = (j+1)*60;
            coord_list.push([x,y])  
        }
    }
    return coord_list
}

//Takes tuple of cartesian coordinates, e.g. (60,60) and converts it to chess coordinates
function convertCartesianChessCoords(cartesianCoords)
{   
    let x = cartesianCoords[0];
    let y = cartesianCoords[1];


    let charHashSet  = new Map([
        [0,"A"],
        [60,"B"],
        [120,"C"],
        [180,"D"],
        [240,"E"],
        [300,"F"],
        [360,"G"],
        [420,"H"],

    ])

    //Get the ASCII offset 
    //let asciiX = 65 + (x/60); 

    //Numeric and Letter part, in (H,8) this would be H --> Letteric, Numeric --> 8 
    let numeric = (x/60)+1;
    //let letter = String.fromCharCode(asciiX);
    let letter = charHashSet.get(y);

    return letter+numeric
}

function highlightSquares(piece)
{
    board_coords = piece.getMoveableSquare()

    for (let i = 1; i < board_coords.length; i++)
    {   
        //console.log(board_coords[i])
        document.getElementById(board_coords[i]).style.backgroundColor = "white";
    }

    
}

//let coords = gen_coords();
//coords.forEach(convertCartesianChessCoords);

function convertBoardNumberToChar(boardNumber)
{   
    let mapBoardNumsToChar  = new Map([
        [0,"A"],
        [60,"B"],
        [120,"C"],
        [180,"D"],
        [240,"E"],
        [300,"F"],
        [360,"G"],
        [420,"H"],
    
    ])
    return mapBoardNumsToChar.get(boardNumber)
}

function convertBoardCharToNum(boardChar)
{
    let mapBoardCharsToNums  = new Map([
        ["A",0],
        ["B",60],
        ["C",120],
        ["D",180],
        ["E",240],
        ["F",300],
        ["G",360],
        ["H",420],
    
    ])

    return mapBoardCharsToNums.get(boardChar)
}

/*
Converts Chess Coordinate, e.g. A1, to Cartesian, A1->(0,0)
*/
function convertChessCoordsCartesian(pair)
{   
    //convert char to an int, get x, get y 
    let x  = convertBoardCharToNum(pair[0]);
    let y = pair[1]*60;

    return [x,y];
}

let newChessBoard = new ChessBoard();
//const testPiece = new Rook("A1","white");
//highlightSquares(testPiece);
//let piecesOnBoard = generate_board_pieces();

