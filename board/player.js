export default class Player
{   

    //Sets up a player object by initializing their color and the amount of time they have
    //Sets up a reference to the chessboard, and to the types of piece s, gets User object as well, 
    //loads their picture name and elo 
    constructor(isWhite, isAnalysis, userID, piecesOnBoard)
    {   
        //Set color 
        if(isWhite)
        {
            this.setColor("white")
        }
        else
        {
            this.setColor("black")
        }

        //set other vars 

        //sets pieces on chessboard as a list
        this.piecesOnBoard = piecesOnBoard; 
        this.userID = userID; 
        this.isAnalysis = isAnalysis;   
    }

    //Setters 
    setTime(newTime)
    {
        this.timeEpochSeconds=newTime;
    }

    //Sets the user's pieces
    setPieces(newPieces)
    {
        this.piecesOnBoard = newPieces; 
    }

    //Sets the player's color 
    setColor(colorName)
    {
        this.color = colorName;
    }   

    //Sets epoch seconds if the game is not analysis
    setEpochSeconds(epochSeconds)
    {
        if(!this.isAnalysis)
        {
            this.epochSeconds = epochSeconds;
        }
    }

    //Getters 

    //Gets the players color
    getColor()
    {
        return this.color;
    }

    //Returns the list of pieces on the board 
    getPieces()
    {
        return this.piecesOnBoard;
    }

    //Gets if the players are in analysis game 
    getIsAnalysis()
    {
        return this.isAnalysis;
    }


}