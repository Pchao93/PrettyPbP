
import urllib2
from bs4 import BeautifulSoup
import csv
import io
page = urllib2.urlopen(
		'https://stats.nba.com/events/?flag=1&GameID=0021700833&GameEventID=4&Season=2017-18&sct=plot'
	)
soup = BeautifulSoup(page, "html.parser")

file = io.open("result.txt" , "w+", encoding='utf8') # Creates a new .txt file


video = soup.select('#statsPlayer_embed_statsPlayer')
soup = soup.prettify()
file.write(soup)            #find all the image tags, and iterate through them

file.close()        #close the file 
