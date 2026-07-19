/**
 * Still need to add a checking function, the way this will be done is by recalculating every piece's scope
 * when the round ends for both black and white. 
 * 
 * So in the chessboard object, we will have a moveable squares 
 * Checking function will do a few things
 * -if checked the icon for the pice checked will be in red like on li chess
 * -any time a user's mouse input is processed, we will check for the condition of a check first 
 * and then allow routine game functionality to occur 
 */

//Game coordinator coordinates all of the pieces to visually represent the game and as well represent
//the rules of the game 

import { convertApproximateCoordsToBoard, postChessApi, convertAlgebraicMoveToPieceMoved } from "/board/boardutility.js"
import { BoardGraphicsManager } from "/board/graphics/boardfunctions.js";
import RoundManager from "/board/round/roundmanager.js"
import RoundDisplay from "/round_display/round_display_graphics.js";
//Coordinates interactions between the chess board variable, graphics manager, and round manager 
export default class Coordinator {
    //Sets cals for the chess board, the graphics manager for the board, the round manage,r and the round display manager 
    constructor(chessBoardVar, boardGraphicsManager, roundManager, roundDisplay, stockfishEnabled, tree_var) {
        this.chessBoardVar = chessBoardVar;
        this.boardGraphicsManager = boardGraphicsManager;
        this.roundManager = roundManager;
        this.roundDisplay = roundDisplay;
        this.whiteChecked = false;
        this.blackChecked = false;
        this.whiteCheckMated = false;
        this.blackCheckMated = false;
        this.isDrawnByAgreement = false;
        this.isDrawnByStaleMate = false;
        this.isDrawnByRepetition = false;

        this.white_chance = 50;
        this.black_chance = 50;

        this.algebraic_move_record = [];

        //for pgn
        this.algebraic_string_game = "";
        //for wiki
        this.wikibook_string = "";

        //will store the article parsed here
        this.wikibook_parsed = "";

        this.current_wikibook_link = "";

        this.tree_var = tree_var;

        //for treeant
        this.previous_parent_node = false;

        this.config = {

            container: "#collapsable-tree",
            rootOrientation: "NORTH",
            animateOnInit: true,

            node: {
                collapsable: true
            },
            animation: {
                nodeAnimation: "easeOutBounce",
                nodeSpeed: 700,
                connectorsAnimation: "bounce",
                connectorsSpeed: 700
            }
        };

        //treeant config is a list
        this.treeant_config = [this.config];
        this.treeant_record = new Map();
        this.move_chain_str=[];


        this.stockfishEnabled = stockfishEnabled;
        const stockFishSlider = document.getElementById("stockfish_is_enabled");
        //sometimes need to force eval bar to be taken out 
        if (!this.stockfishEnabled) {
            this.boardGraphicsManager.removeEvaluationBar();

            if (stockFishSlider.checked) {
                stockFishSlider.checked = false;
            }
        }
        else {
            stockFishSlider.checked = true;
        }

    }

