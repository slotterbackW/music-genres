# Overarching list of buckets where the values are the
# Keywords for each bucket
buckets = {
    'Rock': ['rock', 'surf', 'beach', 'guitar', 'british invasion', 'scottish new wave'],
    'Metal/Punk': ['metal', 'punk', 'screamo'],
    'Christian/Gospel': ['christian', 'gospel'],
    'Country': ['country', 'western', 'nashville'],
    'Dance/Electronic': ['dance', 'electronic', 'trance', 'techno', 'house', 'lo-fi', 'tronica', 'edm'],
    'Holiday': ['christmas'],
    'Latin': ['latin', 'salsa'],
    'Pop': ['pop', 'group'],
    'Pop Standards': ['standards', 'easy', 'cabaret'],
    'Classical': ['classical', 'orchestra'],
    'R&B/Hip-hop': ['rap', 'r&b', 'hip', 'hop'],
    'Jazz & Blues': ['jazz', 'blues', 'doo-wop', 'bluegrass'],
    'Soul': ['motown', 'soul', 'funk', 'disco'],
    'Ska/Reggae/Folk': ['reggae', 'ska', 'folk']
}

# Takes a single genre and returns the classified version
def classify_genre(g):
    for genre_name, genre_list in buckets.items():
        for genre in genre_list:
            if genre in g:
                return genre_name
    return None

# Finds most common overarching genre given a list of subgenres
def most_common_genre(genres):
    # Builds and object mapping genres to their counts
    counts = {}
    for genre in genres:
        if genre == None:
            continue
        if genre in counts:
            counts[genre] += 1
        else:
            counts[genre] = 1
    # Finds the max count and genre
    max = 0
    max_genre = 'None'
    for genre in counts:
        if counts[genre] > max:
            max = counts[genre]
            max_genre = genre

    return max_genre

# Takes a list of genres
# classifies each genre
# returns the most common classified genre
def genres_to_genre(genres):
    classified_genres = [classify_genre(genre) for genre in genres]
    return most_common_genre(classified_genres)

# Write a list of artists and their genres to the file specified in file_path
# input: path to write output to
# output: None returned, but writes to file
def write_artist_genres(file_path):
    with open('./data/artists.txt') as artists_file:
        f = open(file_path, 'w')
        header = artists_file.readline().strip().split('|')
        for line in artists_file:
            stripped_line = line.strip().split('|')
            artist_genre = genres_to_genre(eval(stripped_line[2]))
            f.write(f"{stripped_line[0]}|{artist_genre}\n")
        f.close()
