# Script to clean the artist names in ./data/songs.txt and match artists to their genres

# We'll need to import a helper function we wrote to cleanup the name of the artist
from analysis_helpers import munge_artist, sample_dict

OUTPUT_PATH = './data/full_songs.txt'

def generate_artist_dict():
    artist_genres = {}
    with open('./data/artist_genres.txt') as artist_genres_file:
        for rawtext in artist_genres_file.readlines():
            row = rawtext.strip().split('|')
            artist_genres[row[0]] = row[1]
    return artist_genres

# Here we import all the song data
with open('./data/songs.txt') as songs_file:
    # Generate dictionary of artists mapped to their genres
    artist_genres = generate_artist_dict()
    # Open output file for writing
    full_songs_file = open(OUTPUT_PATH, 'w')
    # Write our header
    full_songs_file.write('DATE|TITLE|ARTIST|RANK|GENRE\n')
    # Begin reading the songs file
    header = songs_file.readline().strip().split('|')
    for rawtext in songs_file:
        # Our data is seperated by '|' characters
        row = rawtext.strip().split('|')
        # Initialize the value of each row as a variable
        date = row[0]
        song = row[1]
        artist = munge_artist(row[2])
        rank = row[3]
        genre = 'None'
        if artist in artist_genres:
            genre = artist_genres[artist]
        # Remove useless data
        if genre != 'None':
            # And finally, write our data to the file
            full_songs_file.write(f"{date}|{song}|{artist}|{rank}|{genre}\n")
