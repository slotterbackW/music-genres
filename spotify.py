# Generate list of artists from songs.txt file
raw_artists = []
with open('./data/songs.txt') as songs_file:
    # Our data is separated by bar characters
    raw_artists = [line.split('|')[2] for line in songs_file]

# List of delimiters to split artist names by
DELIMITERS = ['and', 'with', 'featuring', 'ft.', 'ft', '&', 'X']
from analysis_helpers import multi_split

# Use DELIMITERS to split artist names and grab the first one
artist_names = []
for raw_artist in raw_artists[1:]:
    # We'll consider the first artist who's name appears in the artist field the "primary" artist.
    artist_names.append(multi_split(raw_artist, DELIMITERS)[0])

artist_dict = {name: 0 for name in artist_names}

# Now fetch artists from spotify api
import spotipy
import spotipy.util as util
from secrets import SPOTIFY_API_KEY, SPOTIFY_USERNAME

# Setup API credentials
username = SPOTIFY_USERNAME()
scope = 'user-read-private'
client_id = '6ed1f612bf9a487c9d0f7048115291d3'
redirect_uri = 'http://localhost/'
client_secret = SPOTIFY_API_KEY()
token = util.prompt_for_user_token(username, scope, client_id, client_secret, redirect_uri)

# Create Spotify Client
sp = spotipy.Spotify(auth=token)
# Open file to write results to
f = open('./data/artists.txt', 'w')
# Write header
f.write('Artist|Spotify ID|Genres\n')
# For each artist write the artist's name, SPOTIFY_ID, and Genres
for artist in list(artist_dict.keys()):
    results = sp.search(q='artist:' + artist, type='artist')
    result_items = results['artists']['items']
    id = None
    for items in result_items:
        if items['name'] == artist:
            print(f"Found artist {artist}, Id: {items['id']}, Genres: {items['genres']}")
            f.write(f"{artist}|{items['id']}|{items['genres']}\n")
            break
# Close the file
f.close()
