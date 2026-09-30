import re

def normalize_text(text: str) -> str:
    """Normalize text by lowercasing, trimming, and stripping honorifics."""
    if not text:
        return ""
    text = text.lower()
    # Strip common Indian honorifics
    honorifics = [r'\bshri\b', r'\bshree\b', r'\bsmt\b', r'\bdr\b', r'\blate\b', r'\bmr\b', r'\bmrs\b']
    for h in honorifics:
        text = re.sub(h, '', text)
    # Remove punctuation
    text = re.sub(r'[^a-z0-9\s]', ' ', text)
    return ' '.join(text.split())

def levenshtein_distance(s1: str, s2: str) -> int:
    """Compute classic Levenshtein edit distance."""
    if len(s1) < len(s2):
        return levenshtein_distance(s2, s1)
    if len(s2) == 0:
        return len(s1)

    previous_row = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row

    return previous_row[-1]

def string_similarity_ratio(str1: str, str2: str) -> float:
    """Calculate similarity ratio between 0.0 and 1.0."""
    n1 = normalize_text(str1)
    n2 = normalize_text(str2)
    if not n1 and not n2:
        return 1.0
    if not n1 or not n2:
        return 0.0
    if n1 == n2:
        return 1.0

    max_len = max(len(n1), len(n2))
    dist = levenshtein_distance(n1, n2)
    return round(1.0 - (dist / max_len), 4)

def soundex_token(word: str) -> str:
    """Calculate soundex code for phonetic matching."""
    if not word:
        return ""
    word = word.upper()
    codes = {
        'B': '1', 'F': '1', 'P': '1', 'V': '1',
        'C': '2', 'G': '2', 'J': '2', 'K': '2', 'Q': '2', 'S': '2', 'X': '2', 'Z': '2',
        'D': '3', 'T': '3',
        'L': '4',
        'M': '5', 'N': '5',
        'R': '6'
    }
    first_char = word[0]
    encoded = [first_char]
    prev_code = codes.get(first_char, '')

    for char in word[1:]:
        code = codes.get(char, '')
        if code and code != prev_code:
            encoded.append(code)
        prev_code = code

    result = ''.join(encoded) + '0000'
    return result[:4]

def are_phonetically_similar(name1: str, name2: str) -> bool:
    """Check if primary name tokens sound identical or similar."""
    tokens1 = [t for t in normalize_text(name1).split() if len(t) > 1]
    tokens2 = [t for t in normalize_text(name2).split() if len(t) > 1]
    if not tokens1 or not tokens2:
        return False
    soundex1 = [soundex_token(t) for t in tokens1]
    soundex2 = [soundex_token(t) for t in tokens2]
    # Check intersection
    common = set(soundex1).intersection(set(soundex2))
    return len(common) > 0
