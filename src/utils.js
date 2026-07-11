export const localDateISO=(tz,d=new Date())=>new Intl.DateTimeFormat('en-CA',{timeZone:tz,year:'numeric',month:'2-digit',day:'2-digit'}).format(d);
export const stripHtml=(v='')=>String(v).replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;|&#x27;/g,"'").replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
export function isFresh(v,h){if(!v)return false;const t=new Date(v).getTime();if(!Number.isFinite(t))return false;const age=Date.now()-t;return age>=-3600000&&age<=h*3600000;}
export function uniq(items,keyFn){const s=new Set();return items.filter(x=>{const k=keyFn(x);if(s.has(k))return false;s.add(k);return true;});}
export function chunkText(text,max=1900){const out=[];let r=String(text||'').trim();while(r.length>max){let c=r.lastIndexOf('\n',max);if(c<max*.5)c=max;out.push(r.slice(0,c).trim());r=r.slice(c).trim();}if(r)out.push(r);return out;}
