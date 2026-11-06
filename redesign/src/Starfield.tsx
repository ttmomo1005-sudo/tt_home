import { useEffect, useRef } from 'react';
export default function Starfield({ paused }: { paused: boolean }) {
 const ref=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const canvas=ref.current,ctx=canvas?.getContext('2d'); if(!canvas||!ctx)return;
  const motion=matchMedia('(prefers-reduced-motion: reduce)'),pointer={x:-2000,y:-2000};
  let w=0,h=0,frame=0,seed=131; let stars:{x:number;y:number;r:number;a:number;phase:number}[]=[];
  const random=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
  function paint(time:number){if(!ctx)return;ctx.clearRect(0,0,w,h);const dim=1-Math.min(scrollY/h,1)*.75;for(const s of stars){const x=s.x*w,y=s.y*h,near=Math.max(0,1-Math.hypot(x-pointer.x,y-pointer.y)/210),blink=paused||motion.matches?1:.88+.12*Math.sin(time*.00045+s.phase),alpha=Math.min(1,s.a*blink+near*.6)*dim;ctx.fillStyle=`rgba(239,238,233,${alpha})`;ctx.beginPath();ctx.arc(x,y,s.r+near*.4,0,Math.PI*2);ctx.fill();if(s.r>1.05){ctx.strokeStyle=`rgba(239,238,233,${alpha*.3})`;ctx.beginPath();ctx.moveTo(x-3,y);ctx.lineTo(x+3,y);ctx.moveTo(x,y-3);ctx.lineTo(x,y+3);ctx.stroke();}}}
  const resize=()=>{w=innerWidth;h=innerHeight;const d=Math.min(devicePixelRatio,2);canvas.width=w*d;canvas.height=h*d;ctx.setTransform(d,0,0,d,0,0);seed=131;stars=Array.from({length:Math.min(400,Math.max(130,Math.floor(w*h/4000)))},()=>({x:random(),y:random(),r:.35+random()**3*1.15,a:.2+random()*.55,phase:random()*6.28}));paint(0);};
  const loop=(t:number)=>{paint(t);frame=requestAnimationFrame(loop);};
  const move=(e:PointerEvent)=>{pointer.x=e.clientX;pointer.y=e.clientY;if(paused||motion.matches)paint(0);};
  const leave=()=>{pointer.x=-2000;pointer.y=-2000;if(paused||motion.matches)paint(0);};
  const scroll=()=>{if(paused||motion.matches)paint(0);};
  const change=()=>{cancelAnimationFrame(frame);if(!paused&&!motion.matches)frame=requestAnimationFrame(loop);else paint(0);};
  resize();change();window.addEventListener('resize',resize);window.addEventListener('pointermove',move);window.addEventListener('blur',leave);document.addEventListener('pointerleave',leave);window.addEventListener('scroll',scroll,{passive:true});motion.addEventListener('change',change);
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('resize',resize);window.removeEventListener('pointermove',move);window.removeEventListener('blur',leave);document.removeEventListener('pointerleave',leave);window.removeEventListener('scroll',scroll);motion.removeEventListener('change',change);};
 },[paused]);
 return <canvas ref={ref} className="starfield" aria-hidden="true"/>;
}
