import { useState } from "react";

// 🌿 DATABASE COMPLETO
const plantDB = [
  { nome: "Monstera", giorniAcqua: 7, luce: "indiretta" },
  { nome: "Snake Plant", giorniAcqua: 10, luce: "bassa" },
  { nome: "Parlor Palm", giorniAcqua: 5, luce: "media" },
  { nome: "Pothos", giorniAcqua: 6, luce: "indiretta" },
  { nome: "Aloe Vera", giorniAcqua: 12, luce: "diretta" },

  { nome: "Calathea", giorniAcqua: 5, luce: "bassa" },
  { nome: "Zamioculcas", giorniAcqua: 20, luce: "bassa" },
  { nome: "Dracaena", giorniAcqua: 12, luce: "media" },
  { nome: "Cactus", giorniAcqua: 25, luce: "diretta" },
  { nome: "Orchidea", giorniAcqua: 7, luce: "indiretta" },
  { nome: "Begonia", giorniAcqua: 6, luce: "indiretta" },
  { nome: "Anthurium", giorniAcqua: 7, luce: "indiretta" },
  { nome: "Kentia", giorniAcqua: 14, luce: "media" },
  { nome: "Schefflera", giorniAcqua: 10, luce: "media" },
  { nome: "Tradescantia", giorniAcqua: 6, luce: "media" },
  { nome: "Peperomia", giorniAcqua: 8, luce: "bassa" },
  { nome: "Fittonia", giorniAcqua: 4, luce: "bassa" },
  { nome: "Dieffenbachia", giorniAcqua: 7, luce: "media" },
  { nome: "Aglaonema", giorniAcqua: 10, luce: "bassa" },
  { nome: "Hoya", giorniAcqua: 9, luce: "indiretta" },
  { nome: "Ficus Lyrata", giorniAcqua: 8, luce: "indiretta" },
  { nome: "Bonsai", giorniAcqua: 6, luce: "media" },
  { nome: "Coleus", giorniAcqua: 5, luce: "diretta" },
  { nome: "Lavanda", giorniAcqua: 12, luce: "diretta" },
  { nome: "Rosmarino", giorniAcqua: 10, luce: "diretta" },
  { nome: "Basilico", giorniAcqua: 3, luce: "diretta" },
  { nome: "Salvia", giorniAcqua: 7, luce: "diretta" },
  { nome: "Timo", giorniAcqua: 8, luce: "diretta" },
  { nome: "Mentha", giorniAcqua: 4, luce: "media" },
  { nome: "Edera", giorniAcqua: 7, luce: "media" },
  { nome: "Philodendron", giorniAcqua: 7, luce: "indiretta" },
  { nome: "Maranta", giorniAcqua: 5, luce: "bassa" },
  { nome: "Pilea", giorniAcqua: 6, luce: "media" },
  { nome: "Alocasia", giorniAcqua: 6, luce: "indiretta" },
  { nome: "Oxalis", giorniAcqua: 5, luce: "media" },
  { nome: "Croton", giorniAcqua: 7, luce: "diretta" },
  { nome: "Cyclamen", giorniAcqua: 6, luce: "indiretta" },
  { nome: "Geranio", giorniAcqua: 5, luce: "diretta" },
  { nome: "Petunia", giorniAcqua: 4, luce: "diretta" },
  { nome: "Surfinia", giorniAcqua: 4, luce: "diretta" },
  { nome: "Impatiens", giorniAcqua: 4, luce: "bassa" },
  { nome: "Chlorophytum", giorniAcqua: 7, luce: "media" },
  { nome: "Aspidistra", giorniAcqua: 14, luce: "bassa" },
  { nome: "Kalanchoe", giorniAcqua: 10, luce: "diretta" },
  { nome: "Sedum", giorniAcqua: 14, luce: "diretta" },
  { nome: "Spider Plant", giorniAcqua: 6, luce: "media" },
  { nome: "Peace Lily", giorniAcqua: 5, luce: "bassa" },
  { nome: "Rubber Plant", giorniAcqua: 9, luce: "indiretta" },
  { nome: "Jade Plant", giorniAcqua: 12, luce: "diretta" },
  { nome: "Areca Palm", giorniAcqua: 8, luce: "media" },
  { nome: "Boston Fern", giorniAcqua: 5, luce: "bassa" },
  { nome: "English Ivy", giorniAcqua: 7, luce: "media" },
  { nome: "Money Tree", giorniAcqua: 8, luce: "indiretta" },
  { nome: "Air Plant", giorniAcqua: 5, luce: "indiretta" },
  { nome: "Chinese Evergreen", giorniAcqua: 9, luce: "bassa" }
];
``