    //Processes a move on the board, this function will be called and used extensively in this program.
    /*
    Begins by seeing if there is a check on the board, if there is a check processing is changed, 
    will try to evaluate if the check is a checkmate at first, and if it is not a checkmate, it will allow
    the player to continue the game. By default the checks are false. The modify board function makes calls to the 
    chessboard object, in the move piece function there will be another function to make checks,
    I will also ad a function for the visualization part to ensure a move will not put the player in 
    check 
    */
    processSquareMoveinput(pieceCoord) {

        //get the square, and get the piece that we are either visualizing or want to visualize.
        let square = this.chessBoardVar.getSquareAt(pieceCoord);
        let pieceVisualized = this.boardGraphicsManager.getIsVisualized();


        //Display a victory message at the end for now it'll just be a message in console 
        if (this.blackCheckMated) {
            console.log("White wins.");
            //play checked sound 
            let checkSound = new Audio("/sound/Check.mp3");
            checkSound.play();
        }
        //White victory message 
        else if (this.whiteCheckMated) {
            console.log("Black wins.");
            //play checked sound 
            let checkSound = new Audio("/sound/Check.mp3");
            checkSound.play();
        }

        else if (this.isDrawnByStaleMate) {
            console.log("Drawn by stalemate.");
            //play checked sound 
            let checkSound = new Audio("/sound/Check.mp3");
            checkSound.play();
        }

        else if (this.isDrawnByRepetition) {
            console.log("Drawn by 3 fold repetition");
        }

        else if (this.isDrawnByAgreement) {
            console.log("Drawn by agreement");
        }

        //Return to this part later comment out for now 
        // else if(this.whiteChecked || this.blackChecked)
        // {
        //     console.log("A check has ocurred on: ");
        //     console.log(this.roundManager.getRoundColor());
        // }
        //a piece is already been displayed, check if the coordinate clicked is 
        else if (pieceVisualized && this.boardGraphicsManager.checkIfMoveableOrTakeable(pieceCoord)) {
            const oldSquareCoord = this.boardGraphicsManager.getHighlightedSquare();
            let piece = this.chessBoardVar.getSquareAt(oldSquareCoord).getPiece();
            const newSquareCoord = pieceCoord;
            this.boardGraphicsManager.devisualizePiece();


            let moveSound = new Audio("/sound/Move.mp3");
            moveSound.play();

            //Check if the piece is a king or a pawn, there are unique conditions that need to be met for both of these types
            //if king, check if chosen move is a castle, otherwise the program will default to its normal routine
            if (piece.getType() == "king") {
                let king = piece;

                //Moves the king 
                //if the king hasn't moved check if move was `castle` move 
                if (!king.getMoved() && (newSquareCoord[0] == "G" || newSquareCoord[0] == "C")) {
                    //set rank val
                    let rank = 1;
                    let oldFileRook = "A"
                    let newFileRook = "D";
                    if (king.getColor() == "black") {
                        rank = 8;
                    }

                    if (newSquareCoord[0] == "G") {
                        oldFileRook = "H";
                        newFileRook = "F";
                    }

                    let oldRookSquare = oldFileRook + rank;
                    let newRookSquare = newFileRook + rank;
                    let rook = this.chessBoardVar.getSquareAt(oldRookSquare).getPiece();
                    this.castle(oldSquareCoord, newSquareCoord, oldRookSquare, newRookSquare, king, rook);
                }

                //Moves king if it has not moved before 
                else {
                    this.modifyBoard(oldSquareCoord, newSquareCoord);
                }
            }

            //Check if piece is pawn, try and determine if the piece can do en passant or something 
            else if (piece.getType() == "pawn") {
                let pawnCoords = piece.getBoardSquare();

                let rank = newSquareCoord[1];
                //Check for Promotion
                if (rank == "1" || rank == "8") {
                    this.chessBoardVar.promoPawnToQueen(pawnCoords, newSquareCoord, "queen");
                }

                //if there are squares that can be enPassanted to
                else if (piece.getEnPassantSquares().length > 0 && piece.getEnPassantSquares()[0] == newSquareCoord) {
                    this.chessBoardVar.enPassant(piece);
                }

                //en passant for white 
                this.modifyBoard(pawnCoords, newSquareCoord);

            }

            //Moves piece types which are not kings 
            else {
                //Move Piece
                this.modifyBoard(oldSquareCoord, newSquareCoord);

            }
            // console.log(this.chessBoardVar.toString())
            // console.log(this.roundManager.getCurrentRound())
        }

        //If there is a piece on the square show the user where it can go 
        else if (square.getFilled() && (this.roundManager.getRoundColor() == square.getPiece().getColor())) {
            const piece = square.getPiece();
            //console.log(piece);
            //UNCOMMENT FOR NORMAL FUNCTIONALITY 
            //piece.defineMoveableAndHittableSquares();
            this.boardGraphicsManager.visualizePieceScope(piece);
        }
    }

