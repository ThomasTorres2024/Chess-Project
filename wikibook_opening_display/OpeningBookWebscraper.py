"""Gets information from wikipedia
takes sequence of moves as string 
feeds moves into wikipedia
after about 20 moves into the game stop pinging wikipedia
"""
import requests 
from bs4 import BeautifulSoup

"""Takes in a list of tuples of strings as input and outputs its raw HTML data"""
class WikiBookScraper:

    # the threshold value for pinging wikipedia's site 
    max_iteration : int 

    #the root url that precedes every single link 
    ROOT_URL : str 

    #The number of moves we are allowed to look through until we outright ignore requests to look for moves with some sequence 


    def __init__(self, max_iteration : int):
        self.max_iteration = max_iteration
        self.counter = 0 
        self.ROOT_URL : str = "https://en.wikibooks.org/wiki/Chess_Opening_Theory/"

    """Formats a move sequence into an acceptable form for wikibooks.
    Formatting for the URL uses standard algebraic chess notation with some addtional characters, depending
    upon the move in question. For instance take the moves:
    1._e4/1...e5/2._Nf3/2...Nc6  
    """
    def format_move_sequence(self, move_sequence_list : list[tuple[str,str]]) -> str:

        unique_url_str_part : str = ""

        #Processes a white and a black move at the same time, first needs to check that the lenght of the 
        #tuple is greater than one, and then process, 
        for i in range(len(move_sequence_list)):
            
            #the white move can be processed independently since every tuple at minimu =m has the white part 
            white_move : str = f"{i+1}._{move_sequence_list[i][0]}"
            unique_url_str_part+=white_move
            #typical processing assuming the move has been plaeyd out properly
            if len(move_sequence_list[i]) == 2:
                black_move : str = f"/{i+1}...{move_sequence_list[i][1]}"
                unique_url_str_part+=black_move
            
            #Check if this is the last tuple or not to add a slash at the end of the string 
            if len(move_sequence_list) != i+1:
                unique_url_str_part+="/"
        
        print(f"Processing: {unique_url_str_part}")
        return unique_url_str_part

    """Processes a list of strings which constitutes the move order sequence"""
    def process_move_sequence(self, move_sequence : list[str]):
        pass 

    """
    Uses Wikipedia's Wikipedia-APi for python to look for an appropriate stirng, if there isn't any such string, then a value of None is returned,
    otherwise returns the string.

    We can only make a call to the site less than max iteration times, also account for when the site doesn't have anything on it 
    """
    def get_wiki_info(self, list_moves : list[tuple[str,str]]) -> str:

        out_text : str = None 

        #check if the counter is within bounds of what is allowed to access the wikibooks site
        if self.counter<self.max_iteration:

            site_str : str = self.format_move_sequence(list_moves)
            SITE_URL : str = self.ROOT_URL + site_str

            #for now just access the site and return its HTML raw 
            raw_wiki_site_data = requests.get(SITE_URL)
            status_code : int = raw_wiki_site_data.status_code
            
            #check that the request was succesful
            if int(status_code) == 200:

                processed_data : BeautifulSoup = BeautifulSoup(raw_wiki_site_data.text)

                all_div = processed_data.find_all("div")
                data_acceptable : bool = True 
                
                #go through all divs now and check if they give bad data
                for div in all_div:
                    if div.get("class") == "noarticletext mw-content-ltr":

                        data_acceptable = False 
                        #prohibit further iterations
                        self.counter = self.max_iteration
                        break

                #if the data is good, meaning we don't have an invalid site, then we can set out_text to
                if (data_acceptable):
                    out_text= raw_wiki_site_data.text

        return out_text  

"""Just a simple test function"""
def test_func():
    newWikiBookScraper = WikiBookScraper(10)

    s =newWikiBookScraper.get_wiki_info([("e4","e5"),("Nf3",)])
    input("continue")
    print(s)