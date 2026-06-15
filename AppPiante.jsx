import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// 🌿 DATABASE PIANTE
const plantDB = [
{ nome:"Monstera",giorniAcqua:8,luce:"indiretta"},
{ nome:"Sansevieria",giorniAcqua:18,luce:"bassa"},
{ nome:"Pothos",giorniAcqua:7,luce:"media"},
{ nome:"Ficus",giorniAcqua:10,luce:"indiretta"},
{ nome:"Calathea",giorniAcqua:5,luce:"bassa"},
{ nome:"Zamioculcas",giorniAcqua:20,luce:"bassa"},
{ nome:"Dracaena",giorniAcqua:12,luce:"media"},
{ nome:"Aloe Vera",giorniAcqua:15,luce:"diretta"},
{ nome:"Cactus",giorniAcqua:25,luce:"diretta"},
{ nome:"Orchidea",giorniAcqua:7,luce:"indiretta"},
{ nome:"Begonia",giorniAcqua:6,luce:"indiretta"},
{ nome:"Anthurium",giorniAcqua:7,luce:"indiretta"},
{ nome:"Kentia",giorniAcqua:14,luce:"media"},
{ nome:"Schefflera",giorniAcqua:10,luce:"media"},
{ nome:"Tradescantia",giorniAcqua:6,luce:"media"},
{ nome:"Peperomia",giorniAcqua:8,luce:"bassa"},
{ nome:"Fittonia",giorniAcqua:4,luce:"bassa"},
{ nome:"Dieffenbachia",giorniAcqua:7,luce:"media"},
{ nome:"Aglaonema",giorniAcqua:10,luce:"bassa"},
{ nome:"Hoya",giorniAcqua:9,luce:"indiretta"},
{ nome:"Ficus Lyrata",giorniAcqua:8,luce:"indiretta"},
{ nome:"Bonsai",giorniAcqua:6,luce:"media"},
{ nome:"Coleus",giorniAcqua:5,luce:"diretta"},
{ nome:"Lavanda",giorniAcqua:12,luce:"diretta"},
{ nome:"Rosmarino",giorniAcqua:10,luce:"diretta"},
{ nome:"Basilico",giorniAcqua:3,luce:"diretta"},
{ nome:"Salvia",giorniAcqua:7,luce:"diretta"},
{ nome:"Timo",giorniAcqua:8,luce:"diretta"},
{ nome:"Mentha",giorniAcqua:4,luce:"media"},
{ nome:"Edera",giorniAcqua:7,luce:"media"},
{ nome:"Philodendron",giorniAcqua:7,luce:"indiretta"},
{ nome:"Maranta",giorniAcqua:5,luce:"bassa"},
{ nome:"Pilea",giorniAcqua:6,luce:"media"},
{ nome:"Alocasia",giorniAcqua:6,luce:"indiretta"},
{ nome:"Oxalis",giorniAcqua:5,luce:"media"},
{ nome:"Croton",giorniAcqua:7,luce:"diretta"},
{ nome:"Cyclamen",giorniAcqua:6,luce:"indiretta"},
{ nome:"Geranio",giorniAcqua:5,luce:"diretta"},
{ nome:"Petunia",giorniAcqua:4,luce:"diretta"},
{ nome:"Surfinia",giorniAcqua:4,luce:"diretta"},
{ nome:"Impatiens",giorniAcqua:4,luce:"bassa"},
{ nome:"Chlorophytum",giorniAcqua:7,luce:"media"},
{ nome:"Aspidistra",giorniAcqua:14,luce:"bassa"},
{ nome:"Kalanchoe",giorniAcqua:10,luce:"diretta"},
{ nome:"Sedum",giorniAcqua:14,luce:"diretta"},
{ nome:"Spider Plant",giorniAcqua:6,luce:"media"},
{ nome:"Peace Lily",giorniAcqua:5,luce:"bassa"},
{ nome:"Rubber Plant",giorniAcqua:9,luce:"indiretta"},
{ nome:"Jade Plant",giorniAcqua:12,luce:"diretta"},
{ nome:"Areca Palm",giorniAcqua:8,luce:"media"},
{ nome:"Parlor Palm",giorniAcqua:10,luce:"bassa"},
{ nome:"Boston Fern",giorniAcqua:5,luce:"bassa"},
{ nome:"English Ivy",giorniAcqua:7,luce:"media"},
{ nome:"Money Tree",giorniAcqua:8,luce:"indiretta"},
{ nome:"Air Plant",giorniAcqua:5,luce:"indiretta"},
{ nome:"Chinese Evergreen",giorniAcqua:9,luce:"bassa"},
{ nome:"Prayer Plant",giorniAcqua:6,luce:"bassa"},
{ nome:"Fiddle Leaf Fig",giorniAcqua:7,luce:"indiretta"},
{ nome:"String of Pearls",giorniAcqua:12,luce:"diretta"},
{ nome:"Bird of Paradise",giorniAcqua:10,luce:"diretta"},
{ nome:"Bamboo Palm",giorniAcqua:9,luce:"media"},
{ nome:"Maidenhair Fern",giorniAcqua:5,luce:"bassa"},
{ nome:"Cast Iron Plant",giorniAcqua:14,luce:"bassa"},
{ nome:"Lucky Bamboo",giorniAcqua:7,luce:"media"}
];

