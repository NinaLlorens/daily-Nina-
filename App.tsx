import { useState, useEffect } from "react";

const blocks = [
  {
    id:"matin", time:"7h30", emoji:"🌅", title:"Le réveil", alert:false,
    message:"Hey toi. Avant de vérifier ton téléphone, avant de penser au boulot — prends une seconde. Tu es là, c'est déjà quelque chose. Ton corps a besoin de carburant ce matin. Pas pour être parfaite. Juste pour tenir debout et être présente.",
    highlight:"Hey toi.",
    tasks:[
      {icon:"🍳", label:"J'ai mangé quelque chose ce matin (oeufs, pain de mie, overnight oats...)"},
      {icon:"🎒", label:"J'ai mis une collation dans mon sac (fruit, barre céréale...)"},
      {icon:"💧", label:"Ma Stanley est dans mon sac"},
    ]
  },
  {
    id:"milieu_matin", time:"10h00", emoji:"☕", title:"Pause courte", alert:false,
    message:"Je sais que tu es dans le bain du boulot. Juste 2 minutes. Une gorgée d'eau. Une bouchée de ce que t'as mis dans ton sac ce matin. Ton cerveau va tourner mieux après, promis.",
    highlight:"Juste 2 minutes.",
    tasks:[
      {icon:"💧", label:"J'ai bu de l'eau"},
      {icon:"🍎", label:"J'ai mangé ma collation du matin"},
    ]
  },
  {
    id:"midi", time:"12h30", emoji:"🌿", title:"La pause de midi", alert:false,
    message:"Pose ton ordi. Vraiment. Même 20 minutes dehors, ça change tout. L'air frais, les pieds qui bougent — c'est pas du luxe, c'est de la maintenance. Ton cerveau le réclame.",
    highlight:"Pose ton ordi.",
    tasks:[
      {icon:"🍽️", label:"J'ai mangé un vrai repas à midi"},
      {icon:"🚶‍♀️", label:"Je suis sortie marcher un peu"},
      {icon:"💧", label:"J'ai bu pendant le repas"},
    ]
  },
  {
    id:"aprem", time:"15h30", emoji:"✨", title:"Le petit kiff de l'après-midi", alert:false,
    message:"La journée n'est pas finie mais toi tu as bossé. Tu mérites une pause. Ce n'est pas de la triche, ce n'est pas de l'excès — c'est exactement ce qu'il faut faire à cette heure-ci.",
    highlight:"Tu mérites une pause.",
    tasks:[
      {icon:"🍫", label:"J'ai mangé ma collation de l'après-midi"},
      {icon:"💧", label:"J'ai bu de l'eau"},
    ]
  },
  {
    id:"enfants", time:"17h15", emoji:"⚠️", title:"Zone difficile", alert:true,
    message:"Stop. Tu le sais toi-même : c'est l'heure où tout peut partir. Avant de sortir, mange quelque chose maintenant. Pas après. Maintenant. C'est pas négociable avec toi-même.",
    highlight:"Stop.",
    tasks:[
      {icon:"🥪", label:"J'ai mangé quelque chose AVANT de partir chercher les enfants"},
      {icon:"💧", label:"J'ai pris ma Stanley avec moi"},
      {icon:"🧘‍♀️", label:"J'ai respiré 3 fois avant de sortir"},
    ]
  },
  {
    id:"soir", time:"19h30", emoji:"🏠", title:"Le repas du soir", alert:false,
    message:"La maison, les enfants, le repas — tu portes beaucoup. Mange avec eux, mange bien. Pas parfait. Bien. Ce repas là, il compte vraiment pour la suite de ta soirée.",
    highlight:"Mange avec eux, mange bien.",
    tasks:[
      {icon:"🍽️", label:"J'ai mangé un repas avec les enfants"},
      {icon:"💧", label:"J'ai bu pendant le repas"},
    ]
  },
  {
    id:"nuit", time:"22h00", emoji:"🌙", title:"Ton moment à toi", alert:false,
    message:"Les enfants sont couchés. C'est TON espace maintenant. Un thé, un yaourt, quelque chose de doux. Pas une récompense — juste un moment de paix qui t'appartient.",
    highlight:"C'est TON espace maintenant.",
    tasks:[
      {icon:"🍵", label:"Je me suis fait un thé / un petit kiff du soir"},
      {icon:"🥣", label:"J'ai préparé mon petit déjeuner pour demain matin"},
    ]
  }
];

const motivations = [
  {max:0,   green:false, msg:"C'est un nouveau jour.", sub:"Peu importe hier — aujourd'hui tu recommences. Nouvelles habitudes pour de nouveaux résultats. 💛"},
  {max:25,  green:false, msg:"Tu as démarré.", sub:"C'est ça le plus dur, et tu l'as fait. Continue comme ça, une case à la fois."},
  {max:50,  green:false, msg:"Tu avances.", sub:"Chaque case cochée, c'est une nouvelle habitude qui s'installe. Tu vois ? Tu en es capable."},
  {max:75,  green:true,  msg:"Tu te choisis.", sub:"Plus de la moitié de ta journée prise en main. Nouvelles habitudes pour de nouveaux résultats. 🌿"},
  {max:99,  green:true,  msg:"Tu y es presque.", sub:"Tu es au top aujourd'hui. Continue, tu vas y arriver jusqu'au bout. 🌿"},
  {max:100, green:true,  msg:"100% — tu t'es choisie.", sub:"Nouvelles habitudes, nouveaux résultats. C'est exactement ça. 🌿"},
];