// 🔍 MATCH PIANTA
const matchPianta = (nomeAI) =>
  plantDB.find((p) =>
    nomeAI?.toLowerCase().includes(p.nome.toLowerCase())
  );

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
  const [diagnosi, setDiagnosi] = useState(null);

  const analizza = async (imageBase64) => {
    try {
      const res = await fetch(
        "https://plantome.onrender.com/api/analizza",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64 }),
        }
      );

      const data = await res.json();
      const parsed = JSON.parse(data.choices[0].message.content);

      const match = matchPianta(parsed.nome);

      const nuova = {
        nome: match ? match.nome : parsed.nome,
        giorniAcqua: match?.giorniAcqua,
      };

      setDiagnosi(nuova);
      setMiePiante((prev) => [...prev, nuova]);
    } catch {
      alert("Errore AI");
    }
  };

  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => analizza(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ background: "#F4EFE6", minHeight: "100vh", padding: 20 }}>
      <div
        style={{
          maxWidth: 420,
          margin: "auto",
          background: "#fff",
          borderRadius: 25,
          padding: 20,
        }}
      >
        {/* HEADER */}
        <h1 style={{ textAlign: "center", marginBottom: 20 }}>
          Casa Verde 🌿
        </h1>

        {/* MENU */}
        <div style={{ display: "flex", gap: 15, marginBottom: 20 }}>
          <button onClick={() => setTab("mie")}>Le tue piante</button>
          <button onClick={() => setTab("plantario")}>Plantario</button>
          <button onClick={() => setTab("todo")}>To‑Do</button>
        </div>

        {/* BOTTONE FOTO */}
        <label
          style={{
            display: "block",
            background: "#2D6A4F",
            color: "white",
            padding: 12,
            borderRadius: 20,
            textAlign: "center",
            marginBottom: 20,
            cursor: "pointer",
          }}
        >
          📸 Scatta foto
          <input type="file" hidden onChange={handleFoto} />
        </label>

        {/* DIAGNOSI */}
        {diagnosi && (
          <div
            style={{
              background: "#E9F5EC",
              padding: 10,
              borderRadius: 10,
              marginBottom: 20,
            }}
          >
            ✅ {diagnosi.nome} aggiunta
          </div>
        )}

        {/* SEZIONE MIE PIANTE */}
        {tab === "mie" && (
          <>
            <h2>Le tue piante</h2>

            {miePiante.map((p, i) => (
              <div
                key={i}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 15,
                  padding: 12,
                  marginTop: 10,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <b>{p.nome}</b>
                  <p style={{ fontSize: 12 }}>
                    💧 ogni {p.giorniAcqua || "?"} giorni
                  </p>
                </div>

                <div
                  style={{
                    background: "#E8E6D9",
                    padding: "5px 10px",
                    borderRadius: 10,
                  }}
                >
                  tra {p.giorniAcqua} giorni
                </div>
              </div>
            ))}
          </>
        )}

       {/* SEZIONE PLANTARIO */}
{tab === "plantario" && (
  <>
    <h2>Plantario</h2>

    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      {plantDB.map((p, i) => (
        <div
          key={i}
          style={{
            border: "1px solid #ddd",
            borderRadius: 12,
            padding: 10,
            width: "45%",
            textAlign: "center",
          }}
        >
          <img
            src={getPlantImage(p.nome)}
            style={{ width: "100%", borderRadius: 10 }}
            alt={p.nome}
          />

          <div>{p.nome}</div>

          <button
            style={{ marginTop: 5 }}
            onClick={() => {
              setMiePiante((prev) => {
                if (prev.some((x) => x.nome === p.nome)) return prev;
                return [...prev, { ...p, img: getPlantImage(p.nome) }];
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


        {/* SEZIONE TODO */}
        {tab === "todo" && (
          <>
            <h2>To‑Do</h2>

           {miePiante.map((p, i) => (
  <div
    key={i}
    style={{
      border: "1px solid #ddd",
      borderRadius: 15,
      padding: 12,
      marginTop: 10,
      display: "flex",
      gap: 10,
      alignItems: "center",
    }}
  >
    {p.img && (
      <img
        src={p.img}
        style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 10 }}
        alt={p.nome}
      />
    )}

    <div style={{ flex: 1 }}>
      <b>{p.nome}</b>
      <p style={{ fontSize: 12 }}>
        💧 ogni {p.giorniAcqua || "?"} giorni
      </p>
    </div>

    <div
      style={{
        background: "#E8E6D9",
        padding: "5px 10px",
        borderRadius: 10,
      }}
    >
      tra {p.giorniAcqua} giorni
    </div>
  </div>
))}
          </>
        )}
      </div>
    </div>
  );
}

