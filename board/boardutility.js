//Utility Class 

//Map of Chars to Their Corresponding x position on the chessboard 
let fileToCartesianMap  = new Map([
    ["A",0],
    ["B",60],
    ["C",120],
    ["D",180],
    ["E",240],
    ["F",300],
    ["G",360],
    ["H",420],

])

//Map of Nums, rank, to chars on the board, file 
let cartesianToFileMap  = new Map([
    [0,"A"],
    [60,"B"],
    [120,"C"],
    [180,"D"],
    [240,"E"],
    [300,"F"],
    [360,"G"],
    [420,"H"],

])

//Returns if square is light or dark.
function pointToColor(point)
{   
    let color = "";

    //ROW IS EVEN --> Light on even, file 66, file 68 etc

    const file = point[0].charCodeAt(0);
    const rank = parseInt(point[1])-1;

    //evaluate evben rank
    if(rank%2 == 0)
    {   

        if(file%2>0)
        {
            color = "dark";
        }
        else
        {
            color = "light"
        }
    }

    //evaluate odd ranks 
    else
    {
        if(file%2>0)
            {
                color = "light";
            }
            else
            {
                color = "dark"
            }
    }

    return color;
}

//Returns the converted coordinate of the piece 
function convertApproximateCoordsToBoard(x,y)
{   
    //convert approx pieces to floorered versions 
    x = Math.floor(x/60)*60;
    y = Math.floor(y/60);

    //convert  pieces and map
    let file = cartesianToFileMap.get(x)
    let rank = y+1;

    return file+rank
}

//Iterates in the manner, starting from e4 for instance: f5, g6,h7, d3, c2, b1 
function iterateUpwardRight(squareIterated,board,piece,fileOfPiece,rankOfPiece,fileIterative,rankIterative,moveableList,takeableList)
{  

    //check bounds so that ord(filel) < 72 and that rank < 9. 
    if(fileIterative > 72 || rankIterative > 8)
    {
        //recursive case 
        iterateUpwardRight(board.getSquareAt(String.fromCharCode(fileOfPiece-1)+(rankOfPiece-1)),board,piece,fileOfPiece,rankOfPiece,fileOfPiece-1,rankOfPiece-1,moveableList,takeableList);
    }

    //if the boundary conditions are satisfied and greater than parameters of the circle 
    else if((fileOfPiece < fileIterative) &&(rankOfPiece<rankIterative) )
    {      
        if(squareIterated.getFilled())
        {
            if(squareIterated.getPiece().getColor() != piece.getColor())
            {
                takeableList.push(String.fromCharCode(fileIterative)+rankIterative);
            }
            iterateUpwardRight(board.getSquareAt(String.fromCharCode(fileOfPiece-1)+(rankOfPiece-1)),board,piece,fileOfPiece,rankOfPiece,fileOfPiece-1,rankOfPiece-1,moveableList,takeableList);
        }
        //Board evaluate move function checks if the move to this square will induce a check on the player making move, if such a 
        //move is made, then the square will not be added to the function 
        else
        {
            moveableList.push(String.fromCharCode(fileIterative)+rankIterative);
            iterateUpwardRight(board.getSquareAt(String.fromCharCode(fileIterative+1)+(rankIterative+1)),board,piece,fileOfPiece,rankOfPiece,fileIterative+1,rankIterative+1,moveableList,takeableList);
        }
    }
    //if the iterative square reaches the lower border, base case 
    else if(fileIterative < 65 || rankIterative < 1)
    {
        return;
    }

    //the last condition si the result is biunded between for the file [a,file present] and [1,file present], so i can go -1 on both
    else
    {   

        //checks if the square is fileld 
        if(squareIterated.getFilled())
            {      
                //if color opposition piece is takeable
                if(squareIterated.getPiece().getColor() != piece.getColor())
                {
                    takeableList.push(String.fromCharCode(fileIterative)+rankIterative);
                }
                return;
            }

            else
            {
                moveableList.push(String.fromCharCode(fileIterative)+rankIterative);
                iterateUpwardRight(board.getSquareAt(String.fromCharCode(fileIterative-1)+(rankIterative-1)),board,piece,fileOfPiece,rankOfPiece,fileIterative-1,rankIterative-1,moveableList,takeableList);
            }
    }

}

