from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
import json
class Page(HTMLParser):
 def __init__(self,text):
  super().__init__();self.ids=[];self.links=[];self.h1=0;self.tags=[];self.feed(text)
 def handle_starttag(self,tag,attrs):
  a=dict(attrs);self.tags.append((tag,a))
  if 'id' in a:self.ids.append(a['id'])
  if tag=='h1':self.h1+=1
  if tag in ['a','link','script']:
   v=a.get('href',a.get('src'))
   if v:self.links.append(v)
root=Path(__file__).resolve().parents[1]/'public';pages={p:Page(p.read_text()) for p in root.rglob('*.html')};errors=[]
for p,s in pages.items():
 if s.h1!=1:errors.append(str(p)+': h1 count')
 if len(s.ids)!=len(set(s.ids)):errors.append(str(p)+': duplicate IDs')
 for url in s.links:
  u=urlsplit(url)
  if u.netloc:continue
  q=root/(u.path.lstrip('/') or 'index.html')
  if not q.suffix:q=q.with_suffix('.html')
  if not q.exists():errors.append(str(p)+': missing '+str(q))
  elif u.fragment and q in pages and u.fragment not in pages[q].ids:errors.append(str(p)+': missing anchor '+u.fragment)
 for tag,key,value in [('meta','name','description'),('meta','property','og:image'),('link','rel','canonical')]:
  if not any(t==tag and a.get(key)==value for t,a in s.tags):errors.append(str(p)+': missing '+value)
print('Checked',len(pages),'pages:',errors or 'All internal links, anchors, headings and metadata passed.')
assert not errors
