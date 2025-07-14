from sentence_transformer import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")

def embed_text(text : str):
  return model.encode(text)