////Iterates in the manner, starting from e4 for instance: f5, g6,h7, d3, c2, b1 
function iterateDownwardRight(squareIterated,board,piece,fileOfPiece,rankOfPiece,fileIterative,rankIterative,moveableList,takeableList)
{

    //go from square to top right of board 

    //check bounds so that ord(filel) < 72 and that rank < 9. 
    if(fileIterative > 72 || rankIterative < 1)
    {   

        //temporary return until i can work the rest of this
        iterateDownwardRight(board.getSquareAt(String.fromCharCode(fileOfPiece-1)+(rankOfPiece+1)),board,piece,fileOfPiece,rankOfPiece,fileOfPiece-1,rankOfPiece+1,moveableList,takeableList);
    }

    //if the boundary conditions are satisfied and greater than parameters of the circle 
    else if((fileOfPiece < fileIterative) &&(rankOfPiece>rankIterative) )
    {    
        if(squareIterated.getFilled())
        {   
            if(squareIterated.getPiece().getColor() != piece.getColor())
            {   
                takeableList.push(String.fromCharCode(fileIterative)+rankIterative);
            }
            iterateDownwardRight(board.getSquareAt(String.fromCharCode(fileOfPiece-1)+(rankOfPiece+1)),board,piece,fileOfPiece,rankOfPiece,fileOfPiece-1,rankOfPiece+1,moveableList,takeableList);
        }
        else
        {   
            moveableList.push(String.fromCharCode(fileIterative)+rankIterative);
            iterateDownwardRight(board.getSquareAt(String.fromCharCode(fileIterative+1)+(rankIterative-1)),board,piece,fileOfPiece,rankOfPiece,fileIterative+1,rankIterative-1,moveableList,takeableList);
        }
    }
    //if the iterative square reaches the lower border
    else if(fileIterative < 65 || rankIterative > 8)
    {
        return
    }

    //the last condition si the result is biunded between for the file [a,file present] and [1,file present], so i can go -1 on both
    else
    {   
        

        //checks if the square is fileld 
        if(squareIterated.getFilled())
            {    
                //if color opposition piece is takeable
                if(squareIterated.getPiece().getColor() != piece.getColor())
                {
                    takeableList.push(String.fromCharCode(fileIterative)+rankIterative);
                }
                return;
            }

            else
            {
                moveableList.push(String.fromCharCode(fileIterative)+rankIterative);
                iterateDownwardRight(board.getSquareAt(String.fromCharCode(fileIterative-1)+(rankIterative+1)),board,piece,fileOfPiece,rankOfPiece,fileIterative-1,rankIterative+1,moveableList,takeableList);
            }
    }
}

//Iterates over a file. Note a  key difference between this function and the function to iterate over rows, is that this function makes use of
//ordinals. File of Piece --> Ordinal of Piece's File. File Iterative --> Ordinal of piece's file. 
function iterateOverFile(squareIterated,board,piece,fileOfPiece,rankOfPiece,fileIterative,moveableList,takeableList)
{   

    //if the row of the piece goes over the border set it to be less than one of the file of the piece
    if(fileIterative > 72)
    {   
        iterateOverFile(board.getSquareAt(String.fromCharCode(fileOfPiece.charCodeAt(0)-1)+rankOfPiece),board,piece,fileOfPiece,rankOfPiece,fileOfPiece.charCodeAt(0)-1,moveableList,takeableList);
    }

    //if 72 > file > file iterative, this means that the rank is right of the piece, but left of the border limit
    else if(fileIterative >fileOfPiece.charCodeAt(0))
    {   

        //check if piece intersects with square we are checking, set it to 1 underneath the piece
        if (squareIterated.getFilled())
        {      

            //check if piece is opposing color
            if(squareIterated.getPiece().getColor() != piece.getColor())
            {   
                takeableList.push(String.fromCharCode(fileIterative)+rankOfPiece);
            }
            iterateOverFile((board.getSquareAt(String.fromCharCode(fileOfPiece.charCodeAt(0)-1)+rankOfPiece)),board,piece,fileOfPiece,rankOfPiece,fileOfPiece.charCodeAt(0)-1,moveableList,takeableList);
        }

        //if the square isn't filled, bump up the rank by one, and add the coord to moveable squares
        else
        {   
            moveableList.push(String.fromCharCode(fileIterative)+rankOfPiece)
            iterateOverFile((board.getSquareAt(String.fromCharCode(fileIterative+1)+rankOfPiece)),board,piece,fileOfPiece,rankOfPiece,fileIterative+1,moveableList,takeableList);
        }

    }

    //rank has hit the edge of the border, stop recursion. 
    else if(fileIterative < 65)
    {
        return;
    }

    //implies that the bounds of the rank search are [1,pieceRank-1], pieces in this range are moveable and takeable. 
    else
    {
        //check if piece intersects with square we are checking, set it to 1 underneath the piece
        if (squareIterated.getFilled())
            {     
                //check if piece is opposing color, add to list if opposition
                if(squareIterated.getPiece().getColor() != piece.getColor())
                {
                    takeableList.push(String.fromCharCode(fileIterative)+rankOfPiece);
                }
                return; 
            }
    
            //if the square isn't filled, decrease the rank by one, and add the coord to moveable squares
            else
            {   
                moveableList.push(String.fromCharCode(fileIterative)+rankOfPiece);
                iterateOverFile((board.getSquareAt(String.fromCharCode(fileIterative-1)+rankOfPiece)),board,piece,fileOfPiece,rankOfPiece,fileIterative-1,moveableList,takeableList);
            }
    }

}

