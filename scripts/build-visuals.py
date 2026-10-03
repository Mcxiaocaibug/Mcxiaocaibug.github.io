#!/usr/bin/env python3
"""Deterministic vector artwork; Maple Mono outlines work inside GitHub's image sandbox.

Default: generate artwork using committed web fonts.
--font-source DIR: additionally rebuild both font subsets from official Maple Mono CN TTFs.
"""
import argparse
import json
import random
from datetime import datetime, timezone, timedelta
from pathlib import Path
from xml.sax.saxutils import escape
from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('--font-source', type=Path)
args = parser.parse_args()
FONT_DIR = ROOT / 'static/fonts'
# Include every checked-in UI string plus all glyphs used by this generator.
texts = '\n'.join(p.read_text() for p in (ROOT / 'src').rglob('*') if p.suffix in ('.svelte', '.ts', '.json', '.css')) + Path(__file__).read_text()
if args.font_source:
    for style, name in [('Regular', 'regular'), ('SemiBold', 'semibold')]:
        font = TTFont(args.font_source / f'MapleMono-CN-{style}.ttf')
        options = subset.Options()
        options.flavor = 'woff2'
        options.layout_features = ['*']
        options.name_IDs = ['*']
        options.name_legacy = True
        sub = subset.Subsetter(options=options)
        sub.populate(unicodes=set(map(ord, texts)) | set(range(32, 127)))
        sub.subset(font)
        font.flavor = 'woff2'
        font.save(FONT_DIR / f'maple-mono-cn-{name}.woff2')
        print('Subset:', name)
font = TTFont(FONT_DIR / 'maple-mono-cn-regular.woff2')
glyphs = font.getGlyphSet()
cmap = font.getBestCmap()
units = font['head'].unitsPerEm

def text(value, x, y, size=12, color='#a7bdc7', spacing=0):
    """Render text as paths, not remote-font-dependent SVG text nodes."""
    paths = []
    cursor = 0
    for char in value:
        code = cmap.get(ord(char))
        if not code:
            raise ValueError(f'Missing Maple Mono glyph: {char!r}; rerun with --font-source')
        pen = SVGPathPen(glyphs)
        glyphs[code].draw(pen)
        if pen.getCommands():
            paths.append(f'<path transform="translate({cursor:.2f} 0)" d="{pen.getCommands()}"/>')
        cursor += font['hmtx'][code][0] + spacing * units / size
    scale = size / units
    return f'<g aria-label="{escape(value)}" fill="{color}" transform="translate({x} {y}) scale({scale:.6f} {-scale:.6f})">{"".join(paths)}</g>'

def svg_start(height, title, description):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="{height}" viewBox="0 0 1280 {height}" role="img" aria-labelledby="title desc">
<title id="title">{escape(title)}</title><desc id="desc">{escape(description)}</desc>
<defs>
  <radialGradient id="sky"><stop stop-color="#284557"/><stop offset="1" stop-color="#0b1423"/></radialGradient>
  <radialGradient id="moon" cx="32%" cy="28%" r="75%"><stop stop-color="#d4e2d5"/><stop offset=".3" stop-color="#90aab0"/><stop offset=".66" stop-color="#3a5265"/><stop offset="1" stop-color="#101b2c"/></radialGradient>
  <linearGradient id="titleInk"><stop stop-color="#e8ece5"/><stop offset="1" stop-color="#91adb9"/></linearGradient>
  <radialGradient id="halo"><stop stop-color="#729dad" stop-opacity=".2"/><stop offset="1" stop-color="#729dad" stop-opacity="0"/></radialGradient>
  <linearGradient id="beam"><stop stop-color="#a7d9c5" stop-opacity="0"/><stop offset="1" stop-color="#a7d9c5"/></linearGradient>
</defs>
<style>
  .twinkle {{ animation: twinkle 6s ease-in-out infinite alternate; }}
  .satellite {{ transform-origin: 977px 260px; animation: orbit 34s linear infinite; }}
  .beam {{ animation: transmit 5s ease-in-out infinite; }}
  @keyframes twinkle {{ from {{ opacity:.25; }} to {{ opacity:.85; }} }}
  @keyframes orbit {{ to {{ transform:rotate(360deg); }} }}
  @keyframes transmit {{ from {{ stroke-dashoffset: 340; }} to {{ stroke-dashoffset: 0; }} }}
  @media (prefers-reduced-motion:reduce) {{ * {{ animation:none !important; }} }}
