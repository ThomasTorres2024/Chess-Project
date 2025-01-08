//Basically used as an intermediary between python code, will tell an object in python to go to a site and
//fetch some moves, has a record to of all of the rounds and parts needed to format them.
//Represents a data object 

export default class WikiBookOpeningInfo
{
    //Constructor 
    cosntructor()
    {   
        //The move sequence map corresponding to the move number, an integer, to a MoveInfoData object  
        this.moveSequenceHashMap = new Map();
    }

    //Generates info for the round and adds it to the hashmap Corresponding to the round 
    add_move(listOfMoves, moveIndex)
    {
        //Process moves using the python script 

        //Take python data and put it into a wikipedia info data object 

        //Add the object to the dict 
    }

    //Takes the round number as input and returns a MoveInfoData object as output
    get_info_at_move(roundNumber)
    {
        return this.moveSequenceHashMap(roundNumber);
    }


}