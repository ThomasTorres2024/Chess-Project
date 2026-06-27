# import chess

# board = chess.Board()

# # Play the moves
# board.push_san("e4")
# board.push_san("e5")
# board.push_san("d4")
# board.push_san("exd4")
# board.push_san("c4")

# print(board)
# print()
# print(board.fen())

# str_1 = "rnbqkbnr/pppp1ppp/8/8/2PpP3/8/PP3PPP/RNBQKBNR b KQkq c3 0 3"
# str_2 = "rnbqkbnr/pppp1ppp/8/8/2PpP3/8/PP3PPP/RNBQKBNR b KQkq c3 0 3"


# all_good = True
# for i in range(len(str_1)):
#     if(str_1[i]!=str_2[i]):
#         print("not equal at " + str(i))
#         all_good=False
#         break 
    
# print(all_good)

import chess
import chess.svg

fen = "r1bqk2Q/1pppnp1p/p1n5/8/2B1P3/8/PPP2PPP/RNB1K2R b KQq - 0 8"

board = chess.Board(fen)

svg = chess.svg.board(board)

with open("board.svg", "w", encoding="utf-8") as f:
    f.write(svg)