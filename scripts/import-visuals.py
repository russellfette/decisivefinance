"""Import the Decisive icon set into src/assets/icons with site color tokens.
Source: OA - Decisive Finance/site-visuals-handoff-2026-10-17/icons (Russ-approved direction, 2026-10-17).
Run: python3 scripts/import-visuals.py <handoff icons dir>
"""
import re, sys, pathlib
SRC = pathlib.Path(sys.argv[1]); DST = pathlib.Path(__file__).resolve().parent.parent / 'src/assets/icons'
TOK = {'#1B222A':'var(--ink)','#E3632B':'var(--orange-brand)','#E0622F':'var(--orange-brand)','#4A6466':'var(--teal)',
       '#6B7378':'var(--muted)','#A8431A':'var(--orange)','#FFFFFF':'var(--white)','#F4F1EC':'var(--paper)',
       '#D9D4CB':'var(--rule)','#F08A5D':'var(--orange-on-dark)','#C9CED2':'var(--rule)'}
def tok(m):
    return TOK.get(m.upper(), m)
def convert(svg):
    svg = re.sub(r'<metadata>.*?</metadata>', '', svg, flags=re.S)
    svg = re.sub(r'\s+xmlns:c2pa="[^"]*"', '', svg)
    svg = re.sub(r'<svg([^>]*?)\swidth="\d+"\sheight="\d+"', r'<svg\1', svg, count=1)
    def el(m):
        tag = m.group(0)
        props = []
        for attr in ('fill', 'stroke'):
            a = re.search(r'\s%s="(#[0-9A-Fa-f]{6})"' % attr, tag)
            if a:
                props.append('%s:%s' % (attr, tok(a.group(1))))
                tag = tag.replace(a.group(0), '')
        tag = re.sub(r'font-family:[^;"]*;?', '', tag)
        if tag.startswith('<text'):
            props = [x.replace('var(--orange-brand)', 'var(--orange)') for x in props]
        if props:
            if ' style="' in tag:
                tag = tag.replace(' style="', ' style="%s;' % ';'.join(props), 1)
            else:
                tag = re.sub(r'(/?>)$', ' style="%s"\\1' % ';'.join(props), tag)
        return tag
    svg = re.sub(r'<(?!/)(?!svg)[a-zA-Z]+[^>]*>', el, svg)
    svg = svg.replace('<svg ', '<svg aria-hidden="true" focusable="false" ', 1)
    return svg
DST.mkdir(parents=True, exist_ok=True)
for f in sorted(SRC.glob('*.svg')):
    (DST / f.name).write_text(convert(f.read_text()))
    print('ok', f.name)