const missedMsgs = [
  "Quelques cases n'ont pas été cochées plus tôt — ce n'est pas un reproche. C'est juste un rappel doux : prendre ce temps pour toi, c'est indispensable. Tu t'en remercieras plus tard. 💛",
  "Des moments ont glissé en chemin — ça arrive. Ce n'est pas un échec, c'est un oubli. Tu mérites de prendre ce temps pour toi. Nouvelles habitudes pour de nouveaux résultats. 🌿",
];

const STORAGE_KEY = "nina_modedevie_v4";

function getTodayKey() { return new Date().toISOString().split("T")[0]; }

function getCurrentBlockId() {
  const h = new Date().getHours() + new Date().getMinutes() / 60;
  if (h < 10) return "matin";
  if (h < 12) return "milieu_matin";
  if (h < 15) return "midi";
  if (h < 17) return "aprem";
  if (h < 19) return "enfants";
  if (h < 21) return "soir";
  return "nuit";
}

function loadChecked() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const p = JSON.parse(raw);
    if (p.date !== getTodayKey()) return {};
    return p.checked || {};
  } catch { return {}; }
}

function saveChecked(c) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: getTodayKey(), checked: c }));
}

const days = ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];
const months = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];

export default function App() {
  const [checked, setChecked] = useState(() => loadChecked());
  const [openBlocks, setOpenBlocks] = useState(() => {
    const cur = getCurrentBlockId();
    return { [cur]: true };
  });

  useEffect(() => { saveChecked(checked); }, [checked]);

  const now = new Date();
  const dateLabel = `${days[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]}`;
  const currentId = getCurrentBlockId();

  const totalTasks = blocks.reduce((s, b) => s + b.tasks.length, 0);
  const doneTasks = blocks.reduce((s, b) => s + b.tasks.filter((_, i) => checked[`${b.id}_${i}`]).length, 0);
  const pct = totalTasks ? Math.round(doneTasks / totalTasks * 100) : 0;

  const motiv = [...motivations].reverse().find(m => pct <= m.max) || motivations[0];

  const currentIdx = blocks.findIndex(b => b.id === currentId);
  const hasMissed = pct > 0 && pct < 100 && blocks.slice(0, currentIdx).some(
    (b) => b.tasks.some((_, i) => !checked[`${b.id}_${i}`])
  );

  function toggle(blockId, i) {
    const key = `${blockId}_${i}`;
    setChecked(prev => ({ ...prev, [key]: !prev[key] }));
  }

  function toggleBlock(id) {
    setOpenBlocks(prev => ({ ...prev, [id]: !prev[id] }));
  }

  function reset() {
    setChecked({});
    setOpenBlocks({ [getCurrentBlockId()]: true });
  }

  const progressColor = pct > 50
    ? `linear-gradient(90deg, #F0C070 0%, #8FBC6A ${pct}%)`
    : `linear-gradient(90deg, #F0C070 0%, #D4923A ${pct}%)`;

  return (
    <div style={{ background: "#FDF6EC", minHeight: "100vh", paddingBottom: 80, fontFamily: "'DM Sans', sans-serif", color: "#2C1810" }}>

      {/* HEADER */}
      <div style={{ background: "linear-gradient(135deg, #D4923A 0%, #E8B060 50%, #D4923A 100%)", padding: "48px 24px 28px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
        <div style={{ display: "inline-block", background: "rgba(255,255,255,0.2)", color: "white", fontSize: 12, padding: "4px 14px", borderRadius: 20, marginBottom: 12 }}>{dateLabel}</div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "white", marginBottom: 4 }}>Ma journée 💛</div>
        <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, marginBottom: 16 }}>Nouvelles habitudes pour de nouveaux résultats</div>
        <div style={{ padding: "0 4px" }}>
          <div style={{ background: "rgba(255,255,255,0.25)", borderRadius: 10, height: 10, overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 10, background: progressColor, width: `${pct}%`, transition: "width 0.6s cubic-bezier(0.34,1.56,0.64,1)" }} />
          </div>
          <div style={{ color: "rgba(255,255,255,0.95)", fontSize: 13, marginTop: 8, fontWeight: 500 }}>
            {pct === 0 ? "Prête à démarrer ta journée ?" : pct === 100 ? "100% — Nouvelles habitudes, nouveaux résultats 🌿" : `${doneTasks} soin${doneTasks > 1 ? "s" : ""} pris · ${pct}% de ta journée`}
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 16px 0" }}>
        {/* MOTIVATION */}
        <div style={{ background: "white", borderRadius: 16, padding: "16px 20px", boxShadow: "0 2px 12px rgba(44,24,16,0.08)", borderLeft: `4px solid ${motiv.green ? "#5A8A6A" : "#D4923A"}`, fontSize: 14, lineHeight: 1.6, color: "#7A6050", fontStyle: "italic" }}>
          <span style={{ color: motiv.green ? "#5A8A6A" : "#D4923A", fontStyle: "normal", fontWeight: 600 }}>{motiv.msg} </span>
          {motiv.sub}
        </div>

        {/* MISSED */}
        {hasMissed && (
          <div style={{ marginTop: 10, background: "#FFFBF0", borderRadius: 14, padding: "13px 18px", borderLeft: "4px solid #F0C070", fontSize: 13, lineHeight: 1.6, color: "#7A6050", fontStyle: "italic" }}>
            {missedMsgs[Math.floor(Date.now() / 86400000) % missedMsgs.length]}
          </div>
        )}
      </div>

      {/* BLOCKS */}
      <div style={{ padding: "16px 16px" }}>
        {blocks.map(b => {
          const isOpen = !!openBlocks[b.id];
          const isCurrent = b.id === currentId;
          const allDone = b.tasks.every((_, i) => checked[`${b.id}_${i}`]);
          const borderColor = b.alert ? "#C0392B" : isCurrent ? "#D4923A" : "transparent";

          return (
            <div key={b.id} style={{ background: "#FFFAF3", borderRadius: 20, marginBottom: 14, boxShadow: "0 2px 12px rgba(44,24,16,0.08)", border: `2px solid ${borderColor}`, opacity: allDone ? 0.65 : 1 }}>
              <div onClick={() => toggleBlock(b.id)} style={{ padding: "16px 18px 12px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", userSelect: "none" }}>
                <span style={{ fontSize: 20 }}>{b.emoji}</span>
                <span style={{ background: b.alert ? "#C0392B" : "#D4923A", color: "white", fontSize: 11, fontWeight: 500, padding: "4px 10px", borderRadius: 12, whiteSpace: "nowrap" }}>{b.time}</span>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, flexGrow: 1 }}>{b.title}</span>
                {isCurrent && <span style={{ width: 8, height: 8, background: b.alert ? "#C0392B" : "#D4923A", borderRadius: "50%", flexShrink: 0, animation: "pulse 2s infinite" }} />}
                <span style={{ color: "#7A6050", fontSize: 11, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.25s" }}>▼</span>
              </div>

              {isOpen && (
                <div>
                  <div style={{ margin: "0 18px 14px", background: b.alert ? "#FDF0EE" : "linear-gradient(135deg,#FFF8EC,#FFF3E0)", borderLeft: `3px solid ${b.alert ? "#C0392B" : "#F0C070"}`, borderRadius: 12, padding: "13px 15px", fontSize: 13.5, lineHeight: 1.7, color: "#7A6050", fontStyle: "italic" }}>
                    <span style={{ color: b.alert ? "#C0392B" : "#D4923A", fontStyle: "normal", fontWeight: 600 }}>{b.highlight} </span>
                    {b.message.replace(b.highlight, "").trim()}
                  </div>
                  <div style={{ padding: "0 18px 18px" }}>
                    {b.tasks.map((t, i) => {
                      const isChecked = !!checked[`${b.id}_${i}`];
                      return (
                        <div key={i} onClick={() => toggle(b.id, i)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: i < b.tasks.length - 1 ? "1px solid #F5E6CC" : "none", cursor: "pointer" }}>
                          <div style={{ width: 26, height: 26, borderRadius: 8, border: `2px solid ${isChecked ? "#5A8A6A" : "#F0C070"}`, background: isChecked ? "#5A8A6A" : "white", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
                            {isChecked && <span style={{ color: "white", fontSize: 14, fontWeight: "bold" }}>✓</span>}
                          </div>
                          <span style={{ fontSize: 18, flexShrink: 0 }}>{t.icon}</span>
                          <span style={{ fontSize: 13.5, color: isChecked ? "#7A6050" : "#2C1810", textDecoration: isChecked ? "line-through" : "none", lineHeight: 1.4, flexGrow: 1 }}>{t.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {pct === 100 && (
        <div style={{ textAlign: "center", padding: "24px 16px", fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#5A8A6A", lineHeight: 1.6 }}>
          🌿 Nouvelles habitudes,<br />nouveaux résultats.<br /><br />Tu t'es choisie aujourd'hui.<br />C'est exactement ça. 🌿
        </div>
      )}

      <button onClick={reset} style={{ display: "block", margin: "8px auto 0", background: "none", border: "1.5px solid #F0C070", color: "#D4923A", fontFamily: "'DM Sans', sans-serif", fontSize: 13, padding: "10px 28px", borderRadius: 20, cursor: "pointer" }}>
        🔄 Nouvelle journée
      </button>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
      `}</style>
    </div>
  );
}