    //Standard move occurs on the board, takes piece's old square and new square and changes it 
    //The checking portion is done inside of the chessboard class, and is called when we move a piece,
    //once it is done executing we update the black and white checked variables
    modifyBoard(oldSquareCoord, newSquareCoord) {

        let pieceTaken = false;
        let pawnMoved = false;

        //determine if a piece exists on new square coord and if it was taken 
        if (this.chessBoardVar.getSquareAt(newSquareCoord).getPiece()) {
            this.chessBoardVar.getSquareAt(newSquareCoord).getPiece()
            pieceTaken = true;
        }
        else if (this.chessBoardVar.getSquareAt(oldSquareCoord).getPiece().getType() == "pawn") {
            pawnMoved = true;
        }

        this.chessBoardVar.movePiece(oldSquareCoord, newSquareCoord);


        //determine if black or white is checked after this move
        this.roundManager.addToRounds(oldSquareCoord, newSquareCoord, this.chessBoardVar.getSquareAt(newSquareCoord), pieceTaken);
        const move = this.roundManager.getCurrentRound();

        //COMMENT OUT FOR NORMAL FUNCTIONALITY
        //update what moves can be made for the next player and check status 
        let roundColor = this.chessBoardVar.getSquareAt(newSquareCoord).getPiece().getColor();
        this.chessBoardVar.postRound(roundColor);

        this.blackChecked = this.chessBoardVar.getBlackKingChecked();
        this.blackCheckMated = this.chessBoardVar.getBlackCheckMated();
        this.whiteCheckMated = this.chessBoardVar.getWhiteCheckMated();
        this.whiteChecked = this.chessBoardVar.getWhiteKingChecked();
        this.isDrawnByStaleMate = this.chessBoardVar.getStalemate();

        //check if the piece on the new square is a pawn. if it was a pawn move or a capture.
        //if either ocurred, then for FEN, the half round counter needs to be set to 0, otherwise increment 
        if (pawnMoved || pieceTaken) {
            this.chessBoardVar.setHalfRound(0);
        }
        else {
            this.chessBoardVar.incrementHalfRound();
        }

        //Display the check if the pieces are checkmates 
        if (this.blackChecked) {
            console.log("Black checked.");
            this.boardGraphicsManager.highlightCheckedPiece(this.chessBoardVar.getBlackKing());
            let checkSound = new Audio("/sound/Check.mp3");

            move.setBlackKingChecked(true);

            checkSound.play();

        }
        else if (this.whiteChecked) {
            console.log("White checked.");
            this.boardGraphicsManager.highlightCheckedPiece(this.chessBoardVar.getWhiteKing());
            let checkSound = new Audio("/sound/Check.mp3");

            move.setWhiteKingChecked(true);

            checkSound.play();
        }

        //Game Ending State Functions and continue game part
        if (this.isDrawnByStaleMate) {

            move.setDrawn(true);

            console.log("Game over by stalemate.")
        }
        else if (this.blackCheckMated) {
            move.setBlackKingCheckMated(true);
            console.log("Game over by black being checkmated")
        }
        else if (this.whiteCheckMated) {
            console.log(move)
            console.log(typeof (move))
            move.setWhiteKingCheckMated(true);

            console.log("Game over by white being checkmated")
        }

        //Continue Game 
        else {

            //Undo any checks on pieces if they are no longer checked  
            if (!this.blackChecked) {
                this.boardGraphicsManager.dehighlightCheckedPiece(this.chessBoardVar.getBlackKing());
            }
            else if (!this.whiteChecked) {
                this.boardGraphicsManager.dehighlightCheckedPiece(this.chessBoardVar.getWhiteKing());
            }
        }

        //adds the move just made to the board, where move is the move string and the round manager is a color corresponding to the color
        this.roundDisplay.addMoveStringDisplay(move, this.roundManager.getRoundColor())

        //update fen string     
        if (this.roundManager.getCurrentRound()) {
            this.chessBoardVar.update_fen_board_state();
        }


        //if stockfish is enabled, get corresponding info and update game panel with it 
        if (this.stockfishEnabled) {
            this.update_stockfish();
        }

        //at the end update the algebraic move record for wikibook
        this.algebraic_move_record.push(move.getMoveAlgebraic());

        //update algebraic string and feed to wikibook updater 
        this.parse_wikibook(move);
        this.update_wikibook(this.wikibook_string, move);
        this.update_pgn_string(move);

        //updates pgn and fen 
        this.boardGraphicsManager.update_pgn_display(this.algebraic_string_game);
        this.boardGraphicsManager.update_fen_display(this.chessBoardVar.getBoardFEN());

    }

