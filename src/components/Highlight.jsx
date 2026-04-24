// Manual break points for long words that overflow narrow schedule columns
const WORD_BREAKS = {
  'Interplanetary': ['Inter', 'planetary'],
  'Klangkuenstler': ['Klang', 'kuenstler'],
  'Chainsmokers':   ['Chain', 'smokers'],
  'Massimiliano':   ['Massi', 'miliano'],
  'Toneshifterz':   ['Tone', 'shifterz'],
  'Superstrings':   ['Super', 'strings'],
  'Nightstalker':   ['Night', 'stalker'],
  'Viperactive':    ['Viper', 'active'],
  'Baugruppe90':    ['Bau', 'gruppe90'],
  'Subtronics':     ['Sub', 'tronics'],
};

// Insert <wbr> at preferred break points: after "b2b", before "(", and within long words
function addBreakHints(text) {
  // Split on b2b/b3b patterns and opening parens
  const parts = text.split(/(b[23]b\s+|(?<=\s)\()/i);
  const result = [];

  parts.forEach((part, i) => {
    if (i > 0 && part.startsWith('(')) {
      result.push(<wbr key={`wbr-${i}`} />);
    }

    // Split this segment's words to check for long-word breaks
    const words = part.split(/(\s+)/);
    words.forEach((word, j) => {
      if (WORD_BREAKS[word]) {
        const segs = WORD_BREAKS[word];
        result.push(segs.join('\u00AD'));
      } else {
        result.push(word);
      }
    });

    if (i > 0 && /b[23]b\s+$/i.test(part)) {
      result.push(<wbr key={`wbr2-${i}`} />);
    }
  });

  return result.length === 1 && typeof result[0] === 'string' ? result[0] : result;
}

export function HighlightMatch({ text, query }) {
  if (!query) return addBreakHints(text);
  const idx = text.toLowerCase().indexOf(query);
  if (idx === -1) return addBreakHints(text);
  return (
    <>
      {addBreakHints(text.slice(0, idx))}
      <mark>{text.slice(idx, idx + query.length)}</mark>
      {addBreakHints(text.slice(idx + query.length))}
    </>
  );
}
