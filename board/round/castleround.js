import Round from "/board/round/roundclass.js";
import RoundManager from "/board/round/roundmanager.js";

export default class CastleRound extends Round
{   
    
    
    constructor(previousRound, kingOldSquare,kingNewSquare, king, rookOldSquare, rookNewSquare, rook, board,count,turnColor)
    {   
        //Call super, declared values using king  
        // super(previousRound,null,null,null,board,count,turnColor,king);

        //new call to super 
        super(previousRound, kingOldSquare, kingNewSquare, board, count, turnColor, king, false)


        this.kingSide = false;
        if(kingNewSquare[0]=="G")
        {
            this.kingSide = true;
        }
        this.kingSwap = new Round(previousRound, kingOldSquare,kingNewSquare, board,count,turnColor,king);
        this.rookSwap = new Round(previousRound, kingOldSquare,kingNewSquare, board,count,turnColor,king);

    }

    //Returns if the castle was king side 
    getIsKingSide()
    {
        return this.kingSide;
    }

    //Returns the rook swap round 
    getRookSwap()
    {
        return this.rookSwap;
    }

    //Returns the king swap round
    getKingSwap()
    {
        return this.kingSwap;
    }

    //Since this is a castle class, will always return that it is castled 
    getIsCastled()
    {
        return true;
    }

    /**
     * Move notation acceptable for the round display, pseudo-algebraic
     * @returns move notation for the round 
     */
    toString()
    {
        let out = "O-O-O";
        if(this.kingSide)
        {
            out = "O-O"
        }
        return out;
    }

    /**
     * Overload method for the algebraic string for a castle, adds a check and 
     * checkmate symbol if needed
     * @returns algebraic representation of the move the user made 
     */
    getMoveAlgebraic(){
        let round_string=this.toString();

        if(this.blackCheckMated || this.whiteCheckmated ){
            round_string+="#";
        }
        else if(this.blackChecked || this.whiteChecked){
            round_string+="+";
        }

        return round_string;
    }
}
