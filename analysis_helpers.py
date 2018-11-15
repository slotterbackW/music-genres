# Replaces each instance of match in str with new_str
# For example whole_replace("The lazy Fox", 'LAZY', 'smart') returns 'The smart Fox'
# input: string, string, string
# output: string
def whole_replace(str, match, new_str):
    new_word = []
    for word in str.split():
        if word.lower() == match.lower():
            new_word.append(new_str)
        else:
            new_word.append(word)
    return ' '.join(new_word)


# Splits a string based on a series of lowercase delimiters
# input: string to split, list of lowercase delimiters
# output: list of strings split on the given delimiters
def multi_split(str, delimiters):
    # Replaces all delimiters in the given string with the new_delimiter value
    # and then splits based on that value. Works for all strings except ones
    # which contain a '|' character
    new_delimiter = '|'
    new_str = str
    for delimiter in delimiters:
        new_str = whole_replace(new_str, delimiter, new_delimiter)
    return [word.strip() for word in new_str.split(new_delimiter)]

# Takes the name of an artist which may look like "Elvis Presley and the Jordainaires"
# and returns "Elvis Presley"
def munge_artist(raw_artist):
    DELIMITERS = ['and', 'with', 'featuring', 'ft.', 'ft', '&', 'X']
    return multi_split(raw_artist, DELIMITERS)[0]
