// Configure a trusted HTTPS CRM/form receiver in Vercel. Never expose secrets in HTML.
module.exports=async function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({error:'Method not allowed.'});}
 if(!String(req.headers['content-type']||'').includes('application/json'))return res.status(415).json({error:'JSON required.'});
 const origin=req.headers.origin;
 if(origin){try{if(new URL(origin).host!==req.headers.host)return res.status(403).json({error:'Request origin not allowed.'});}catch{return res.status(403).json({error:'Invalid origin.'});}}
 let d;try{d=typeof req.body==='string'?JSON.parse(req.body):req.body;}catch{return res.status(400).json({error:'Invalid request.'});}
 if(!d||JSON.stringify(d).length>15000)return res.status(400).json({error:'Please shorten your project brief.'});
 if(d.website)return res.status(400).json({error:'Unable to submit this request.'});
 const sets={product:['Consumer Electronics','IoT / Connected Device','Appliance','Industrial Product','Medical / Regulated','Other'],stage:['Concept','Prototype','EVT','DVT','Tooling','Pilot / PVT','Mass Production','Existing product / redesign'],volume:['<1,000','1,000–5,000','5,000–20,000','20,000–100,000','100,000+','Not sure yet'],nda:['Yes','No','Not yet']};
 for(const key of ['name','company','email'])if(typeof d[key]!=='string'||!d[key].trim()||d[key].length>200)return res.status(400).json({error:'Please check your contact details.'});
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email))return res.status(400).json({error:'Please enter a valid email address.'});
 for(const [key,values]of Object.entries(sets))if(!values.includes(d[key]))return res.status(400).json({error:'Please complete the required selections.'});
 const challenges=['Supplier sourcing','Supplier performance','DFM','Tooling','Cost','Quality','Testing','Schedule','Pilot build','Mass-production readiness','Supply chain','Other'];
 if(!Array.isArray(d.challenges)||!d.challenges.length||d.challenges.length>12||d.challenges.some(c=>!challenges.includes(c)))return res.status(400).json({error:'Please select at least one valid challenge.'});
 if(typeof d.message!=='string'||d.message.trim().length<10||d.message.length>5000||d.consent!=='on')return res.status(400).json({error:'Please complete the summary and consent.'});
 if(d.linkedin){try{const u=new URL(d.linkedin);if(u.protocol!=='https:'||!(u.hostname==='linkedin.com'||u.hostname.endsWith('.linkedin.com'))||d.linkedin.length>2000)throw Error();}catch{return res.status(400).json({error:'Please enter a valid HTTPS LinkedIn URL.'});}}
 if(d.targetDate&&!/^\d{4}-\d{2}-\d{2}$/.test(d.targetDate))return res.status(400).json({error:'Please check the target production date.'});
 const emailDelivery=process.env.PROJECT_DELIVERY_PROVIDER==='formsubmit';
 const recipient=process.env.PROJECT_EMAIL_TO;
 const endpoint=emailDelivery&&recipient?'https://formsubmit.co/ajax/'+encodeURIComponent(recipient):process.env.PROJECT_WEBHOOK_URL;
 if(!endpoint||process.env.PROJECT_FORM_ENABLED!=='true')return res.status(503).json({error:'Online project delivery is not enabled yet. Your brief has not been sent. Please contact Dick on WhatsApp below.'});
 try{if(new URL(endpoint).protocol!=='https:')throw Error();const payload={type:'project_enquiry',receivedAt:new Date().toISOString()};for(const key of ['name','company','email','linkedin','product','stage','challenges','volume','targetDate','message','nda','consent'])payload[key]=d[key]||'';
 for(const key of ['service','engagement'])payload[key]=typeof d[key]==='string'?d[key].slice(0,80):'';
 if(emailDelivery){if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient))throw Error();payload.challenges=d.challenges.join(', ');payload._subject='Dick Mui Consulting — New project brief';payload._template='table';payload._replyto=d.email;payload._url='https://dickmui-consulting.vercel.app/start-a-project';}
 // FormSubmit supports browser AJAX. Its edge rejects this Vercel egress IP.
 // This published form identifier is an email-masking route, not a credential.
 // Validate first, then let the browser submit once; never report receipt here.
 if(emailDelivery)return res.status(200).json({delivery:{url:'https://formsubmit.co/ajax/4a65ebecc92abd70d831733a0f0e2809',fields:payload}});
 const upstream=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json',...(process.env.PROJECT_WEBHOOK_TOKEN?{Authorization:'Bearer '+process.env.PROJECT_WEBHOOK_TOKEN}:{})},body:JSON.stringify(payload),signal:AbortSignal.timeout(10000),redirect:'error'});
 if(!upstream.ok){console.warn('project_delivery_provider_http',upstream.status);throw Error();}
 return res.status(200).json({ok:true});
 }catch(error){console.warn('project_delivery_failed',error.name,error.cause?.code||'');return res.status(502).json({error:'Delivery could not be confirmed. Please contact Dick on WhatsApp before retrying.'});}
};
