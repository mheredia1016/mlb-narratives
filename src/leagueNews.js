import { searchSerpApiNews } from './newsSearch.js';
import { scoreText } from './scoring.js';
import { todayParts } from './newsDate.js';
function uniqueBy(items, keyFn){const seen=new Set();return items.filter(i=>{const k=keyFn(i);if(seen.has(k))return false;seen.add(k);return true;});}
function leagueQueries(config){const q=[
`site:mlb.com/news MLB today reinstated from injured list activated from IL \"${d.shortDate}\"`,
`site:mlb.com/news MLB today called up promoted recalled from Triple-A \"${d.shortDate}\"`,
`site:mlb.com/news MLB debut today major league debut \"${d.shortDate}\"`,
`site:mlb.com/news MLB starting lineup today first game back \"${d.shortDate}\"`,
`site:mlb.com/news MLB transactions today injured list \"${d.shortDate}\"`,
'MLB today reinstated from injured list activated from IL',
'MLB today called up promoted recalled from Triple-A',
'MLB prospect called up today starting lineup',
'MLB player first game back today',
'MLB roster moves today starting lineup'];
return (config.enableMlbComSearch?q:q.filter(x=>!x.includes('site:mlb.com'))).slice(0,config.maxLeagueNewsQueries||10);}
function mentioned(text,players){const l=text.toLowerCase();return players.filter(p=>l.includes(p.fullName.toLowerCase()));}
export async function getLeagueNewsIntel({allPlayers,gamesByTeamId,config}){
 const counters={queries:0,results:0,scoredResults:0,matchedPlayers:0}; const alerts=[];
 if(!config.enableLeagueNewsScan||!config.serpApiKey)return{alerts,counters};
 for(const query of leagueQueries(config)){counters.queries++;let results=[];try{results=await searchSerpApiNews(query,config);}catch(e){console.error('League news search failed:',e.message);continue;} counters.results+=results.length;
  for(const r of results){const text=`${r.title} ${r.snippet}`;const scored=await scoreText(text);if(scored.score<=0)continue;counters.scoredResults++;const ms=mentioned(text,allPlayers);counters.matchedPlayers+=ms.length;
   if(ms.length){for(const p of ms.slice(0,3)){const game=gamesByTeamId.get(p.currentTeam?.id);alerts.push({type:scored.hits.some(h=>h.includes('injured list')||h.includes('IL')||h.includes('first game back'))?'return':'news',score:Math.min(80,scored.score+15),playerName:p.fullName,teamName:p.currentTeam?.name||'',game:game?.label||'',title:`${p.fullName}: ${r.title}`,details:[`League news hit: ${scored.hits.join(', ')}`,r.source?`Source: ${r.source}`:'',r.link||''].filter(Boolean).join(' | '),sourceUrl:r.link||''});}}
   else alerts.push({type:'news',score:Math.min(65,scored.score),playerName:'',teamName:'',game:'',title:r.title,details:[`League news hit: ${scored.hits.join(', ')}`,r.source?`Source: ${r.source}`:'',r.link||''].filter(Boolean).join(' | '),sourceUrl:r.link||''});
  }}
 return{alerts:uniqueBy(alerts,a=>`${a.playerName}|${a.title}|${a.sourceUrl}`.toLowerCase()).sort((a,b)=>b.score-a.score).slice(0,config.maxLeagueNewsAlerts||15),counters};}
