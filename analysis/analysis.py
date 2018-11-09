# Analysis goes here

# Splits a string based on a series of delimiters
# input: string to split, list of delimiters
# output: list of strings split on the given delimiters
def multi_split(str, delimiters):
    # Replaces all delimiters in the given string with the new_delimiter value
    # and then splits based on that value. Works for all strings except ones
    # which contain a '|' character
    new_delimiter = '|'
    new_str = str
    for delimiter in delimiters:
        new_str.replace(delimiter, new_delimiter)
    return new_str.split(new_delimiter)