// 🔍 MATCH PIANTA
const matchPianta = (nomeAI) =>
  plantDB.find(p => nomeAI?.toLowerCase().includes(p.nome.toLowerCase()));

export default function AppPiante() {

  const [miePiante, setMiePiante] = useState([]);
  const [diagnosi, setDiagnosi] = useState(null);

  // salva in memoria
  useEffect(() => {
    const salvate = localStorage.getItem("miePiante");
    if (salvate) setMiePiante(JSON.parse(salvate));
  }, []);

  useEffect(() => {
    localStorage.setItem("miePiante", JSON.stringify(miePiante));
  }, [miePiante]);

  const analizzaSaluteAI = async (imageBase64) => {
    try {

      const res = await fetch("https://plantome.onrender.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageBase64 }),
      });

      const data = await res.json();

      let parsed;
      try {
        parsed = JSON.parse(data.choices[0].message.content);
      } catch {
        throw new Error();
      }

      const match = matchPianta(parsed.nome);

      const risultato = {
        ...parsed,
        nome: match ? match.nome : parsed.nome,
        giorniAcqua: match?.giorniAcqua,
        luce: match?.luce
      };

      setDiagnosi(risultato);

      setMiePiante(prev => {

        if (prev.some(p => p.nome === risultato.nome)) return prev;

        return [
          ...prev,
          {
            ...risultato,
            img: imageBase64,
            lastWater: Date.now()
          }
        ];
      });

    } catch {
      setDiagnosi({
        nome: "Errore",
        problema: "Non riconosciuta"
      });
    }
  };

  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => analizzaSaluteAI(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-4">

      <h1>🌿 Plant Care AI</h1>

      <input type="file" onChange={handleFoto} />

      {diagnosi && (
        <Card className="mt-2">
          <CardContent>
            <p><b>{diagnosi.nome}</b></p>
            <p>{diagnosi.problema}</p>
          </CardContent>
        </Card>
      )}

      {miePiante.map((p, i) => (
        <Card key={i} className="mt-2">
          <CardContent>

            {p.img && <img src={p.img} className="mb-2" />}

            <p>{p.nome}</p>
            <p>💧 {p.giorniAcqua ? `ogni ${p.giorniAcqua} giorni` : "n/d"}</p>

            <Button
              onClick={() => {
                setMiePiante(prev =>
                  prev.map((item, idx) =>
                    idx === i
                      ? { ...item, lastWater: Date.now() }
                      : item
                  )
                );
              }}
            >
              ✅ Annaffiato
            </Button>

          </CardContent>
        </Card>
      ))}

    </div>
  );
}

