import {useEffect,useState} from 'react';
import {ArrowLeft,Plus,Trash2,Play,Pause,RotateCcw,Save} from 'lucide-react';
export type ModuleName='shooting'|'finishing';
type Drill={id:string;name:string;description:string;minutes:number;custom?:boolean};
type Workout={id:string;name:string;drillIds:string[];createdAt:string};
type Session={id:string;workoutName:string;module:ModuleName;completedAt:string;durationMinutes:number};
const defaults:Record<ModuleName,Drill[]>={
 shooting:[
 {id:'form',name:'Form Shooting',description:'Nah am Korb auf Balance, sauberen Release und gleichmäßige Bewegung achten.',minutes:6},
 {id:'catch',name:'Catch & Shoot',description:'Ball aufnehmen, Füße ausrichten und kontrolliert abschließen.',minutes:8},
 {id:'spots',name:'5-Spot Shooting',description:'Von fünf Positionen werfen und Treffer selbst zählen.',minutes:10},
 {id:'free',name:'Freiwürfe',description:'Konstante Routine und ruhigen Rhythmus üben.',minutes:5},
 {id:'movement',name:'Shooting off Movement',description:'Nach kurzem Cut anhalten und mit Balance werfen.',minutes:8},
 {id:'pullup',name:'Pull-up Jumper',description:'Nach ein bis zwei Dribblings kontrolliert in den Wurf gehen.',minutes:7}],
 finishing:[
 {id:'both',name:'Layups beidseitig',description:'Rechts und links mit kontrollierter Schrittfolge abschließen.',minutes:8},
 {id:'reverse',name:'Reverse Layups',description:'Mit dem Ring als Schutz auf der gegenüberliegenden Seite abschließen.',minutes:7},
 {id:'floater',name:'Floater Touch',description:'Kurze, weiche Abschlüsse aus der Zone üben.',minutes:7},
 {id:'euro',name:'Euro-Step Footwork',description:'Richtungswechsel mit sauberem Rhythmus und Schrittfolge.',minutes:6},
 {id:'contact',name:'Controlled Contact Finishes',description:'Unter leichter, sicherer Störung Balance und Ballkontrolle halten.',minutes:8},
 {id:'offhand',name:'Weak-Hand Finishes',description:'Korbleger und kurze Abschlüsse mit der schwächeren Hand.',minutes:8}]};
