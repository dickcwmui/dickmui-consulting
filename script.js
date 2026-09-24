const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.nav');
function closeMenu(){nav?.classList.remove('open');menuButton?.setAttribute('aria-expanded','false');menuButton?.setAttribute('aria-label','Open navigation');if(menuButton)menuButton.textContent='Menu';}
menuButton?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Close navigation':'Open navigation');menuButton.textContent=open?'Close':'Menu';});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav?.classList.contains('open')){closeMenu();menuButton.focus();}});
// Optional analytics adapter. No provider, cookies or persistent identifiers added.
function track(name,properties={}){const detail={name,...properties};window.dispatchEvent(new CustomEvent('dmc:analytics',{detail}));if(typeof window.dmcAnalytics==='function'){try{window.dmcAnalytics(name,properties);}catch{ /* Tracking must never block enquiry delivery. */ }}}
document.addEventListener('click',e=>{const a=e.target.closest('a');if(!a)return;const u=new URL(a.href,location.href);if(u.origin===location.origin&&u.pathname==='/start-a-project')track('start_project_click',{placement:a.closest('header')?'navigation':a.closest('footer')?'footer':'content'});if(u.hostname==='wa.me')track('whatsapp_click');if(u.hostname==='www.linkedin.com'||u.hostname==='linkedin.com')track('linkedin_click');if(a.dataset.event==='partner_apply_click')track('partner_apply_click');});
const study=document.querySelector('[data-case-study]');if(study)track('case_study_view',{slug:study.dataset.caseStudy});
const publishedArticle=document.querySelector('[data-published-insight]');if(publishedArticle)track('insight_read',{slug:publishedArticle.dataset.publishedInsight});
const form=document.querySelector('#project-form');
if(form){
 let started=false;form.addEventListener('input',()=>{if(!started){track('project_form_start');started=true;}});
 const params=new URLSearchParams(location.search);for(const key of ['service','engagement']){form.elements[key].value=(params.get(key)||'').slice(0,80);}
 form.addEventListener('submit',async e=>{e.preventDefault();const status=document.querySelector('#form-status');status.textContent='';const data=Object.fromEntries(new FormData(form));data.challenges=new FormData(form).getAll('challenges');if(!data.challenges.length){status.textContent='Please select at least one challenge.';form.querySelector('[name=challenges]').focus();return;}
 const button=form.querySelector('[type=submit]');button.disabled=true;button.textContent='Sending…';form.setAttribute('aria-busy','true');
 try{const response=await fetch('/api/project',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),signal:AbortSignal.timeout(15000)});const result=await response.json();if(!response.ok)throw new Error(result.error||'Your brief could not be sent. Please try again or contact Dick on WhatsApp.');
 if(result.delivery){
  if(!/^https:\/\/formsubmit\.co\/ajax\/[a-f0-9]{32}$/.test(result.delivery.url))throw new Error('Invalid delivery configuration. Please contact Dick on WhatsApp.');
  const delivery=await fetch(result.delivery.url,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(result.delivery.fields),signal:AbortSignal.timeout(15000)});
  const receipt=await delivery.json();
  if(!delivery.ok||(receipt.success!==true&&receipt.success!=='true'))throw new Error(/activat/i.test(String(receipt.message))?'Email delivery is awaiting verification. Your brief has not been sent. Please contact Dick on WhatsApp.':'Delivery could not be confirmed. Please contact Dick on WhatsApp before retrying.');
 }else if(result.ok!==true)throw new Error('Delivery could not be confirmed. Please contact Dick on WhatsApp before retrying.');
 track('project_form_submit');form.hidden=true;const success=document.querySelector('#form-success');success.hidden=false;success.focus();}
 catch(error){status.textContent=error.name==='TimeoutError'?'Delivery could not be confirmed. Please contact Dick on WhatsApp before retrying.':error.message==='Failed to fetch'?'Connection failed. Your brief has not been confirmed as received. Please try again or use WhatsApp.':error.message;}
 finally{button.disabled=false;button.textContent='Send Project Brief';form.removeAttribute('aria-busy');}
 });
}
