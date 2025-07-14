def chunk_text(text, max_length=300, overlap=50):
  chunks = []
  start = 0
  text = text.strip()

  while start < len(text):
    end = min(start+max_length, len(text))
    chunk = text[start:end]
    chunks.append(chunk)
    start += max_length - overlap

  return chunks