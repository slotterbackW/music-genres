# Script to fetch artist genres from Spotify API and write them to './../data/artists.txt'
OUTPUT_PATH = './data/artists.txt'

# Grab all artists from songs.txt file
raw_artists = []
with open('./data/songs.txt') as songs_file:
    # Our data is separated by bar characters and artists are in column 2 (0-based)
    raw_artists = [line.split('|')[2] for line in songs_file]

# The artist data is not in perfect shape yet
# Many of the data points look like "Artist 1 ft. Artist 2"
# So we need to split those based on a set of delimiters
DELIMITERS = ['and', 'with', 'featuring', 'ft.', 'ft', '&', 'X']
# .split() only takes one argument, so we wrote our own "multi_split" function
# which splits a string based on a list of delimiters
from analysis_helpers import multi_split

# Now we'll use the delimiters to split artist names and grab the first one
# We also want to remove duplicates so we'll use a dictionary to store the results
artists = {}
for raw_artist in raw_artists[1:]:
    # We don't care about the value so we just use 0
    artists[multi_split(raw_artist, DELIMITERS)[0]] = 0

# Once we have the list of artists we'll want to fetch their genre(s) from the Spotify API
import spotipy
import spotipy.util as util
# We need some secrets to authenticate against the API
from secrets import SPOTIFY_API_KEY, SPOTIFY_USERNAME

# Setup API authentication credentials
username = SPOTIFY_USERNAME()
scope = 'user-read-private'
client_id = '6ed1f612bf9a487c9d0f7048115291d3'
redirect_uri = 'http://localhost/'
client_secret = SPOTIFY_API_KEY()
token = util.prompt_for_user_token(username, scope, client_id, client_secret, redirect_uri)

# Create Spotify Client
sp = spotipy.Spotify(auth=token)
# Open file to write results to
# BE CAREFUL. THIS WILL OVERWRITE THE FILE IF IT ALREADY EXISTS.
f = open(OUTPUT_PATH, 'w')
# Write data file header
f.write('Artist|Spotify ID|Genres\n')
# For each artist write the artist's name, SPOTIFY_ID, and Genres to the output file
for artist in list(artists.keys()):
    results = sp.search(q='artist:' + artist, type='artist')
    result_items = results['artists']['items']
    id = None
    for items in result_items:
        if items['name'] == artist:
            print(f"Found artist {artist}, Id: {items['id']}, Genres: {items['genres']}")
            f.write(f"{artist}|{items['id']}|{items['genres']}\n")
            break
# Done! Close the file.
f.close()
