import os
from PIL import Image

BASE = os.path.join(os.path.dirname(__file__), '..', 'assets', 'img')
SRC = os.path.join(BASE, 'logo-lion-original.png')

im = Image.open(SRC).convert('RGBA')
px = im.load()
w, h = im.size

# Key out near-black background, keep a soft edge so glow doesn't get a hard cutout.
DARK = 26      # fully transparent below this luminance
SOFT = 70      # fully opaque above this luminance

for y in range(h):
    for x in range(w):
        r, g, b, a = px[x, y]
        lum = max(r, g, b)  # use max channel so colorful glow (green/purple) survives
        if lum <= DARK:
            alpha = 0
        elif lum >= SOFT:
            alpha = 255
        else:
            alpha = int((lum - DARK) / (SOFT - DARK) * 255)
        px[x, y] = (r, g, b, min(a, alpha))

# Trim fully-transparent margins so the image hugs the artwork.
bbox = im.getbbox()
if bbox:
    im = im.crop(bbox)

# full-res transparent master (resized down a bit, still sharp)
w2 = 1600
h2 = round(im.size[1] * (w2 / im.size[0]))
im_big = im.resize((w2, h2), Image.LANCZOS)
im_big.save(os.path.join(BASE, 'logo-lion.png'), 'PNG', optimize=True)

print('saved logo-lion.png', im_big.size, os.path.getsize(os.path.join(BASE, 'logo-lion.png')) / 1024, 'KB')