const key=(m:ModuleName,s:string)=>`basketball-${m}-${s}-v1`;
function read<T>(k:string,fallback:T):T{try{const v=localStorage.getItem(k);return v?JSON.parse(v) as T:fallback}catch{return fallback}}
function persist(k:string,v:unknown){try{localStorage.setItem(k,JSON.stringify(v));return true}catch{return false}}
export function SkillModule({module,onBack}:{module:ModuleName;onBack:()=>void}){
 const [custom,setCustom]=useState<Drill[]>(()=>read(key(module,'drills'),[]));
 const [workouts,setWorkouts]=useState<Workout[]>(()=>read(key(module,'workouts'),[]));
 const [sessions,setSessions]=useState<Session[]>(()=>read(key(module,'sessions'),[]));
 const [selected,setSelected]=useState<string[]>([]);const [workoutName,setWorkoutName]=useState('Mein Workout');
 const [name,setName]=useState('');const [description,setDescription]=useState('');const [minutes,setMinutes]=useState(6);
 const [active,setActive]=useState<Workout|null>(null);const [step,setStep]=useState(0);const [seconds,setSeconds]=useState(0);const [running,setRunning]=useState(false);const [message,setMessage]=useState('');
 const drills=[...defaults[module],...custom];const title=module==='shooting'?'Shooting':'Finishing';
 useEffect(()=>{if(!persist(key(module,'drills'),custom))setMessage('Lokale Speicherung nicht verfügbar.')},[module,custom]);
 useEffect(()=>{if(!persist(key(module,'workouts'),workouts))setMessage('Lokale Speicherung nicht verfügbar.')},[module,workouts]);
 useEffect(()=>{if(!persist(key(module,'sessions'),sessions))setMessage('Lokale Speicherung nicht verfügbar.')},[module,sessions]);
 useEffect(()=>{if(!running)return;const id=window.setInterval(()=>setSeconds(s=>Math.max(0,s-1)),1000);return()=>window.clearInterval(id)},[running]);
 useEffect(()=>{if(seconds===0&&running)setRunning(false)},[seconds,running]);
 const current=active?drills.find(d=>d.id===active.drillIds[step]):undefined;
 const start=(w:Workout)=>{const first=drills.find(d=>d.id===w.drillIds[0]);if(!first)return;setActive(w);setStep(0);setSeconds(first.minutes*60);setRunning(false);setMessage('Workout bereit. Starte den Timer, wenn du bereit bist.')};
 const next=()=>{if(!active)return;const n=step+1;if(n>=active.drillIds.length){const duration=active.drillIds.reduce((sum,id)=>sum+(drills.find(d=>d.id===id)?.minutes||0),0);setSessions(s=>[{id:crypto.randomUUID(),module,workoutName:active.name,completedAt:new Date().toISOString(),durationMinutes:duration},...s]);setActive(null);setRunning(false);setMessage('Workout abgeschlossen und lokal gespeichert.');return}setStep(n);setSeconds((drills.find(d=>d.id===active.drillIds[n])?.minutes||1)*60);setRunning(false)};
 const addDrill=()=>{if(!name.trim())return;setCustom(x=>[...x,{id:crypto.randomUUID(),name:name.trim(),description:description.trim(),minutes,custom:true}]);setName('');setDescription('');setMinutes(6);setMessage('Eigener Drill gespeichert.')};
 const saveWorkout=()=>{if(!selected.length){setMessage('Wähle mindestens eine Übung.');return}setWorkouts(w=>[{id:crypto.randomUUID(),name:workoutName.trim()||'Mein Workout',drillIds:selected,createdAt:new Date().toISOString()},...w]);setSelected([]);setMessage('Workout gespeichert.')};
 return <div className="skillModule"><button className="secondary" onClick={onBack}><ArrowLeft size={17}/> Alle Module</button><div className="pageTitle"><span className="eyebrow">BASKETBALL TRAINING · BETA</span><h1>{title}</h1><p>{module==='shooting'?'Wurftechnik, Rhythmus und Abschlüsse aus unterschiedlichen Positionen.':'Abschlüsse am Korb, Footwork und beidseitige Kontrolle.'}</p></div>
 {message&&<p className="moduleNotice" role="status">{message}</p>}
 {active?<section className="panel"><span className="eyebrow">AKTIVES WORKOUT · {step+1}/{active.drillIds.length}</span><h2>{active.name}</h2><h3>{current?.name}</h3><p>{current?.description}</p><div className="moduleClock">{String(Math.floor(seconds/60)).padStart(2,'0')}:{String(seconds%60).padStart(2,'0')}</div><div className="moduleActions"><button className="primary" onClick={()=>setRunning(x=>!x)}>{running?<Pause size={18}/>:<Play size={18}/>} {running?'Pause':'Start / Fortsetzen'}</button><button className="secondary" onClick={()=>{setRunning(false);setSeconds((current?.minutes||1)*60)}}><RotateCcw size={17}/> Zurücksetzen</button><button className="secondary" onClick={next}>{step===active.drillIds.length-1?'Workout abschließen':'Nächste Übung'} →</button><button className="secondary" onClick={()=>{setActive(null);setRunning(false)}}>Abbrechen</button></div><small className="muted">Zeit und Abschluss werden manuell gesteuert. Keine automatische Treffererkennung.</small></section>:<>
 <section className="panel"><h2>Workout zusammenstellen</h2><p className="muted">Wähle Übungen aus und speichere dein persönliches Workout.</p><div className="moduleDrills">{drills.map(d=><label className="moduleDrill" key={d.id}><input type="checkbox" checked={selected.includes(d.id)} onChange={e=>setSelected(x=>e.target.checked?[...x,d.id]:x.filter(id=>id!==d.id))}/><span><b>{d.name}</b><small>{d.minutes} Min. · {d.description}</small></span>{d.custom&&<button type="button" className="miniDanger" aria-label={'Drill '+d.name+' löschen'} onClick={e=>{e.preventDefault();setCustom(x=>x.filter(a=>a.id!==d.id));setSelected(x=>x.filter(id=>id!==d.id))}}><Trash2 size={16}/></button>}</label>)}</div><label className="moduleField">Workout-Name<input value={workoutName} maxLength={50} onChange={e=>setWorkoutName(e.target.value)}/></label><p className="muted">{selected.length} Übungen · {selected.reduce((n,id)=>n+(drills.find(d=>d.id===id)?.minutes||0),0)} Minuten</p><button className="primary" onClick={saveWorkout}><Save size={17}/> Workout speichern</button></section>
 <section className="panel"><h2>Gespeicherte Workouts</h2>{workouts.length===0?<p className="muted">Noch keine Workouts gespeichert.</p>:workouts.map(w=><div className="moduleSaved" key={w.id}><div><b>{w.name}</b><small>{w.drillIds.length} Übungen · {w.drillIds.reduce((n,id)=>n+(drills.find(d=>d.id===id)?.minutes||0),0)} Min.</small></div><div className="moduleActions"><button className="secondary" onClick={()=>start(w)}><Play size={16}/> Starten</button><button className="miniDanger" aria-label={'Workout '+w.name+' löschen'} onClick={()=>setWorkouts(x=>x.filter(a=>a.id!==w.id))}><Trash2 size={16}/></button></div></div>)}</section>
 <section className="panel"><h2>Eigenen Drill erstellen</h2><label className="moduleField">Name<input value={name} maxLength={60} onChange={e=>setName(e.target.value)} placeholder="z. B. Meine 5 Spots"/></label><label className="moduleField">Beschreibung<textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="So führe ich die Übung aus …" rows={3}/></label><label className="moduleField">Dauer (Minuten)<input type="number" min="1" max="60" value={minutes} onChange={e=>setMinutes(Math.max(1,Math.min(60,Number(e.target.value)||1)))}/></label><button className="secondary" onClick={addDrill} disabled={!name.trim()}><Plus size={17}/> Drill speichern</button></section>
 <section className="panel"><h2>Trainingsverlauf</h2>{sessions.length===0?<p className="muted">Noch keine abgeschlossenen Workouts.</p>:sessions.slice(0,15).map(s=><div className="moduleSaved" key={s.id}><b>{s.workoutName}</b><small>{new Date(s.completedAt).toLocaleDateString('de-DE')} · {s.durationMinutes} geplante Min.</small></div>)}</section>
 </>}
 <section className="panel"><h3>Kamera & KI</h3><p className="muted">Automatische Wurf- bzw. Abschlussanalyse ist in dieser Beta noch nicht aktiv. Keine Videoaufnahme oder Übertragung im {title}-Modul.</p></section>
 </div>}
