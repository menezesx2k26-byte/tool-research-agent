// Durable Skills Hub MVP. Cloudflare Worker + D1. No arbitrary shell or skill installation.
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{"content-type":"application/json","cache-control":"no-store"}});
const auth=(req,env)=>{const h=req.headers.get("authorization")||"";return !!env.HUB_TOKEN&&h===`Bearer ${env.HUB_TOKEN}`;};
export default {async fetch(request,env){
 if(!auth(request,env))return json({error:"unauthorized"},401);
 const url=new URL(request.url),path=url.pathname;
 if(request.method==="GET"&&path==="/health")return json({ok:true,service:"skills-hub",version:1});
 if(request.method==="GET"&&path==="/skills"){
   const r=await env.DB.prepare("SELECT id,source,revision,status FROM skills ORDER BY id").all();
   return json({skills:r.results});
 }
 if(request.method==="GET"&&path.startsWith("/jobs/")){
   const id=path.slice(6);
   const row=await env.DB.prepare("SELECT id,skill_id,status,created_at,updated_at,artifact_url,error FROM jobs WHERE id=?").bind(id).first();
   return row?json(row):json({error:"not_found"},404);
 }
 if(request.method==="POST"&&path==="/jobs"){
   let body;try{body=await request.json();}catch{return json({error:"invalid_json"},400);}
   if(typeof body.skill_id!=="string"||typeof body.query!=="string"||!body.query.trim()||body.query.length>4000)return json({error:"invalid_input"},400);
   const skill=await env.DB.prepare("SELECT id,revision,status FROM skills WHERE id=?").bind(body.skill_id).first();
   if(!skill||skill.status!=="approved")return json({error:"skill_not_approved"},403);
   const id=crypto.randomUUID();
   await env.DB.prepare("INSERT INTO jobs(id,skill_id,query,status) VALUES(?,?,?,'queued')").bind(id,skill.id,body.query).run();
   // A separate authorized dispatcher must claim jobs and trigger pinned GitHub workflows.
   // Never dispatch from this endpoint without a verified runner and scoped credentials.
   return json({id,status:"queued"},202);
 }
 return json({error:"not_found"},404);
}};