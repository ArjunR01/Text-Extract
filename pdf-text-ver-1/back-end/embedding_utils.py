from sentence_transformers import SentenceTransformer
from typing import List, Dict

model = SentenceTransformer("all-MiniLM-L6-v2")

def embed_text(chunks: List[Dist[str, str]]) -> List[Dict]:
  texts = [chunk["text"] for chunk in chunks]
  embeddings = model.encode(texts, convert_to_numpy=True)

  embedded_chunks = []
  for chunk, embedding in zip(chunks, embeddings):
    embedded_chunks.append({
      "chunk": chunk["text"],
      "page": chunk["page"],
      "embedding": embedding.tolist()
    })
  
  return embedded_chunks