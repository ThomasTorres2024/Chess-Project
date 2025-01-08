export default class RoundDisplay{
    constructor(roundManager)
    {
        this.roundManager=roundManager;
        this.roundDisplayDocName = "";
        this.roundIndex = 0; 
        this.round_string_white_part = "";
        this.round_string_black_part = "";
        this.round_string = "";
    }

    //Adds a string according to the syntax template provided, and appears as such:
    /*
        <div id = "move">
          <li>
            <h4>index</li>
          </li>k
          <li>
            <h4>white move</h4>
          </li>
          <li>
            <h4>black move</h4>
          </li>
        </div>
    */
    addMoveStringDisplay(movePart, moveColor)
    {   

      //this round changer changes the round to the opposite color immediately after moving, so this takes this fact
      //into account, so the true color is just the other color 
      let moveIsWhite = true;
      if(moveColor == "white")
      {
        moveIsWhite = false;
      }

      const roundDocName = "round_record";
        
        //increment round index if the move is white, since any white move will take place at the start 
        if(moveIsWhite)
        {
            this.roundIndex+=1;
            const roundRecordDoc = document.getElementById(roundDocName);

            //create under last ul element, and set its ID
            const newUlID = "move_"+this.roundIndex;
            const lastUL = document.createElement("ul")
            lastUL.id = newUlID;

            //add another node since this white, where we are going to add the digit at the start, 
            const numberHeading = document.createElement("h4");
            let numberText = document.createTextNode(this.roundIndex+".");

            //const lastUL = document.createElement(`ul id = "${newUlID}"`);
            //create heading, append text to it with the move part 
            let headingPart = document.createElement("h4");
            let moveText = document.createTextNode(movePart);

            //node to weigh down the right side 
            let weightNode = document.createElement("h4");
            let weightText = document.createTextNode("");

            //apending hierarchy
            //append text elements first to their respective nodes
            numberHeading.append(numberText);
            headingPart.append(moveText);
            weightNode.append(weightText);

            //white move node 
            lastUL.append(numberHeading);
            lastUL.append(headingPart);
            lastUL.append(weightNode);

            roundRecordDoc.append(lastUL);


            //add the index and the round string part to the doc respectively
        }
        else
        {
            //create under last ul elemeent, we don't have to update and create a new ul element because when black moves we don't need to make a new entry

            const lastUL = document.getElementById("move_"+this.roundIndex);    

            //create heading, append text to it with the move part 
            let headingPart = document.createElement("h4");
            let moveText = document.createTextNode(movePart);
            headingPart.append(moveText)

            //add heading to doc the last UL
            lastUL.append(headingPart);
        }
    }

    //Adds the current move to the display, use this function ONLY for when the user makes a move, for a function to import all of the moves
    //there is a setting for a bulk update 
    addCurrentMove()
    {   
        let current_round = this.roundManager.getCurrentRound();
        let current_move_syntax = this.current_round.toString();
        //Determine if black or white move 

        //suppose that the color is white 
        let colorIsWhite = true;
        if(this.roundManager.getRoundColor() == "black")
        {
            colorIsWhite = false; 
        }

        //adds string display to site 
        addMoveStringDisplay(current_round,current_move_syntax);
    }
}