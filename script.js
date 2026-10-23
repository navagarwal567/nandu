"use strict";
const $=s=>document.querySelector(s), screenEl=$("#screen"),step=$("#stepLabel"),sound=$("#soundButton"),soundIcon=$("#soundIcon"),soundLabel=$("#soundLabel"),toast=$("#toast");
const audio={ambience:new Audio("assets/audio/ambience.wav"),click:new Audio("assets/audio/click.mp3"),success:new Audio("assets/audio/success.mp3"),birthday:new Audio("assets/audio/birthday.mp3")};
audio.ambience.loop=true;audio.ambience.volume=.12;audio.click.volume=.25;audio.success.volume=.45;audio.birthday.volume=.62;
let soundOn=false,toastTimer,countdownTimer,opened=new Set();
function play(name){if(!soundOn)return;const a=audio[name];if(!a)return;a.pause();a.currentTime=0;a.play().catch(()=>{});}
function toastMsg(text){toast.textContent=text;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2100);}
sound.addEventListener("click",async()=>{if(soundOn){audio.ambience.pause();soundOn=false;sound.setAttribute("aria-pressed","false");soundIcon.textContent="♩";soundLabel.textContent="SOUND OFF";return;}try{await audio.ambience.play();soundOn=true;sound.setAttribute("aria-pressed","true");soundIcon.textContent="♫";soundLabel.textContent="SOUND ON";toastMsg("Birthday soundtrack: on.");}catch{toastMsg("Audio couldn't start. Check assets/audio.");}});
function render(html,label){step.textContent=label;screenEl.innerHTML=html;screenEl.classList.remove("screen-arrive");void screenEl.offsetWidth;screenEl.classList.add("screen-arrive");window.scrollTo({top:0,behavior:"smooth"});}
function welcome(){
 clearInterval(countdownTimer);
 opened.clear();
 render('<div class="case-cover"><p class="eyebrow">A VERY IMPORTANT INVESTIGATION · 31 OCT</p><div class="case-stamp">CASE<br><b>31/10</b></div><h1 class="headline">THE MOMO<br><em>FILE</em></h1><p class="intro-copy">A tiny birthday investigation into one extremely suspicious question:<br><strong>why is today all about Momo?</strong></p><div class="birthday-countdown" id="birthdayCountdown"><span class="countdown-title">COUNTDOWN TO THE BIG DAY</span><div class="countdown-units"><div><b id="cdDays">00</b><small>DAYS</small></div><div><b id="cdHours">00</b><small>HRS</small></div><div><b id="cdMinutes">00</b><small>MIN</small></div><div><b id="cdSeconds">00</b><small>SEC</small></div></div></div><div class="case-meta"><span>SUBJECT: MOMO</span><span>OCCASION: BIRTHDAY</span><span>STATUS: CAKE REQUIRED</span></div><div class="button-row"><button class="primary-button" id="openFile">OPEN THE CASE FILE <span class="arrow">↗</span></button></div><p class="hint">NO TEST · NO TRICKS · JUST A LITTLE BIRTHDAY SURPRISE</p></div>',"CASE FILE · 31 OCT");
 $("#openFile").addEventListener("click",openCase);
 updateCountdown();countdownTimer=setInterval(updateCountdown,1000);
}
function updateCountdown(){
 const box=$("#birthdayCountdown");if(!box)return;
 const now=new Date(),target=new Date(now.getFullYear(),9,31,0,0,0),remaining=Math.max(0,target-now);
 if(remaining===0){box.innerHTML='<span class="countdown-arrived">IT’S BIRTHDAY TIME ✦</span>';clearInterval(countdownTimer);return;}
 const total=Math.floor(remaining/1000),values={cdDays:Math.floor(total/86400),cdHours:Math.floor(total%86400/3600),cdMinutes:Math.floor(total%3600/60),cdSeconds:total%60};
 Object.keys(values).forEach(id=>{const el=$("#"+id);if(el)el.textContent=String(values[id]).padStart(2,"0");});
}
const evidence=[
 {tag:"FILE 01 · ORIGIN STORY",icon:"✳",title:"The group-chat incident",copy:"The year was 2024. The setting: a group chat. The beginning looked completely ordinary. Then the conversations got their own little side plot—and somehow, the story got personal."},
 {tag:"FILE 02 · CHAT LOGS",icon:"↻",title:"The surprise comeback",copy:"The chat history has had pauses, restarts, and surprise new episodes. Basically a series with unpredictable release dates. Somehow, the conversation keeps finding its way back."},
 {tag:"FILE 03 · STATUS UPDATE",icon:"♡",title:"No secret friendship quiz",copy:"Current status: friends. There is no hidden test, no answer key, and no dramatic question at the end. Just the honest fact: you are a friend he genuinely values."},
 {tag:"FILE 04 · DATE ANOMALY",icon:"☾",title:"Birthday: October 31",copy:"A birthday on Halloween? Suspiciously excellent calendar placement. It arrives with built-in spooky vibes, a free excuse for extra cake, and absolutely no need to share the spotlight."},
 {tag:"FILE 05 · WITNESS NOTE",icon:"✎",title:"A small honest thing",copy:"A plain 'happy birthday' text would have done the job. Instead, someone made you a whole case file. The evidence suggests: you matter to him, and he hopes this makes you smile."}
];
function openCase(){clearInterval(countdownTimer);showEvidencePage(0);}
function showEvidencePage(index){
 const item=evidence[index],number="0"+(index+1),isOpen=opened.has(String(index));
 const dots=evidence.map((_,i)=>'<span class="page-dot '+(i<=index?'active':'')+'"></span>').join("");
 render('<div class="file-page"><p class="eyebrow">CASE NOTES · PERSONAL ARCHIVE</p><div class="file-progress"><span>FILE '+number+' / '+evidence.length+'</span><div class="page-dots">'+dots+'</div><span>'+Math.round((index+1)/evidence.length*100)+'%</span></div><article class="dossier-page"><div class="dossier-top"><span>'+item.tag+'</span><span class="paperclip">✳</span></div><div class="dossier-icon">'+item.icon+'</div><h1 class="headline small-headline">'+item.title+'</h1><div class="redaction '+(isOpen?'unsealed':'')+'"><p>'+item.copy+'</p></div><div class="dossier-stamp '+(isOpen?'visible':'')+'">VERIFIED<br>BY FRIEND</div><button class="reveal-button" id="reveal">'+(isOpen?'EVIDENCE VERIFIED ✓':'UNSEAL THIS PAGE ↗')+'</button><p class="dossier-foot">MOMO BIRTHDAY FILE · OCTOBER 31</p></article><div class="page-nav"><button class="secondary-button" id="previous" '+(index===0?'disabled':'')+'>← PREVIOUS</button><span>PAGE '+number+' OF '+evidence.length+'</span><button class="primary-button" id="next" '+(isOpen?'':'disabled')+'>'+(index===evidence.length-1?'OPEN THE LETTER':'NEXT PAGE →')+'</button></div><p class="hint">TAP TO UNSEAL EACH NOTE · TAKE YOUR TIME</p></div>',"CASE NOTES · PAGE "+number);
 $("#previous").onclick=()=>{if(index>0)showEvidencePage(index-1);};
 $("#reveal").onclick=()=>{if(opened.has(String(index)))return;opened.add(String(index));play("click");showEvidencePage(index);if(opened.size===evidence.length)play("success");};
 $("#next").onclick=()=>{if(!opened.has(String(index)))return;if(index<evidence.length-1)showEvidencePage(index+1);else showLetter();};
}
function showLetter(){
 const copy="Momo,\n\nHappy birthday! I'm really glad our paths crossed. I don't always know how to explain it, but you're someone I care about and genuinely value as a friend. Even with the random pauses and restarts, I'm glad we still find our way back to a conversation.\n\nI hope this year brings you laughter, peaceful days, good people, and cake that's actually worth the calories. No dramatic speech or expectations—just a sincere wish that you have a lovely birthday and feel celebrated today.";
 render('<div class="letter-scene"><p class="eyebrow">SEALED PERSONAL NOTE · OPENED</p><h1 class="headline small-headline">From your<br><em>friend.</em></h1><div class="letter-paper"><p class="letter-label">PRIVATE TRANSMISSION · FOR MOMO</p><p class="letter-copy">'+copy+'</p><p class="letter-signoff">— Dushyant</p></div><div class="button-row"><button class="primary-button" id="closeCase">CLOSE THE CASE <span class="arrow">↗</span></button></div></div>',"PERSONAL NOTE · 001");
 $("#closeCase").addEventListener("click",celebrate);
}
function celebrate(){
 if(soundOn){audio.ambience.pause();audio.birthday.currentTime=0;audio.birthday.play().catch(()=>{});}
 render('<div class="celebration"><p class="eyebrow">OFFICIAL CASE VERDICT</p><div class="celebration-seal">✳</div><h1 class="headline">GUILTY OF<br><em>being celebrated.</em></h1><p class="intro-copy">Sentence: one lovely birthday, unlimited cake, and absolutely no boring day allowed.</p><div class="verdict-card"><span>CASE STATUS</span><strong>HAPPY BIRTHDAY, MOMO!</strong><span>THIS FRIENDSHIP FILE IS CLOSED (UNTIL NEXT CHAT)</span></div><div class="button-row"><button class="secondary-button" id="replay">READ IT AGAIN ↻</button></div><p class="hint">MADE WITH CARE · ZERO EXPECTATIONS ATTACHED</p></div>',"CASE CLOSED · BIRTHDAY APPROVED");
 $("#replay").addEventListener("click",welcome);
}
welcome();





