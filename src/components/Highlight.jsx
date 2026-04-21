// Insert <wbr> at preferred break points: after "b2b" and before "("
function addBreakHints(text) {
  const parts = text.split(/(b[23]b\s+|(?<=\s)\()/i);
  if (parts.length === 1) return text;
  return parts.map((part, i) => {
    if (i === 0) return part;
    // Insert wbr before segments that start with "("
    if (part.startsWith('(')) {
      return <span key={i}><wbr />{part}</span>;
    }
    // Insert wbr after segments that end with "b2b" (+ optional space)
    if (/b[23]b\s+$/i.test(part)) {
      return <span key={i}>{part}<wbr /></span>;
    }
    return part;
  });
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
