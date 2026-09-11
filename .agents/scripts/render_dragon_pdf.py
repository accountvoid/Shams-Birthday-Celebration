import fitz
from pathlib import Path
pdf = Path('attached_assets/Dragon_Academy_1789084785516.pdf')
out = Path('.agents/outputs/dragon_pdf')
out.mkdir(parents=True, exist_ok=True)
doc = fitz.open(pdf)
print('pages', doc.page_count)
print('metadata', doc.metadata)
for i, page in enumerate(doc):
    pix = page.get_pixmap(matrix=fitz.Matrix(1.4, 1.4), alpha=False)
    path = out / f'page-{i+1}.png'
    pix.save(path)
    print(path, page.rect)
    print(page.get_text()[:500].replace('\n',' | '))
