"""Project native GUI assets from interpreter-produced states; never modifies originals."""
import json, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
records = json.loads(Path(sys.argv[1]).read_text())
out = Path(sys.argv[2])
font_path = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
font = ImageFont.truetype(font_path, 17)
small = ImageFont.truetype(font_path, 13)
previews=[]
for scene in records['scenes']:
    h=660 if not scene['id'].startswith('roulette') else 235
    canvas=Image.new('RGB',(1810,h+56),'#151b25');draw=ImageDraw.Draw(canvas)
    draw.text((15,8),scene['id']+'  |  original PDX state',font=font,fill='#ffffff')
    draw.text((925,8),'Krieg emitted PDX state',font=font,fill='#ffffff')
    for offset, side in [(0,'original'),(910,'rewritten')]:
        for node in scene[side]:
            x,y=round(offset+node['x']),round(42+node['y'])
            if node.get('texture'):
                im=Image.open(node['texture']).convert('RGBA')
                scale=node.get('scale',1)
                if scale!=1: im=im.resize((round(im.width*scale),round(im.height*scale)),Image.Resampling.LANCZOS)
                canvas.paste(im,(x,y),im)
            elif 'button' in node['kind']:
                draw.rounded_rectangle((x,y,x+123,y+34),radius=3,fill='#685c42' if node['enabled'] else '#333840',outline='#a09070')
            if node.get('text'):
                text=node['text'];box=draw.textbbox((0,0),text,font=font);width=box[2]-box[0]
                if node['align']=='center':x+=round((node['width']-width)/2)
                elif node['align']=='right':x+=round(node['width']-width)
                draw.text((x,y),text,font=font,fill='#f3e8ce' if node['enabled'] else '#92989b',stroke_width=1,stroke_fill='#181818')
    draw.text((15,h+37),'Native-state projection · original textures · substitute font · not an HOI4 screenshot',font=small,fill='#aeb8c7')
    canvas.save(out/(scene['id']+'.png'))
    thumb=canvas.copy();thumb.thumbnail((1200,500));previews.append(thumb)
contact=Image.new('RGB',(1200,sum(im.height for im in previews)+8*(len(previews)-1)),'#151b25')
y=0
for im in previews:contact.paste(im,(0,y));y+=im.height+8
contact.save(out/'contact-sheet.png')
print(f'{len(previews)} paired native UI projections written to {out}')
