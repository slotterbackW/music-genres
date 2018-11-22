# Script to clean the artist names in ./data/songs.txt to match those in
# ./data/Artists

with open('./data/songs.txt') as original_songs:
    songs_data = [song.strip().split('|') for song in original_songs.readlines()]
    header = songs_data[0]
    songs_data = songs_data[1:]

from analysis_helpers import munge_artist

for song in songs_data:
    song[2] = munge_artist(song[2])

# print(songs_data[0:10])

with open('./data/cleaned_songs.txt', 'w') as new_songs:
    header = '|'.join(header)
    new_songs.write(header + '\n')

    for song in songs_data:
        song = '|'.join(song)
        new_songs.write(song + '\n')