    /**
     * When the user makes a move, updates the treeant config to show the best next moves the user can make, and what they are called 
     */
    getTreeantConfigForMove(list_moves, move, move_title) {

        //update info for this round 
        console.log(list_moves)
        let parent_node;

        const move_alg = move.getMoveAlgebraic();
        const move_color = move.getPiece().getColor();

        if (this.previous_parent_node) {
            let move_as_alg = move.getMoveAlgebraic();
            let alg_route = this.algebraic_string_game;

            console.log(alg_route)
            console.log(this.treeant_record)

            parent_node = this.treeant_record.get(this.algebraic_string_game);
            parent_node['children'] = [];
        }
        //if treeant has yet to declare a parent node 
        else {
            parent_node = {
                text: { name: move.getMoveAlgebraic() },
                color:"#FFFFFF",
                children: []
            };
            this.treeant_config.push(parent_node);
            this.previous_parent_node = true;
        }

        //const parent_move_img = convertAlgebraicMoveToPieceMoved(move_alg, move.getPiece().getColor());


        //create nodes for hypothetical moves
        for (let i = 0; i < list_moves.length; i++) {
            let split = list_moves[i].split("-");

            //sometimes wikibook uses "·" to divide entries 
            if (split.length <= 1) {
                let re_split = list_moves[i].split("·");
                if (re_split.length > 1) {
                    split = re_split;
                }
            }

            //get corresponding image, parse based on color of the move

            let new_node = {
                text: { name: list_moves[i], color:"#FFFFFF" },
            }
            parent_node['children'].push(new_node)


            let move_as_alg;
            let alg_route = this.algebraic_string_game;
            let piece_moved;

            //process text part and image according to color 
            if (move_color == "white") {
                move_as_alg = (split[0].slice(4, split[0].length));
                alg_route = alg_route + " " + move_as_alg;
                piece_moved = convertAlgebraicMoveToPieceMoved(move_as_alg, "black");
            }
            else {
                move_as_alg = (split[0].slice(3, split[0].length - 1));
                alg_route = alg_route + String(move.getCount() + 1) + ". " + move_as_alg;
                piece_moved = convertAlgebraicMoveToPieceMoved(move_as_alg, "white");
            }

            this.treeant_record.set(alg_route, new_node);
            new_node['text'] = { name: move_as_alg }
            this.treeant_config.push(new_node);
        }

        // console.log(this.treeant_config)
        console.log(parent_node)
        //update tree 
        this.tree = new Treant(this.treeant_config);

    }

    /**
     * Updates stirng for PGN in object
     * @param {Updates wikibook string} move 
     */
    update_pgn_string(move) {

        let round_move = move.getMoveAlgebraic();

        if (move.getPiece().getColor() == "white") {
            round_move = String(move.getCount()) + ". " + round_move;
        }
        else {
            round_move = " " + round_move + " ";
        }

        this.algebraic_string_game += round_move;
    }

    /**
     * Updates wikibook stirng in object and also makes new config for treeant 
     * @param {Updates wikibook string} move 
     */
    parse_wikibook(move) {

        let round_move = "/" + String(move.getCount());

        if (move.getPiece().getColor() == "white") {
            round_move += "._";
        } else {
            round_move += "...";
        }
        round_move += move.getMoveAlgebraic();
        this.wikibook_string += round_move;
    }

