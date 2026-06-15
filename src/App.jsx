import { useState } from "react";

// 🌿 DATABASE COMPLETO
const plantDB = [
  { nome: "Monstera", giorniAcqua: 7 },
  { nome: "Snake Plant", giorniAcqua: 10 },
  { nome: "Parlor Palm", giorniAcqua: 5 },
  { nome: "Pothos", giorniAcqua: 6 },
  { nome: "Aloe Vera", giorniAcqua: 12 },

  { nome: "Calathea", giorniAcqua: 5 },
  { nome: "Zamioculcas", giorniAcqua: 20 },
  { nome: "Dracaena", giorniAcqua: 12 },
  { nome: "Cactus", giorniAcqua: 25 },
  { nome: "Orchidea", giorniAcqua: 7 },
  { nome: "Begonia", giorniAcqua: 6 },
  { nome: "Anthurium", giorniAcqua: 7 },
  { nome: "Kentia", giorniAcqua: 14 },
  { nome: "Schefflera", giorniAcqua: 10 },
  { nome: "Tradescantia", giorniAcqua: 6 },
  { nome: "Peperomia", giorniAcqua: 8 },
  { nome: "Fittonia", giorniAcqua: 4 },
  { nome: "Dieffenbachia", giorniAcqua: 7 },
  { nome: "Aglaonema", giorniAcqua: 10 },
  { nome: "Hoya", giorniAcqua: 9 },
  { nome: "Ficus Lyrata", giorniAcqua: 8 },
  { nome: "Bonsai", giorniAcqua: 6 },
  { nome: "Coleus", giorniAcqua: 5 },
  { nome: "Lavanda", giorniAcqua: 12 },
  { nome: "Rosmarino", giorniAcqua: 10 },
  { nome: "Basilico", giorniAcqua: 3 },
  { nome: "Salvia", giorniAcqua: 7 },
  { nome: "Timo", giorniAcqua: 8 },
  { nome: "Mentha", giorniAcqua: 4 },
  { nome: "Edera", giorniAcqua: 7 },
  { nome: "Philodendron", giorniAcqua: 7 },
  { nome: "Maranta", giorniAcqua: 5 },
  { nome: "Pilea", giorniAcqua: 6 },
  { nome: "Alocasia", giorniAcqua: 6 },
  { nome: "Oxalis", giorniAcqua: 5 },
  { nome: "Croton", giorniAcqua: 7 },
  { nome: "Cyclamen", giorniAcqua: 6 },
  { nome: "Geranio", giorniAcqua: 5 },
  { nome: "Petunia", giorniAcqua: 4 },
  { nome: "Surfinia", giorniAcqua: 4 },
  { nome: "Impatiens", giorniAcqua: 4 },
  { nome: "Chlorophytum", giorniAcqua: 7 },
  { nome: "Aspidistra", giorniAcqua: 14 },
  { nome: "Kalanchoe", giorniAcqua: 10 },
  { nome: "Sedum", giorniAcqua: 14 },
  { nome: "Spider Plant", giorniAcqua: 6 },
  { nome: "Peace Lily", giorniAcqua: 5 },
  { nome: "Rubber Plant", giorniAcqua: 9 },
  { nome: "Jade Plant", giorniAcqua: 12 },
  { nome: "Areca Palm", giorniAcqua: 8 },
  { nome: "Boston Fern", giorniAcqua: 5 },
  { nome: "English Ivy", giorniAcqua: 7 },
  { nome: "Money Tree", giorniAcqua: 8 },
  { nome: "Air Plant", giorniAcqua: 5 },
  { nome: "Chinese Evergreen", giorniAcqua: 9 }
];

// 📸 immagini automatiche
const getPlantImage = (nome) => {
  const images = {
    Monstera: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
    "Snake Plant": "https://images.unsplash.com/photo-1593691509543-c55fb32d8de5",
    "Parlor Palm": "https://images.unsplash.com/photo-1615874959474-d609969a20ed",
    Pothos: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b",
    "Aloe Vera": "https://images.unsplash.com/photo-1587049352846-4a222e784d38",
  };

  return (
    images[nome] ||
    `https://source.unsplash.com/400x400/?${nome},plant`
  );
};

export default function App() {
  const [miePiante, setMiePiante] = useState([]);
  const [tab, setTab] = useState("mie");

  return (
    <div style={{ padding: 20, maxWidth: 420, margin: "auto" }}>
      
      <h1>Casa Verde 🌿</h1>

      {/* MENU */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        {["mie", "plantario", "todo"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1,
              margin: "0 5px",
              padding: 10,
              borderRadius: 10,
              background: tab === t ? "#2D6A4F" : "#eee",
              color: tab === t ? "white" : "black",
              border: "none",
            }}
          >
            {t === "mie"
              ? "Le tue piante"
              : t === "plantario"
              ? "Plantario"
              : "To‑Do"}
          </button>
        ))}
      </div>

      {/* MIE PIANTE */}
      {tab === "mie" && (
        <>
          <h2>Le tue piante</h2>

          {miePiante.map((p, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 10,
                padding: 10,
                border: "1px solid #ddd",
                borderRadius: 10,
                marginTop: 10,
                alignItems: "center",
              }}
            >
              <img
                src={p.img}
                style={{ width: 60, height: 60, borderRadius: 10 }}
              />

              <div style={{ flex: 1 }}>
                <b>{p.nome}</b>
                <p>💧 ogni {p.giorniAcqua} giorni</p>
              </div>
            </div>
          ))}
        </>
      )}

      {/* PLANTARIO */}
      {tab === "plantario" && (
        <>
          <h2>Plantario</h2>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {plantDB.map((p, i) => (
              <div
                key={i}
                style={{
                  width: "45%",
                  border: "1px solid #ddd",
                  borderRadius: 10,
                  padding: 10,
                  textAlign: "center",
                }}
              >
                <img
                  src={getPlantImage(p.nome)}
                  style={{ width: "100%", borderRadius: 10 }}
                />

                <div>{p.nome}</div>

                <button
                  onClick={() => {
                    setMiePiante((prev) => {
                      if (prev.some((x) => x.nome === p.nome)) return prev;
                      return [
                        ...prev,
                        { ...p, img: getPlantImage(p.nome) }
                      ];
                    });
                  }}
                >
                  ➕ Aggiungi
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* TODO */}
      {tab === "todo" && (
        <>
          <h2>To‑Do</h2>

          {miePiante.map((p, i) => (
            <div key={i} style={{ marginTop: 10 }}>
              {p.nome} → tra {p.giorniAcqua} giorni
            </div>
          ))}
        </>
      )}
    </div>
  );
}

