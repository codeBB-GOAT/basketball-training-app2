import type {Player,Point} from './data';
const scale=20;const X=(m:number)=>m*scale;const Y=(m:number)=>m*scale;
// FIBA 28x15m. Basket centers 1.575m from end lines; 3pt 6.75m arc with 0.9m corner sidelines offset.
export function Court({players=[],ball,compact=false}:{players?:Player[];ball?:Point;compact?:boolean}){
 const r=6.75,corner=0.9,dy=7.5-corner,dx=Math.sqrt(r*r-dy*dy);
 const leftX=1.575+dx,rightX=28-1.575-dx;
 const leftArc=`M ${X(leftX)} ${Y(corner)} A ${X(r)} ${Y(r)} 0 0 1 ${X(leftX)} ${Y(15-corner)}`;
 const rightArc=`M ${X(rightX)} ${Y(corner)} A ${X(r)} ${Y(r)} 0 0 0 ${X(rightX)} ${Y(15-corner)}`;
 return <svg className={'court '+(compact?'compact':'')} viewBox="-8 -8 576 316" role="img" aria-label="FIBA-Basketballfeld 28 mal 15 Meter mit Spielerpositionen" preserveAspectRatio="xMidYMid meet">
 <rect width="560" height="300" fill="#bd8653"/><rect width="560" height="300" fill="none" stroke="#fff4dd" strokeWidth="2"/>
 {[3.5,7,10.5,14,17.5,21,24.5].map(x=><line key={x} x1={X(x)} x2={X(x)} y1="0" y2="300" stroke="#8d5d36" strokeWidth=".8" opacity=".35"/>)}
 <g stroke="#fff5e6" strokeWidth="2" fill="none">
 <line x1="280" y1="0" x2="280" y2="300"/><circle cx="280" cy="150" r="36"/>
 <rect x="0" y={Y(5.05)} width={X(5.8)} height={Y(4.9)}/><rect x={X(22.2)} y={Y(5.05)} width={X(5.8)} height={Y(4.9)}/>
 <circle cx={X(5.8)} cy="150" r="36" strokeDasharray="5 5"/><circle cx={X(22.2)} cy="150" r="36" strokeDasharray="5 5"/>
 <line x1={X(1.575)} x2={X(1.575)} y1={Y(6.9)} y2={Y(8.1)} strokeWidth="3"/>
 <line x1={X(26.425)} x2={X(26.425)} y1={Y(6.9)} y2={Y(8.1)} strokeWidth="3"/>
 <circle cx={X(1.575)} cy="150" r="4.5"/><circle cx={X(26.425)} cy="150" r="4.5"/>
 <path d={leftArc}/><path d={rightArc}/>
 <line x1="0" y1={Y(corner)} x2={X(leftX)} y2={Y(corner)}/><line x1="0" y1={Y(15-corner)} x2={X(leftX)} y2={Y(15-corner)}/>
 <line x1={X(rightX)} y1={Y(corner)} x2="560" y2={Y(corner)}/><line x1={X(rightX)} y1={Y(15-corner)} x2="560" y2={Y(15-corner)}/>
 </g>
 {players.map(p=><g key={p.id} transform={`translate(${X(p.x)} ${Y(p.y)})`}><circle r="12" fill={p.side==='offense'?'#1866d6':'#cc344d'} stroke="white" strokeWidth="2"/><text textAnchor="middle" dominantBaseline="central" fill="white" fontSize="12" fontWeight="800">{p.label}</text></g>)}
 {ball&&<circle cx={X(ball.x)+13} cy={Y(ball.y)-12} r="6" fill="#f9ae2e" stroke="#2d1706" strokeWidth="1.5"/>}
 </svg>;
}