    /**
     * Updates wikibook display 
     */
    async update_wikibook(algebraic_sequence_moves, move) {

        const endpoint = "https://en.wikibooks.org/w/api.php";

        const page_name = "Chess_Opening_Theory" + algebraic_sequence_moves;
        //console.log(page_name)

        const params = new URLSearchParams({
            action: "parse",     // Specify the action to perform
            page: page_name,
            format: "json",      // Request the response in JSON format
            origin: "*"          // Crucial: Solves CORS errors for browser requests
        });

        const url = `${endpoint}?${params.toString()}`;

        const response = await fetch(url, {
            method: "GET",
        });

        const response_json = await response.json();


        //if read was fine then we can parse the output 
        if (response_json.parse) {

            const page_info = response_json.parse.text['*'];

            //set all info to this 
            this.wikibook_parsed = page_info;

            const hyperlink_url = "https://en.wikibooks.org/wiki/" + page_name;

            const specifiedDataType = "text/html";
            let parsedPageAsDocument = new DOMParser().parseFromString(page_info, specifiedDataType);

            let all_p_tags = parsedPageAsDocument.getElementsByTagName("p");

            let n = 10;
            let top_n_paragraphs = []
            //first entry is always FEN of position, want to avoid actively
            for (let i = 1; i < Math.min(n + 1, all_p_tags.length); i++) {
                top_n_paragraphs.push(all_p_tags[i].textContent+"\n");
            }

            console.log(top_n_paragraphs)

            //need to get header tag also 
            let header_text = parsedPageAsDocument.getElementsByTagName("h2")[0].textContent;

            //feed into graphics manager
            if (top_n_paragraphs.length > 0) {
                this.boardGraphicsManager.addTextToWikiBoard(top_n_paragraphs, header_text);
            }

            //update treenat now 
            let all_tr_tags = parsedPageAsDocument.getElementsByTagName("tr");

            //find responses set 
            let li_texts = [];
            const find_common_responses_str = "Responses:";
            for (let i = 0; i < 10; i++) {
                // console.log(all_tr_tags[i].outerHTML)

                //try to look for <tr> tag where the first child tag is <b>Responses</b>
                let curr_child = all_tr_tags[i].children;

                if (curr_child['0'].firstChild && curr_child['0'].firstChild.outerText == find_common_responses_str) {

                    //get list of all ul tags 
                    // console.log(curr_child['0'].outerHTML);
                    let parsedPageAsDocument = new DOMParser().parseFromString(curr_child['0'].outerHTML, specifiedDataType);

                    let found_li_items = parsedPageAsDocument.getElementsByTagName("li");

                    for (let j = 0; j < found_li_items.length; j++) {
                        li_texts.push(found_li_items[j].innerText);
                    }

                    //extract raw text from elements 
                    break;
                }
            }
            this.getTreeantConfigForMove(li_texts, move, header_text);
            //update treenant now 


        } else {
            //put message into graphics manager telling it it's okay     
            this.boardGraphicsManager.addTextToWikiBoard(["Out of theory, no moves found for this sequence."]);
        }


    }

    /**
     * Updates stockfish with corresponding info from the position
     */
    update_stockfish() {

        //if game hasn't progressed past a single move
        if (!this.roundManager.getCurrentRound()) {
            this.boardGraphicsManager.modifyEvaluationBar(50, 50);
        }
        else {
            let gameFen = "";
            try {

                //if no move made, just put board to default display


                gameFen = this.chessBoardVar.getBoardFEN()

                postChessApi({ fen: gameFen }).then((data) => {
                    this.white_chance = data.winChance;
                    this.black_chance = 100 - this.white_chance;

                    this.boardGraphicsManager.modifyEvaluationBar(this.white_chance, this.black_chance);

                    //draw top moves in position 
                    let next_move = data.continuationArr[0];
                    console.log(next_move)

                });

            } catch (error) {
                // Code to handle the error
                console.error("An error occurred:", error.message);
                console.log("Board FEN: ")
                console.log(gameFen);
                console.log(data)
            }
        }


    }

    //Castles, performs a castle, adds castle info to the round, and add to display
    castle(oldSquareCoord, newSquareCoord, oldRookSquare, newRookSquare, king, rook) {

        //change board contents 
        this.chessBoardVar.castle(oldSquareCoord, newSquareCoord, oldRookSquare, newRookSquare, king.getImageName(), rook.getImageName());

        //set king moved and castle round 
        king.setMoved(true);
        rook.setMoved(true);
        this.roundManager.addCastle(oldSquareCoord, newSquareCoord, oldRookSquare, newRookSquare, king, rook);
        this.roundDisplay.addMoveStringDisplay(this.roundManager.getCurrentRound(), this.roundManager.getCurrentRound().getTurnColor());
    }

    /**
     * Toggles stockfish off 
     */
    toggleStockFish() {
        if (this.stockfishEnabled) {
            this.stockfishEnabled = false;

            //update sidebar to show odds 
            this.boardGraphicsManager.removeEvaluationBar();

        }
        else {
            this.stockfishEnabled = true;

            //enable sidebar 
            this.update_stockfish();
        }

        console.log("Stockfish set to: " + this.stockfishEnabled)
    }
    //Performs En Passant 
    enPassant(pawnOldSquare, pawnNewSquare, opposingPawnNewSquare) {

    }

    //Reverses the events of the previous round on the board 
    reverseRound() {

    }

    //Advanced a round if the displayed round on the board is behind the current round 
    advanceRound() {

    }
}