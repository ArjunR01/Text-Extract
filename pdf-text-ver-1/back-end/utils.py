def chunk_text(text, chunk_size=300, overlap=50):
  chunks = []
  # text = text.strip()

  for page_num, page_text in text.items():
    start = 0
    while start < len(page_text):
      end = min(start + chunk_size, len(page_text))
      chunk = page_text[start:end]
      if chunk:
        chunks.append({"text":chunk, "page":page_num})
      start += chunk_size - overlap

  return chunks