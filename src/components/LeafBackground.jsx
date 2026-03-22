// src/components/LeafBackground.jsx
import "./LeafBackground.css";

const LEAVES = [
  { id: 1,  emoji: "🍂", size: 28, left: "5%",  delay: 0,    dur: 12 },
  { id: 2,  emoji: "🍁", size: 22, left: "12%", delay: 2,    dur: 14 },
  { id: 3,  emoji: "🍃", size: 32, left: "20%", delay: 5,    dur: 10 },
  { id: 4,  emoji: "🍂", size: 18, left: "30%", delay: 1,    dur: 16 },
  { id: 5,  emoji: "🍁", size: 26, left: "40%", delay: 7,    dur: 11 },
  { id: 6,  emoji: "🍃", size: 20, left: "52%", delay: 3,    dur: 15 },
  { id: 7,  emoji: "🍂", size: 30, left: "63%", delay: 9,    dur: 13 },
  { id: 8,  emoji: "🍁", size: 24, left: "72%", delay: 4,    dur: 17 },
  { id: 9,  emoji: "🍃", size: 16, left: "80%", delay: 6,    dur: 9  },
  { id: 10, emoji: "🍂", size: 34, left: "88%", delay: 0.5,  dur: 18 },
  { id: 11, emoji: "🍁", size: 20, left: "95%", delay: 8,    dur: 12 },
  { id: 12, emoji: "🍃", size: 28, left: "8%",  delay: 11,   dur: 14 },
  { id: 13, emoji: "🍂", size: 22, left: "35%", delay: 13,   dur: 10 },
  { id: 14, emoji: "🍁", size: 18, left: "58%", delay: 15,   dur: 16 },
  { id: 15, emoji: "🍃", size: 26, left: "76%", delay: 10,   dur: 11 },
  { id: 16, emoji: "🍂", size: 14, left: "25%", delay: 12,   dur: 20 },
  { id: 17, emoji: "🍁", size: 30, left: "48%", delay: 3.5,  dur: 13 },
  { id: 18, emoji: "🍃", size: 22, left: "90%", delay: 17,   dur: 15 },
];

function LeafBackground() {
  return (
    <div className="leaf-bg" aria-hidden="true">
      {LEAVES.map((leaf) => (
        <span
          key={leaf.id}
          className="leaf"
          style={{
            left: leaf.left,
            fontSize: `${leaf.size}px`,
            animationDelay: `${leaf.delay}s`,
            animationDuration: `${leaf.dur}s`,
          }}
        >
          {leaf.emoji}
        </span>
      ))}
    </div>
  );
}

export default LeafBackground;
