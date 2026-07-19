import os
from PIL import Image

BASE = os.path.join(os.path.dirname(__file__), '..', 'assets', 'img')

# (filename, max_width, jpeg_quality)
TARGETS = {
    'logo-lion-raw.png': 1400,   # used large in hero + small in header
    'prof-rodolfo.png': 500,
    'prof-fernanda.png': 500,
    'prof-agustinho.png': 500,
    'prof-henrique.png': 500,
    'prof-marcio.png': 500,
    'prof-juliana.png': 500,
    'prof-mateus.png': 500,
    'student-1.png': 300,
    'student-2.png': 300,
    'student-3.png': 300,
    'student-4.png': 300,
    'student-5.png': 300,
    'student-6.png': 300,
}

for fname, max_w in TARGETS.items():
    path = os.path.join(BASE, fname)
    if not os.path.exists(path):
        print('skip (missing)', fname)
        continue
    im = Image.open(path).convert('RGB')
    w, h = im.size
    if w > max_w:
        new_h = round(h * (max_w / w))
        im = im.resize((max_w, new_h), Image.LANCZOS)
    out_name = os.path.splitext(fname)[0] + '.jpg'
    out_path = os.path.join(BASE, out_name)
    im.save(out_path, 'JPEG', quality=82, optimize=True)
    before = os.path.getsize(path)
    after = os.path.getsize(out_path)
    print(f'{fname}: {before/1024:.0f}KB -> {out_name}: {after/1024:.0f}KB')