</style>
<rect width="1280" height="{height}" rx="24" fill="#0b1423"/>
<rect x=".5" y=".5" width="1279" height="{height-1}" rx="24" fill="none" stroke="#537285" stroke-opacity=".45"/>
'''

random.seed(20261003)
hero = [svg_start(640, 'Mcxiaocaibug — 写代码，也写风与月', '星空、月面与卫星轨道。Maple Mono 字形轮廓。同步、检查、发布的自动化旅程。装饰动画不代表运行状态。')]
hero.append('<ellipse cx="997" cy="280" rx="290" ry="290" fill="url(#halo)"/>')
for i in range(115):
    x, y, r = random.randrange(30, 1250), random.randrange(25, 490), random.choice([.6, .8, 1.1])
    hero.append(f'<circle class="twinkle" style="animation-delay:-{i%7}s" cx="{x}" cy="{y}" r="{r}" fill="#b1ccde" opacity=".4"/>')
hero += [text('m ↗', 64, 64, 24, '#d3e5d8'), text('MCXIAOCAIBUG / DIGITAL GARDEN', 135, 61, 11, '#a4b9c0', 1), text('VOL. 2026', 1110, 61, 11, '#8aabb9')]
hero += ['<path d="M64 87H1216" stroke="#c3dfe0" stroke-opacity=".16"/>', text('FULL-STACK DEVELOPER · OPEN SOURCE EXPLORER', 70, 157, 11, '#b1cbbf', 1)]
hero += [text('写代码，', 64, 244, 61, '#ecf0e9'), text('也写风与月。', 64, 327, 61, 'url(#titleInk)'), text('在逻辑与留白之间，让灵感抵达。', 70, 379, 16, '#a2b8ba')]
hero += [text('RUST / WEBASSEMBLY / FULL-STACK / MINECRAFT', 70, 435, 10, '#8fa9b9', .7)]
# Moon and orbital lines, drawn entirely with vectors.
hero += ['<circle cx="977" cy="260" r="104" fill="url(#moon)"/>', '<circle cx="950" cy="222" r="24" fill="#e2ebd0" opacity=".09"/>', '<circle cx="1013" cy="286" r="36" fill="#142b3b" opacity=".18"/>', '<circle cx="926" cy="270" r="12" fill="#142b3b" opacity=".1"/>', '<ellipse cx="977" cy="260" rx="195" ry="74" transform="rotate(-28 977 260)" fill="none" stroke="#a6c6d7" stroke-opacity=".42"/>', '<ellipse cx="977" cy="260" rx="161" ry="146" transform="rotate(28 977 260)" fill="none" stroke="#aac6d0" stroke-opacity=".16"/>', '<g class="satellite"><circle cx="1112" cy="138" r="5" fill="#c9ead6"/><circle cx="1112" cy="138" r="12" fill="none" stroke="#c9ead6" stroke-opacity=".3"/></g>', text('THE NEXT LINE IS WAITING.', 863, 451, 10, '#89a6b7', .8)]
hero += ['<rect x="64" y="495" width="1152" height="89" rx="13" fill="#172635" stroke="#afcdd7" stroke-opacity=".2"/>', '<path d="M294 539H469 M688 539H857" stroke="#688c97" stroke-opacity=".4"/>', '<path class="beam" d="M294 539H469 M688 539H857" stroke="#a8d6c3" stroke-dasharray="30 310"/>']
for x, number, label, caption in [(89, '01', 'SYNC', '公开动态'), (489, '02', 'CHECK', '检查与构建'), (881, '03', 'DEPLOY', '抵达星空')]:
    hero += [f'<circle cx="{x+18}" cy="539" r="18" fill="none" stroke="#8fb6b4" stroke-opacity=".5"/>', text(number, x+11, 543, 11, '#b5d5c8'), text(label, x+51, 535, 14, '#e0e8e2', .6), text(caption, x+51, 555, 10, '#9db1b9')]
hero += [text('AUTOMATED WITH GITHUB ACTIONS', 70, 613, 9, '#829eae', .6), text('TYPESET IN MAPLE MONO', 1024, 613, 9, '#829eae')]
hero.append('</svg>')
(ROOT / 'static/readme-hero.svg').write_text('\n'.join(hero))
# A timestamped card for README; refreshed in the deployed artifact, never mislabelled as live.
activity = json.loads((ROOT / 'src/lib/recent-work.json').read_text())
workflow = json.loads((ROOT / 'src/lib/workflow-snapshot.json').read_text())
runs = workflow.get('runs', [])
last = next((run for run in runs if run['status'] == 'completed'), None)
stamp = workflow.get('updatedAt')
label = datetime.fromisoformat(stamp.replace('Z', '+00:00')).astimezone(timezone(timedelta(hours=8))).strftime('%Y-%m-%d %H:%M UTC+08') if stamp else 'AWAITING FIRST SYNC'
status = 'NO RUNS'
if last:
    status = 'RUNNING' if last['status'] != 'completed' else str(last['conclusion'] or 'COMPLETED').upper()
card = [svg_start(222, 'GitHub 自动化快照', f'工作流状态快照：{status}。同步于 {label}。'), text('ORBIT TELEMETRY / AUTOMATION SNAPSHOT', 55, 47, 11, '#a5c5b9', 1), '<path d="M55 70H1225" stroke="#b3d0d5" stroke-opacity=".16"/>']
card += [text('LAST COMPLETED RUN', 55, 108, 10, '#8ca7b7'), text(status, 55, 151, 28, '#d8e9dc'), text('RECENT SIGNALS', 490, 108, 10, '#8ca7b7'), text(f'{len(activity["items"]):02d} PUBLIC EVENTS', 490, 151, 22, '#d8e9dc'), text('SYNCED AT', 874, 108, 10, '#8ca7b7'), text(label, 874, 148, 12, '#c5d7d8'), text('Scheduled snapshot · See the website for polling status and GitHub for the source of truth.', 55, 194, 10, '#8ea8b6')]
card.append('</svg>')
(ROOT / 'static/activity.svg').write_text('\n'.join(card))
print('Generated static/readme-hero.svg and static/activity.svg')