//Iterates over either a  file or a horizontal. 
function iterateOverRank(squareIterated,board,piece,fileOfPiece,rankOfPiece,rankIterative,moveableList,takeableList)
{   

    //if the row of the piece goes over the border set it to be less than one of the rank of the piece
    if(rankIterative > 8)
    {
        iterateOverRank(board.getSquareAt(fileOfPiece+(rankOfPiece-1)),board,piece,fileOfPiece,rankOfPiece,rankOfPiece-1,moveableList,takeableList);
    }

    //if rank > rankiterative, this means that the rank is above that of the piece, but below the border limit
    else if(rankIterative >rankOfPiece)
    {   

        //check if piece intersects with square we are checking, set it to 1 underneath the piece
        if (squareIterated.getFilled())
        {      

            //check if piece is opposing color
            if(squareIterated.getPiece().getColor() != piece.getColor())
            { 
                takeableList.push(fileOfPiece+rankIterative);
            }

            iterateOverRank(board.getSquareAt(fileOfPiece+(rankOfPiece-1)),board,piece,fileOfPiece,rankOfPiece,rankOfPiece-1,moveableList,takeableList);
        }

        //if the square isn't filled, bump up the rank by one, and add the coord to moveable squares
        else
        {   
            moveableList.push(fileOfPiece+rankIterative);
            iterateOverRank(board.getSquareAt(fileOfPiece+(rankIterative+1)),board,piece,fileOfPiece,rankOfPiece,rankIterative+1,moveableList,takeableList);
        }

    }

    //rank has hit the edge of the border, stop recursion. 
    else if(rankIterative < 1)
    {
        return;
    }

    //implies that the bounds of the rank search are [1,pieceRank-1], pieces in this range are moveable and takeable. 
    else
    {
        //check if piece intersects with square we are checking, set it to 1 underneath the piece
        if (squareIterated.getFilled())
            {     
                //check if piece is opposing color, add to list if opposition
                if(squareIterated.getPiece().getColor() != piece.getColor())
                {
                    takeableList.push(fileOfPiece+rankIterative)
                }
                return; 
            }
    
            //if the square isn't filled, decrease the rank by one, and add the coord to moveable squares
            else
            {   
                moveableList.push(fileOfPiece+rankIterative);
                iterateOverRank(board.getSquareAt(fileOfPiece+(rankIterative-1)),board,piece,fileOfPiece,rankOfPiece,rankIterative-1,moveableList,takeableList);
            }
    }

}

//Check validity points
function checkValidityPoints(piece,pointList,moveableSquares,takeableSquares)
{   
    for(let i = 0; i<pointList.length;i++)
    {
        let file = pointList[i][0].charCodeAt(0);
        let rank = parseInt(pointList[i][1]);

        //if bounds are valid
        if ((file < 73 && file >64) && (rank>0 && rank <9))
        {   
            let squareIterative  = piece.getBoard().getSquareAt(String.fromCharCode(file)+rank);
        
            if(squareIterative.getFilled())
            {   
                //if the pos is of opposing color, add to takeable. don't do anything otherwise add to takeable
                if(squareIterative.getPiece().getColor()!=piece.getColor())
                {
                    takeableSquares.push(String.fromCharCode(file)+rank);
                }
            }  
            else
            {
                moveableSquares.push(pointList[i]) 
            }

        }
    }
}

//Takes tuple of cartesian coordinates, e.g. (60,60) and converts it to chess coordinates
function convertCartesianChessCoords(cartesianCoords)
{   
    let x = cartesianCoords[0];
    let y = cartesianCoords[1];

    //use hashes to get nums 
    let numeric = mapBoardCharsToNums.get(x);
    let letter = charHashSet.get(y);

    return letter+numeric
}

//Converts x position in cartesian to chess file
function convertCartesianToFile(boardNumber)
{   
    return cartesianToFileMap.get(boardNumber)
}

//Converts Board Character to Number 
function convertFileToCartesian(boardChar)
{
    return mapBoardCharsToNums.get(boardChar)
}

/*
Converts Chess Coordinate, e.g. A1, to Cartesian, A1->(0,0)
*/
function convertBoardPositionCartesian(pair)
{   

    //convert char to an int, get x, get y 
    let x = fileToCartesianMap.get(pair[0]);
    let y = (pair[1]-1)*60;

    return [x,y];
}

export{convertBoardPositionCartesian,convertFileToCartesian,convertCartesianToFile,
    convertCartesianChessCoords,iterateOverRank,iterateOverFile,iterateUpwardRight,iterateDownwardRight,checkValidityPoints,
    convertApproximateCoordsToBoard,pointToColor}