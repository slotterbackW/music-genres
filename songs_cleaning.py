# Script to clean the artist names in ./data/songs.txt to match those in
# ./data/Artists

# Here we import all the song data and clean it a bit
with open('./data/songs.txt') as original_songs:
    songs_data = [song.strip().split('|') for song in original_songs.readlines()]
    header = songs_data[0]
    songs_data = songs_data[1:]

# We need to import a custom modules
from analysis_helpers import munge_artist

# And use that module to our advantage
for song in songs_data:
    song[2] = munge_artist(song[2])

# Now we need to write the munged song data to a new file
with open('./data/cleaned_songs.txt', 'w') as new_songs:
    header = '|'.join(header)
    new_songs.write(header + '\n')

    for song in songs_data:
        song = '|'.join(song)
        new_songs.write(song + '\n')

# Wow, that was easy. We're already done!
