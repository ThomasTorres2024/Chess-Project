export default class RoundDisplay {
  constructor(roundManager) {
    this.roundManager = roundManager;
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
  addMoveStringDisplay(movePart, moveColor) {

    //this round changer changes the round to the opposite color immediately after moving, so this takes this fact
    //into account, so the true color is just the other color 
    let moveIsWhite = true;
    if (moveColor == "white") {
      moveIsWhite = false;
    }

    const roundDocName = "round_record";

    //increment round index if the move is white, since any white move will take place at the start 


    if (moveIsWhite) {
      this.roundIndex += 1;
      const roundRecordDoc = document.getElementById(roundDocName);

      //new part 
      const row_id = "move_" + this.roundIndex;
      const last_row_id = document.createElement("div")
      last_row_id.id = row_id;
      last_row_id.classList.add("round_record_container")

      //add the new round container
      const numberDiv = document.createElement("div");
      numberDiv.classList.add("round_content", "round_content_numeric");
      numberDiv.id=row_id+"_numeric";

      const whiteDiv = document.createElement("div");
      whiteDiv.classList.add("round_content", "is_active_round");
      whiteDiv.id=row_id+"_white";

      const blackDiv = document.createElement("div");
      blackDiv.classList.add("round_content");
      blackDiv.id=row_id+"_black";

      //configure number 
      let numberText1 = document.createTextNode(this.roundIndex + ".");
      numberDiv.append(numberText1);

      let whiteText = document.createTextNode(movePart);
      whiteDiv.append(whiteText);

      //put in new divs 
      last_row_id.append(numberDiv);
      last_row_id.append(whiteDiv);
      
      last_row_id.append(blackDiv);

      roundRecordDoc.append(last_row_id)

      //add the index and the round string part to the doc respectively
    }
    else {
      //create under last ul elemeent, we don't have to update and create a new ul element because when black moves we don't need to make a new entry

      //update white node to no longer include the round update color 
      const whiteNode=document.getElementById("move_"+this.roundIndex+"_white");
      whiteNode.classList.remove("is_active_round")

      //update black node to have the color and also move text 
      const blackNode = document.getElementById("move_" + this.roundIndex + "_black");
      blackNode.classList.add("is_active_round")
      let black_text = document.createTextNode(movePart);
      blackNode.append(black_text)


      //create heading, append text to it with the move part 
      // let headingPart = document.createElement("h4");
      // let moveText = document.createTextNode(movePart);
      // headingPart.append(moveText)

      // //add heading to doc the last UL
      // lastUL.append(headingPart);
    }
  }

  //Adds the current move to the display, use this function ONLY for when the user makes a move, for a function to import all of the moves
  //there is a setting for a bulk update 
  addCurrentMove() {
    let current_round = this.roundManager.getCurrentRound();
    let current_move_syntax = this.current_round.toString();
    //Determine if black or white move 

    //suppose that the color is white 
    let colorIsWhite = true;
    if (this.roundManager.getRoundColor() == "black") {
      colorIsWhite = false;
    }

    //adds string display to site 
    addMoveStringDisplay(current_round, current_move_syntax);
  }
}