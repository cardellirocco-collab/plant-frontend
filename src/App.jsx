import { useState, useEffect } from "react";

// 🎨 PALETTE COLORI
const COLORS = {
  militaryGreen: '#4A5D4F',
  darkGreen: '#3A4D3F',
  lightGreen: '#6B7F6F',
  creamWhite: '#FFF8E7',
  accentGreen: '#7A9B7F',
  textDark: '#2C3E2F',
  alertRed: '#C1666B'
};

// 🔔 GESTIONE NOTIFICHE
const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    alert("Il tuo browser non supporta le notifiche");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
};

const sendNotification = (title, body, icon = "🌿") => {
  if (Notification.permission === "granted") {
    new Notification(title, {
      body: body,
      icon: icon,
      badge: icon,
      tag: 'plant-watering',
      requireInteraction: false,
      silent: false
    });
  }
};

// Controlla piante da innaffiare
const checkPlantsToWater = (plants) => {
  const today = new Date().toDateString();
  const lastCheck = localStorage.getItem('lastNotificationCheck');
  
  if (lastCheck === today) return;
  
  const plantsToWater = plants.filter(p => {
    const daysLeft = Math.ceil((new Date(p.nextWatering) - new Date()) / (1000 * 60 * 60 * 24));
    return daysLeft <= 0;
  });

  if (plantsToWater.length > 0) {
    const plantNames = plantsToWater.map(p => p.nome).join(', ');
    sendNotification(
      '💧 Tempo di innaffiare!',
      `${plantsToWater.length} pianta${plantsToWater.length > 1 ? 'e' : ''} ha bisogno di acqua: ${plantNames}`,
      '🌿'
    );
  }

  localStorage.setItem('lastNotificationCheck', today);
};

// 🌿 DATABASE PIANTE
const plantDB = [
  { nome: "Monstera", nomeScientfico: "Monstera deliciosa", giorniAcqua: 7, luce: "Media-Alta", quantitaAcqua: "Moderata", difficolta: "Facile", caratteristiche: "Pianta tropicale con foglie grandi e fenestrate", curiosita: ["Le foglie sviluppano i 'buchi' solo quando la pianta è matura", "In natura può crescere fino a 20 metri"], img: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400" },
  { nome: "Snake Plant", nomeScientfico: "Sansevieria trifasciata", giorniAcqua: 14, luce: "Bassa-Alta", quantitaAcqua: "Molto poca", difficolta: "Molto Facile", caratteristiche: "Succulenta resistentissima, tollera la siccità", curiosita: ["Produce ossigeno anche di notte", "Può sopravvivere settimane senza acqua"], img: "https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?w=400" },
  { nome: "Pothos", nomeScientfico: "Epipremnum aureum", giorniAcqua: 10, luce: "Bassa-Media", quantitaAcqua: "Poca", difficolta: "Molto Facile", caratteristiche: "Pianta rampicante molto resistente", curiosita: ["Purifica l'aria rimuovendo tossine", "Può crescere anche in acqua"], img: "https://images.unsplash.com/photo-1593482892290-f54927ae1bb8?w=400" },
  { nome: "Aloe Vera", nomeScientfico: "Aloe barbadensis", giorniAcqua: 14, luce: "Alta", quantitaAcqua: "Poca", difficolta: "Facile", caratteristiche: "Succulenta con proprietà medicinali", curiosita: ["Il gel ha proprietà lenitive", "Può vivere fino a 100 anni"], img: "https://images.unsplash.com/photo-1596548438137-d51ea5c83ca5?w=400" },
  { nome: "Ficus Lyrata", nomeScientfico: "Ficus lyrata", giorniAcqua: 7, luce: "Alta", quantitaAcqua: "Moderata", difficolta: "Media", caratteristiche: "Foglie grandi a forma di violino", curiosita: ["Originaria dell'Africa occidentale", "Non ama essere spostata"], img: "https://images.unsplash.com/photo-1614594895304-fe7116ac3b58?w=400" },
  { nome: "Zamioculcas", nomeScientfico: "Zamioculcas zamiifolia", giorniAcqua: 20, luce: "Bassa-Media", quantitaAcqua: "Molto poca", difficolta: "Molto Facile", caratteristiche: "Pianta quasi indistruttibile", curiosita: ["Può sopravvivere mesi senza acqua", "Cresce molto lentamente"], img: "https://images.unsplash.com/photo-1632207691143-643e2a9a9361?w=400" },
  { nome: "Pilea", nomeScientfico: "Pilea peperomioides", giorniAcqua: 7, luce: "Media", quantitaAcqua: "Moderata", difficolta: "Facile", caratteristiche: "Foglie rotonde decorative", curiosita: ["Produce facilmente piantine figlie", "Originaria della Cina"], img: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=400" },
  { nome: "Calathea", nomeScientfico: "Calathea spp.", giorniAcqua: 5, luce: "Media", quantitaAcqua: "Alta", difficolta: "Media", caratteristiche: "Foglie decorative con pattern unici", curiosita: ["Le foglie si muovono seguendo la luce", "Ama l'umidità elevata"], img: "https://images.unsplash.com/photo-1610824352934-c10d87b700cc?w=400" },
  { nome: "Dracaena", nomeScientfico: "Dracaena marginata", giorniAcqua: 10, luce: "Media", quantitaAcqua: "Moderata", difficolta: "Facile", caratteristiche: "Pianta slanciata con foglie sottili", curiosita: ["Può crescere fino a 6 metri", "Ottima per purificare l'aria"], img: "https://images.unsplash.com/photo-1591958911259-bee2173bdccc?w=400" },
  { nome: "Peace Lily", nomeScientfico: "Spathiphyllum", giorniAcqua: 7, luce: "Bassa-Media", quantitaAcqua: "Moderata", difficolta: "Facile", caratteristiche: "Fiori bianchi eleganti", curiosita: ["Ti avvisa quando ha sete", "Rimuove formaldeide dall'aria"], img: "https://images.unsplash.com/photo-1593482892290-f54927ae1bb8?w=400" },
  { nome: "Cactus", nomeScientfico: "Cactaceae", giorniAcqua: 25, luce: "Alta", quantitaAcqua: "Molto poca", difficolta: "Molto Facile", caratteristiche: "Succulenta spinosa", curiosita: ["Può immagazzinare acqua per mesi", "Alcune specie vivono oltre 200 anni"], img: "https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=400" },
  { nome: "Philodendron", nomeScientfico: "Philodendron hederaceum", giorniAcqua: 7, luce: "Media", quantitaAcqua: "Moderata", difficolta: "Facile", caratteristiche: "Rampicante con foglie a cuore", curiosita: ["Può crescere diversi metri", "Molto facile da propagare"], img: "https://images.unsplash.com/photo-1597689218583-c0e5e5e8c9e7?w=400" },
  { nome: "Maranta", nomeScientfico: "Maranta leuconeura", giorniAcqua: 5, luce: "Media", quantitaAcqua: "Alta", difficolta: "Media", caratteristiche: "Pianta della preghiera", curiosita: ["Le foglie si alzano di notte", "Ama l'umidità tropicale"], img: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400" },
  { nome: "Chlorophytum", nomeScientfico: "Chlorophytum comosum", giorniAcqua: 7, luce: "Media", quantitaAcqua: "Moderata", difficolta: "Molto Facile", caratteristiche: "Pianta ragno con foglie striate", curiosita: ["Produce piantine aeree", "Purifica l'aria"], img: "https://images.unsplash.com/photo-1610824352934-c10d87b700cc?w=400" },
  { nome: "Begonia", nomeScientfico: "Begonia rex", giorniAcqua: 6, luce: "Media", quantitaAcqua: "Moderata", difficolta: "Media", caratteristiche: "Foglie colorate decorative", curiosita: ["Esistono oltre 1800 specie", "Alcune hanno foglie metalliche"], img: "https://images.unsplash.com/photo-1591958911259-bee2173bdccc?w=400" },
  { nome: "Peperomia", nomeScientfico: "Peperomia obtusifolia", giorniAcqua: 10, luce: "Media", quantitaAcqua: "Poca", difficolta: "Facile", caratteristiche: "Pianta compatta con foglie carnose", curiosita: ["Esistono oltre 1000 varietà", "Foglie immagazzinano acqua"], img: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400" },
  { nome: "Aglaonema", nomeScientfico: "Aglaonema commutatum", giorniAcqua: 10, luce: "Bassa-Media", quantitaAcqua: "Moderata", difficolta: "Facile", caratteristiche: "Foglie variegate", curiosita: ["Perfetta per uffici", "Purifica l'aria da benzene"], img: "https://images.unsplash.com/photo-1598880940371-c756e015faf4?w=400" },
  { nome: "Anthurium", nomeScientfico: "Anthurium andraeanum", giorniAcqua: 7, luce: "Media-Alta", quantitaAcqua: "Moderata", difficolta: "Media", caratteristiche: "Fiori rossi a forma di cuore", curiosita: ["I 'fiori' sono foglie modificate", "Può fiorire tutto l'anno"], img: "https://images.unsplash.com/photo-1614594895304-fe7116ac3b58?w=400" },
  { nome: "Schefflera", nomeScientfico: "Schefflera arboricola", giorniAcqua: 10, luce: "Media-Alta", quantitaAcqua: "Moderata", difficolta: "Facile", caratteristiche: "Foglie a ombrello", curiosita: ["Può diventare un piccolo albero", "Tollera potature drastiche"], img: "https://images.unsplash.com/photo-1632207691143-643e2a9a9361?w=400" },
  { nome: "Rubber Plant", nomeScientfico: "Ficus elastica", giorniAcqua: 9, luce: "Media-Alta", quantitaAcqua: "Moderata", difficolta: "Facile", caratteristiche: "Foglie grandi lucide", curiosita: ["Veniva usata per produrre gomma", "Purifica l'aria efficacemente"], img: "https://images.unsplash.com/photo-1598880940371-c756e015faf4?w=400" },
  { nome: "Orchidea", nomeScientfico: "Phalaenopsis", giorniAcqua: 7, luce: "Media", quantitaAcqua: "Poca", difficolta: "Media", caratteristiche: "Fiori eleganti e duraturi", curiosita: ["Può rifiorire più volte", "Le radici aeree sono normali"], img: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=400" },
  { nome: "Tradescantia", nomeScientfico: "Tradescantia zebrina", giorniAcqua: 6, luce: "Media-Alta", quantitaAcqua: "Moderata", difficolta: "Facile", caratteristiche: "Foglie striate viola e argento", curiosita: ["Cresce molto velocemente", "Facile da propagare in acqua"], img: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400" },
  { nome: "Fittonia", nomeScientfico: "Fittonia albivenis", giorniAcqua: 4, luce: "Bassa-Media", quantitaAcqua: "Alta", difficolta: "Media", caratteristiche: "Foglie con venature colorate", curiosita: ["Chiamata 'pianta mosaico'", "Ama l'umidità elevata"], img: "https://images.unsplash.com/photo-1610824352934-c10d87b700cc?w=400" },
  { nome: "Dieffenbachia", nomeScientfico: "Dieffenbachia seguine", giorniAcqua: 7, luce: "Media", quantitaAcqua: "Moderata", difficolta: "Facile", caratteristiche: "Foglie grandi variegate", curiosita: ["Può crescere molto alta", "Purifica l'aria"], img: "https://images.unsplash.com/photo-1598880940371-c756e015faf4?w=400" },
  { nome: "Hoya", nomeScientfico: "Hoya carnosa", giorniAcqua: 9, luce: "Media-Alta", quantitaAcqua: "Poca", difficolta: "Facile", caratteristiche: "Fiori cerosi profumati", curiosita: ["I fiori producono nettare", "Può vivere decenni"], img: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400" },
  { nome: "Bonsai", nomeScientfico: "Varie specie", giorniAcqua: 6, luce: "Alta", quantitaAcqua: "Moderata", difficolta: "Difficile", caratteristiche: "Albero in miniatura", curiosita: ["Richiede potature regolari", "Può vivere centinaia di anni"], img: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=400" },
  { nome: "Coleus", nomeScientfico: "Plectranthus scutellarioides", giorniAcqua: 5, luce: "Media-Alta", quantitaAcqua: "Moderata", difficolta: "Facile", caratteristiche: "Foglie colorate vivaci", curiosita: ["Disponibile in molti colori", "Cresce velocemente"], img: "https://images.unsplash.com/photo-1591958911259-bee2173bdccc?w=400" },
  { nome: "Lavanda", nomeScientfico: "Lavandula angustifolia", giorniAcqua: 12, luce: "Alta", quantitaAcqua: "Poca", difficolta: "Media", caratteristiche: "Aromatica con fiori viola", curiosita: ["Profumo rilassante", "Attira le api"], img: "https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=400" },
   // ... continua da PARTE 1
  { nome: "Rosmarino", nomeScientfico: "Rosmarinus officinalis", giorniAcqua: 10, luce: "Alta", quantitaAcqua: "Poca", difficolta: "Facile", caratteristiche: "Aromatica sempreverde", curiosita: ["Ottimo in cucina", "Migliora la memoria"], img: "https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=400" },
  { nome: "Basilico", nomeScientfico: "Ocimum basilicum", giorniAcqua: 3, luce: "Alta", quantitaAcqua: "Alta", difficolta: "Facile", caratteristiche: "Aromatica annuale", curiosita: ["Essenziale per il pesto", "Repellente per zanzare"], img: "https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=400" },
  { nome: "Salvia", nomeScientfico: "Salvia officinalis", giorniAcqua: 7, luce: "Alta", quantitaAcqua: "Poca", difficolta: "Facile", caratteristiche: "Aromatica perenne", curiosita: ["Proprietà digestive", "Foglie vellutate"], img: "https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=400" },
  { nome: "Timo", nomeScientfico: "Thymus vulgaris", giorniAcqua: 8, luce: "Alta", quantitaAcqua: "Poca", difficolta: "Facile", caratteristiche: "Aromatica tappezzante", curiosita: ["Proprietà antisettiche", "Attira le api"], img: "https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=400" },
  { nome: "Menta", nomeScientfico: "Mentha", giorniAcqua: 4, luce: "Media", quantitaAcqua: "Alta", difficolta: "Molto Facile", caratteristiche: "Aromatica invasiva", curiosita: ["Cresce molto velocemente", "Ottima per tisane"], img: "https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=400" },
  { nome: "Edera", nomeScientfico: "Hedera helix", giorniAcqua: 7, luce: "Bassa-Media", quantitaAcqua: "Moderata", difficolta: "Facile", caratteristiche: "Rampicante sempreverde", curiosita: ["Purifica l'aria", "Può vivere centinaia di anni"], img: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400" },
  { nome: "Alocasia", nomeScientfico: "Alocasia amazonica", giorniAcqua: 6, luce: "Media-Alta", quantitaAcqua: "Moderata", difficolta: "Media", caratteristiche: "Foglie grandi a forma di freccia", curiosita: ["Chiamata 'orecchie di elefante'", "Ama l'umidità"], img: "https://images.unsplash.com/photo-1610824352934-c10d87b700cc?w=400" },
  { nome: "Oxalis", nomeScientfico: "Oxalis triangularis", giorniAcqua: 5, luce: "Media-Alta", quantitaAcqua: "Moderata", difficolta: "Facile", caratteristiche: "Foglie viola a forma di farfalla", curiosita: ["Le foglie si chiudono di notte", "Fiori delicati rosa"], img: "https://images.unsplash.com/photo-1591958911259-bee2173bdccc?w=400" },
  { nome: "Croton", nomeScientfico: "Codiaeum variegatum", giorniAcqua: 7, luce: "Alta", quantitaAcqua: "Moderata", difficolta: "Media", caratteristiche: "Foglie multicolori", curiosita: ["Colori cambiano con la luce", "Originario dell'Asia"], img: "https://images.unsplash.com/photo-1598880940371-c756e015faf4?w=400" },
  { nome: "Ciclamino", nomeScientfico: "Cyclamen persicum", giorniAcqua: 6, luce: "Media", quantitaAcqua: "Moderata", difficolta: "Media", caratteristiche: "Fiori colorati invernali", curiosita: ["Fiorisce in inverno", "Preferisce il fresco"], img: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=400" },
  { nome: "Geranio", nomeScientfico: "Pelargonium", giorniAcqua: 5, luce: "Alta", quantitaAcqua: "Moderata", difficolta: "Facile", caratteristiche: "Fiori abbondanti", curiosita: ["Repellente per zanzare", "Fiorisce tutta l'estate"], img: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=400" },
  { nome: "Petunia", nomeScientfico: "Petunia x hybrida", giorniAcqua: 4, luce: "Alta", quantitaAcqua: "Alta", difficolta: "Facile", caratteristiche: "Fiori a trombetta colorati", curiosita: ["Fioritura prolungata", "Profumo serale"], img: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=400" },
  { nome: "Surfinia", nomeScientfico: "Petunia pendula", giorniAcqua: 4, luce: "Alta", quantitaAcqua: "Alta", difficolta: "Facile", caratteristiche: "Cascata di fiori", curiosita: ["Perfetta per vasi sospesi", "Fioritura abbondante"], img: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=400" },
  { nome: "Impatiens", nomeScientfico: "Impatiens walleriana", giorniAcqua: 4, luce: "Bassa-Media", quantitaAcqua: "Alta", difficolta: "Facile", caratteristiche: "Fiori colorati per ombra", curiosita: ["Tollera l'ombra", "Fioritura continua"], img: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=400" },
  { nome: "Aspidistra", nomeScientfico: "Aspidistra elatior", giorniAcqua: 14, luce: "Bassa", quantitaAcqua: "Poca", difficolta: "Molto Facile", caratteristiche: "Pianta di ferro", curiosita: ["Quasi indistruttibile", "Tollera il buio"], img: "https://images.unsplash.com/photo-1598880940371-c756e015faf4?w=400" },
  { nome: "Kalanchoe", nomeScientfico: "Kalanchoe blossfeldiana", giorniAcqua: 10, luce: "Alta", quantitaAcqua: "Poca", difficolta: "Facile", caratteristiche: "Succulenta con fiori colorati", curiosita: ["Fiori durano settimane", "Facile da propagare"], img: "https://images.unsplash.com/photo-1596548438137-d51ea5c83ca5?w=400" },
  { nome: "Sedum", nomeScientfico: "Sedum morganianum", giorniAcqua: 14, luce: "Alta", quantitaAcqua: "Poca", difficolta: "Facile", caratteristiche: "Succulenta pendente", curiosita: ["Chiamata 'coda di asino'", "Foglie carnose"], img: "https://images.unsplash.com/photo-1596548438137-d51ea5c83ca5?w=400" },
  { nome: "Jade Plant", nomeScientfico: "Crassula ovata", giorniAcqua: 12, luce: "Alta", quantitaAcqua: "Poca", difficolta: "Facile", caratteristiche: "Albero di giada", curiosita: ["Porta fortuna", "Può vivere decenni"], img: "https://images.unsplash.com/photo-1596548438137-d51ea5c83ca5?w=400" },
  { nome: "Areca Palm", nomeScientfico: "Dypsis lutescens", giorniAcqua: 8, luce: "Media-Alta", quantitaAcqua: "Moderata", difficolta: "Facile", caratteristiche: "Palma elegante", curiosita: ["Purifica l'aria", "Cresce velocemente"], img: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=400" },
  { nome: "Boston Fern", nomeScientfico: "Nephrolepis exaltata", giorniAcqua: 5, luce: "Media", quantitaAcqua: "Alta", difficolta: "Media", caratteristiche: "Felce rigogliosa", curiosita: ["Ama l'umidità", "Purifica l'aria"], img: "https://images.unsplash.com/photo-1610824352934-c10d87b700cc?w=400" },
  { nome: "English Ivy", nomeScientfico: "Hedera helix", giorniAcqua: 7, luce: "Bassa-Media", quantitaAcqua: "Moderata", difficolta: "Facile", caratteristiche: "Edera classica", curiosita: ["Purifica l'aria", "Cresce rapidamente"], img: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400" },
  { nome: "Money Tree", nomeScientfico: "Pachira aquatica", giorniAcqua: 8, luce: "Media", quantitaAcqua: "Moderata", difficolta: "Facile", caratteristiche: "Tronco intrecciato", curiosita: ["Simbolo di prosperità", "Foglie a 5 punte"], img: "https://images.unsplash.com/photo-1632207691143-643e2a9a9361?w=400" },
  { nome: "Air Plant", nomeScientfico: "Tillandsia", giorniAcqua: 5, luce: "Media-Alta", quantitaAcqua: "Nebulizzazione", difficolta: "Media", caratteristiche: "Pianta senza terra", curiosita: ["Assorbe acqua dall'aria", "Non serve vaso"], img: "https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=400" },
  { nome: "Chinese Evergreen", nomeScientfico: "Aglaonema", giorniAcqua: 9, luce: "Bassa-Media", quantitaAcqua: "Moderata", difficolta: "Facile", caratteristiche: "Foglie variegate", curiosita: ["Tollera poca luce", "Purifica l'aria"], img: "https://images.unsplash.com/photo-1598880940371-c756e015faf4?w=400" },
  { nome: "Kentia", nomeScientfico: "Howea forsteriana", giorniAcqua: 14, luce: "Bassa-Media", quantitaAcqua: "Moderata", difficolta: "Facile", caratteristiche: "Palma elegante", curiosita: ["Cresce lentamente", "Può vivere oltre 100 anni"], img: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=400" }
];

// 🧮 FUNZIONI UTILITÀ
const getDaysUntilWatering = (nextWatering) => {
  if (!nextWatering) return 0;
  
  // Crea date senza ore per confronto preciso
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const nextDate = new Date(nextWatering);
  nextDate.setHours(0, 0, 0, 0);
  
  // Calcola differenza in millisecondi e converti in giorni
  const diffTime = nextDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

const getLightIcon = (luce) => {
  if (luce.includes("Alta")) return "☀️";
  if (luce.includes("Media")) return "⛅";
  return "☁️";
};

const getWaterIcon = (quantita) => {
  if (quantita === "Molto poca") return "💧";
  if (quantita === "Poca") return "💧💧";
  if (quantita === "Moderata") return "💧💧💧";
  return "💧💧💧💧";
};

const getPlantImage = (plant) => {
  return plant.customImg || plant.img;
};

// 📅 FUNZIONI CALENDARIO
const getDaysInMonth = (month, year) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (month, year) => {
  return new Date(year, month, 1).getDay();
};

const getMonthName = (month) => {
  const months = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
  ];
  return months[month];
};

const getPlantsForDate = (day, month, year, plants) => {
  const dateToCheck = new Date(year, month, day);
  dateToCheck.setHours(0, 0, 0, 0);
  
  return plants.filter(p => {
    const nextWatering = new Date(p.nextWatering);
    nextWatering.setHours(0, 0, 0, 0);
    
    return nextWatering.getTime() === dateToCheck.getTime();
  });
};

const isToday = (day, month, year) => {
  const today = new Date();
  return (
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear()
  );
};

// 📸 COMPRESSIONE IMMAGINI
const compressImage = (file, maxWidth = 800, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // Crea canvas per ridimensionare
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Ridimensiona se troppo grande
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Converti in base64 compresso
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        
        console.log('📸 Immagine compressa:', {
          originale: (file.size / 1024).toFixed(2) + ' KB',
          compressa: (compressedBase64.length / 1024).toFixed(2) + ' KB',
          riduzione: ((1 - compressedBase64.length / (file.size * 1.37)) * 100).toFixed(1) + '%'
        });
        
        resolve(compressedBase64);
      };
      
      img.onerror = reject;
      img.src = e.target.result;
    };
    
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// 🌿 RICONOSCIMENTO PIANTE CON PLANTNET (GRATUITO)
const identifyPlant = async (imageBase64) => {
  try {
    console.log('🔍 Inizio riconoscimento con PlantNet...');
    console.log('📸 Dimensione immagine:', (imageBase64.length / 1024).toFixed(2), 'KB');
    
    // Converti base64 in blob
    const base64Data = imageBase64.split(',')[1];
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpeg' });
    
    // Crea FormData
    const formData = new FormData();
    formData.append('images', blob, 'plant.jpg');
    formData.append('organs', 'leaf');
    
    // Chiama API PlantNet (gratuita)
    const response = await fetch(
      'https://my-api.plantnet.org/v2/identify/all?api-key=2b10vKjLV5ajNd0KLcXKe4DSf',
      {
        method: 'POST',
        body: formData
      }
    );

    console.log('📡 Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Errore API:', errorText);
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Dati ricevuti:', data);
    
    if (data.results && data.results.length > 0) {
      console.log('🌿 Piante trovate:', data.results.length);
      
      return data.results.slice(0, 3).map(result => ({
        nome: result.species.commonNames?.[0] || result.species.scientificNameWithoutAuthor,
        nomeScientfico: result.species.scientificNameWithoutAuthor,
        probabilita: (result.score * 100).toFixed(1),
        immagine: result.images?.[0]?.url?.o || result.images?.[0]?.url?.m || '',
        descrizione: `Famiglia: ${result.species.family?.scientificNameWithoutAuthor || 'N/A'}. Genere: ${result.species.genus?.scientificNameWithoutAuthor || 'N/A'}`
      }));
    } else {
      console.warn('⚠️ Nessuna pianta trovata');
      return null;
    }
    
  } catch (error) {
    console.error('❌ Errore completo:', error);
    alert('❌ Errore: ' + error.message + '. Riprova con una foto più chiara delle foglie.');
    return null;
  }
};
// 📱 COMPONENTE PRINCIPALE
export default function App() {
  const [miePiante, setMiePiante] = useState([]);
  const [tab, setTab] = useState("mie");
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [identifyingPlant, setIdentifyingPlant] = useState(false);
const [identifiedPlants, setIdentifiedPlants] = useState(null);
const [showIdentifyModal, setShowIdentifyModal] = useState(false);

// 📸 GESTIONE FOTO (dentro il componente)
const handleImageUpload = async (myId, file) => {
  if (!file || !file.type.startsWith('image/')) {
    alert('❌ Seleziona un file immagine valido');
    return;
  }
  
  if (file.size > 5 * 1024 * 1024) {
    alert('❌ Immagine troppo grande! Max 5MB');
    return;
  }
  
  try {
    setUploadingImage(true);
    console.log('📸 Caricamento immagine...');
    
    const compressedImage = await compressImage(file, 800, 0.7);
    
    setMiePiante(prevPiante => prevPiante.map(p => {
      if (p.myId === myId) {
        return { ...p, customImg: compressedImage };
      }
      return p;
    }));
    
    console.log('✅ Immagine caricata con successo');
    
  } catch (error) {
    console.error('❌ Errore caricamento immagine:', error);
    alert('❌ Errore nel caricamento dell\'immagine. Riprova con un\'immagine più piccola.');
  } finally {
    setUploadingImage(false);
  }
};

// 📊 CONTROLLA SPAZIO LOCALSTORAGE
const checkLocalStorageSize = () => {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length;
    }
  }
  const totalKB = (total / 1024).toFixed(2);
  const limitKB = 5120;
  const percentUsed = ((total / (limitKB * 1024)) * 100).toFixed(1);
  
  console.log(`📊 localStorage: ${totalKB} KB / ${limitKB} KB (${percentUsed}%)`);
  
  if (percentUsed > 80) {
    console.warn('⚠️ localStorage quasi pieno!');
  }
  
  return { totalKB, percentUsed };
};

const removeCustomImage = (myId) => {
  setMiePiante(miePiante.map(p => {
    if (p.myId === myId) {
      const { customImg, ...rest } = p;
      return rest;
    }
    return p;
  }));
};

  // Carica dati da localStorage
  useEffect(() => {
    const saved = localStorage.getItem("miePiante");
    if (saved) {
      setMiePiante(JSON.parse(saved));
    }

    // Controlla stato notifiche
    if ("Notification" in window) {
      setNotificationsEnabled(Notification.permission === "granted");
      
      if (Notification.permission === "default") {
        setTimeout(() => setShowNotificationPrompt(true), 3000);
      }
    }
  }, []);

 // Salva dati e controlla notifiche
useEffect(() => {
  try {
    const dataToSave = JSON.stringify(miePiante);
    localStorage.setItem("miePiante", dataToSave);
    
    // Controlla spazio
    checkLocalStorageSize();
    
    if (miePiante.length > 0 && notificationsEnabled) {
      checkPlantsToWater(miePiante);
    }
  } catch (error) {
    console.error('❌ Errore salvataggio localStorage:', error);
    
    if (error.name === 'QuotaExceededError') {
      alert('⚠️ Spazio esaurito! Rimuovi alcune foto personalizzate.');
      
      // Rimuovi tutte le foto custom per liberare spazio
      if (confirm('Vuoi rimuovere tutte le foto personalizzate per liberare spazio?')) {
        setMiePiante(prevPiante => prevPiante.map(p => {
          const { customImg, ...rest } = p;
          return rest;
        }));
      }
    }
  }
}, [miePiante, notificationsEnabled]);

  // Controllo giornaliero notifiche
  useEffect(() => {
    if (!notificationsEnabled || miePiante.length === 0) return;

    const interval = setInterval(() => {
      checkPlantsToWater(miePiante);
    }, 60 * 60 * 1000);

    checkPlantsToWater(miePiante);

    return () => clearInterval(interval);
  }, [miePiante, notificationsEnabled]);

  // Abilita notifiche
  const enableNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotificationsEnabled(granted);
    setShowNotificationPrompt(false);
    
    if (granted) {
      sendNotification(
        '🎉 Notifiche attivate!',
        'Green House ti avviserà quando le tue piante hanno bisogno di acqua',
        '🌿'
      );
    }
  };

  // Aggiungi pianta
  const addPlant = (plant) => {
  const now = new Date();
  
  // Calcola la prossima data di innaffiatura
  const nextWateringDate = new Date(now);
  nextWateringDate.setDate(now.getDate() + plant.giorniAcqua);
  nextWateringDate.setHours(0, 0, 0, 0); // Resetta ore
  
  const newPlant = {
    ...plant,
    myId: Date.now(),
    lastWatered: now.toISOString(),
    nextWatering: nextWateringDate.toISOString()
  };
  
  setMiePiante([...miePiante, newPlant]);
};

  // Rimuovi pianta
  const removePlant = (myId) => {
    setMiePiante(miePiante.filter(p => p.myId !== myId));
    setSelectedPlant(null);
  };

  // Innaffia pianta
  const waterPlant = (myId) => {
  setMiePiante(miePiante.map(p => {
    if (p.myId === myId) {
      const now = new Date();
      
      // Calcola la prossima data di innaffiatura
      const nextWateringDate = new Date(now);
      nextWateringDate.setDate(now.getDate() + p.giorniAcqua);
      nextWateringDate.setHours(0, 0, 0, 0); // Resetta ore
      
      return {
        ...p,
        lastWatered: now.toISOString(),
        nextWatering: nextWateringDate.toISOString()
      };
    }
    return p;
  }));
};

  // Filtra piante
  const filteredPlants = plantDB.filter(p => 
    p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.nomeScientfico.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const plantsNeedWater = miePiante.filter(p => getDaysUntilWatering(p.nextWatering) <= 0);
  
  const plantsComingSoon = miePiante.filter(p => {
    const days = getDaysUntilWatering(p.nextWatering);
    return days > 0 && days <= 3;
  }).sort((a, b) => new Date(a.nextWatering) - new Date(b.nextWatering));

 return (
  <div style={{ 
    minHeight: '100vh', 
    backgroundColor: COLORS.creamWhite,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
    }}>
      
      {/* 🔔 PROMPT NOTIFICHE */}
      {showNotificationPrompt && (
        <div style={{
          position: 'fixed',
          top: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2000,
          maxWidth: 380,
          width: 'calc(100% - 40px)',
          animation: 'slideDown 0.3s'
        }}>
          <div style={{
            backgroundColor: COLORS.militaryGreen,
            color: COLORS.creamWhite,
            padding: '16px 20px',
            borderRadius: 16,
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: '24px' }}>🔔</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
                  Attiva le notifiche
                </div>
                <div style={{ fontSize: '13px', opacity: 0.9 }}>
                  Ti avviseremo quando le tue piante hanno bisogno di acqua
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={enableNotifications}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: COLORS.creamWhite,
                  color: COLORS.militaryGreen,
                  border: 'none',
                  borderRadius: 8,
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Attiva
              </button>
              <button
                onClick={() => setShowNotificationPrompt(false)}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: 'transparent',
                  color: COLORS.creamWhite,
                  border: `2px solid ${COLORS.creamWhite}`,
                  borderRadius: 8,
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Dopo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🎯 HEADER */}
     <div style={{
  background: `linear-gradient(135deg, ${COLORS.militaryGreen} 0%, ${COLORS.darkGreen} 100%)`,
  padding: '20px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  width: '100%'
}}>
  <div style={{ 
    maxWidth: 420, 
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }}>
         <div style={{ 
  display: 'flex', 
  justifyContent: 'center', 
  alignItems: 'center',
  gap: '15px',
  marginBottom: plantsNeedWater.length > 0 ? '10px' : 0,
  width: '100%'
}}>
            <h1 style={{ 
              color: COLORS.creamWhite, 
              margin: 0,
              fontSize: '28px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              🪴🏡 Green House
            </h1>
            
            {/* Pulsante Notifiche */}
            <button
              onClick={async () => {
                if (notificationsEnabled) {
                  alert('Le notifiche sono già attive! 🔔');
                } else {
                  await enableNotifications();
                }
              }}
              style={{
                padding: '8px 12px',
                backgroundColor: notificationsEnabled 
                  ? COLORS.accentGreen 
                  : COLORS.creamWhite + '40',
                color: COLORS.creamWhite,
                border: 'none',
                borderRadius: 8,
                fontSize: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
              title={notificationsEnabled ? 'Notifiche attive' : 'Attiva notifiche'}
            >
              {notificationsEnabled ? '🔔' : '🔕'}
            </button>
          </div>

          {plantsNeedWater.length > 0 && (
            <div style={{
              marginTop: '10px',
              padding: '8px 12px',
              backgroundColor: COLORS.alertRed,
              borderRadius: '8px',
              color: COLORS.creamWhite,
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              ⚠️ {plantsNeedWater.length} pianta{plantsNeedWater.length > 1 ? 'e' : ''} da innaffiare!
            </div>
          )}
        </div>
      </div>

      {/* 📱 MENU TABS */}
      <div style={{ 
        maxWidth: 420, 
        margin: '0 auto',
        padding: '20px 20px 0'
      }}>
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: 20
        }}>
          {[
            { id: 'mie', label: '🏠 Le Mie', count: miePiante.length },
            { id: 'plantario', label: '📚 Plantario', count: plantDB.length },
          { id: 'calendar', label: '📅 Calendar', count: plantsNeedWater.length }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: 12,
                border: 'none',
                background: tab === t.id ? COLORS.militaryGreen : COLORS.lightGreen + '40',
                color: tab === t.id ? COLORS.creamWhite : COLORS.textDark,
                fontWeight: tab === t.id ? 'bold' : 'normal',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: tab === t.id ? '0 4px 8px rgba(0,0,0,0.15)' : 'none'
              }}
            >
              {t.label}
              {t.count > 0 && (
                <span style={{
                  marginLeft: '6px',
                  backgroundColor: tab === t.id ? COLORS.accentGreen : COLORS.militaryGreen,
                  color: COLORS.creamWhite,
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 📄 CONTENUTO */}
      <div style={{ 
        maxWidth: 420, 
        margin: '0 auto',
        padding: '0 20px 20px'
      }}>

        {/* 🏠 LE MIE PIANTE */}
        {tab === 'mie' && (
          <>
            {miePiante.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: COLORS.lightGreen
              }}>
                <div style={{ fontSize: '80px', marginBottom: '20px' }}>🌱</div>
                <h2 style={{ color: COLORS.textDark, marginBottom: '10px' }}>Nessuna pianta ancora</h2>
                <p>Vai al Plantario per aggiungerne una!</p>
              </div>
            ) : (
              miePiante.map(p => {
                const daysLeft = getDaysUntilWatering(p.nextWatering);
                const needsWater = daysLeft <= 0;
                
                return (
                  <div
                    key={p.myId}
                    style={{
                      display: 'flex',
                      gap: 15,
                      padding: 15,
                      marginBottom: 15,
                      borderRadius: 16,
                      backgroundColor: COLORS.creamWhite,
                      border: `2px solid ${needsWater ? COLORS.alertRed : COLORS.lightGreen}`,
                      transition: 'all 0.3s',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      position: 'relative'
                    }}
                  >
                    <div style={{ position: 'relative' }}>
                      <img
                        src={getPlantImage(p)}
                        alt={p.nome}
                        onClick={() => setSelectedPlant(p)}
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: 12,
                          objectFit: 'cover',
                          border: `3px solid ${COLORS.accentGreen}`,
                          cursor: 'pointer'
                        }}
                      />
                      {p.customImg && (
                        <div style={{
                          position: 'absolute',
                          top: -5,
                          right: -5,
                          backgroundColor: COLORS.militaryGreen,
                          color: COLORS.creamWhite,
                          borderRadius: '50%',
                          width: 24,
                          height: 24,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          border: `2px solid ${COLORS.creamWhite}`
                        }}>
                          📸
                        </div>
                      )}
                    </div>

                    <div style={{ flex: 1 }} onClick={() => setSelectedPlant(p)}>
                      <h3 style={{ 
                        margin: '0 0 8px 0', 
                        color: COLORS.textDark,
                        fontSize: '18px',
                        cursor: 'pointer'
                      }}>
                        {p.nome}
                      </h3>
                      <div style={{ 
                        fontSize: '13px', 
                        color: COLORS.textDark,
                        marginBottom: '8px'
                      }}>
                        {getLightIcon(p.luce)} {p.luce} • {getWaterIcon(p.quantitaAcqua)} {p.quantitaAcqua}
                      </div>
                      {needsWater ? (
                        <div style={{
                          display: 'inline-block',
                          padding: '6px 12px',
                          backgroundColor: COLORS.alertRed,
                          color: COLORS.creamWhite,
                          borderRadius: 8,
                          fontSize: '13px',
                          fontWeight: 'bold'
                        }}>
                          💧 Innaffia ora!
                        </div>
                      ) : (
                        <div style={{
                          fontSize: '13px',
                          color: COLORS.lightGreen,
                          fontWeight: '500'
                        }}>
                          Prossima innaffiatura: {daysLeft} {daysLeft === 1 ? 'giorno' : 'giorni'}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </>
        )}

        {/* 📚 PLANTARIO */}
       {tab === 'plantario' && (
  <>
    {/* Pulsante Riconoscimento AI */}
    <div style={{
      marginBottom: 20,
      padding: 15,
      backgroundColor: COLORS.accentGreen + '20',
      borderRadius: 12,
      border: `2px solid ${COLORS.accentGreen}`
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 10
      }}>
        <span style={{ fontSize: '24px' }}>🤖</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 'bold', color: COLORS.textDark, marginBottom: 4 }}>
            Riconoscimento AI
          </div>
          <div style={{ fontSize: '13px', color: COLORS.lightGreen }}>
            Scatta una foto e scopri che pianta è!
          </div>
        </div>
      </div>
      
      <label style={{
        display: 'block',
        width: '100%',
        padding: '12px',
        backgroundColor: COLORS.militaryGreen,
        color: COLORS.creamWhite,
        borderRadius: 8,
        textAlign: 'center',
        fontWeight: 'bold',
        cursor: identifyingPlant ? 'not-allowed' : 'pointer',
        opacity: identifyingPlant ? 0.6 : 1
      }}>
        {identifyingPlant ? '🔍 Analizzando...' : '📸 Scatta e Riconosci'}
        <input
          type="file"
          accept="image/*"
          capture="environment"
          disabled={identifyingPlant}
          onChange={async (e) => {
            if (e.target.files[0]) {
              setIdentifyingPlant(true);
              
              try {
                // Comprimi immagine
                const compressed = await compressImage(e.target.files[0], 1024, 0.8);
                
                // Riconosci pianta
                const results = await identifyPlant(compressed);
                
                if (results) {
                  setIdentifiedPlants(results);
                  setShowIdentifyModal(true);
                } else {
                  alert('❌ Impossibile riconoscere la pianta. Riprova con una foto più chiara.');
                }
              } catch (error) {
                alert('❌ Errore durante il riconoscimento. Riprova.');
              } finally {
                setIdentifyingPlant(false);
                e.target.value = ''; // Reset input
              }
            }
          }}
          style={{ display: 'none' }}
        />
      </label>
    </div>
            <input
              type="text"
              placeholder="🔍 Cerca pianta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                marginBottom: 20,
                borderRadius: 12,
                border: `2px solid ${COLORS.lightGreen}`,
                fontSize: '16px',
                backgroundColor: COLORS.creamWhite,
                color: COLORS.textDark,
                outline: 'none'
              }}
            />
            
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 15
            }}>
              {filteredPlants.map(p => (
                <div
                  key={p.nome}
                  onClick={() => setSelectedPlant(p)}
                  style={{
                    borderRadius: 16,
                    overflow: 'hidden',
                    backgroundColor: COLORS.creamWhite,
                    border: `2px solid ${COLORS.lightGreen}`,
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <img
                    src={p.img}
                    alt={p.nome}
                    style={{
                      width: '100%',
                      height: 140,
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{ padding: 12 }}>
                    <h4 style={{ 
                      margin: '0 0 6px 0',
                      color: COLORS.textDark,
                      fontSize: '15px'
                    }}>
                      {p.nome}
                    </h4>
                    <div style={{
                      fontSize: '11px',
                      color: COLORS.lightGreen,
                      marginBottom: 8
                    }}>
                      {p.nomeScientfico}
                    </div>
                    <div style={{
                      display: 'inline-block',
                      padding: '4px 8px',
                      backgroundColor: COLORS.accentGreen + '30',
                      color: COLORS.textDark,
                      borderRadius: 6,
                      fontSize: '11px',
                      fontWeight: 'bold'
                    }}>
                      {p.difficolta}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

    {/* 📅 CALENDAR */}
{tab === 'calendar' && (
  <>
    {miePiante.length === 0 ? (
      <div style={{
        textAlign: 'center',
        padding: '60px 20px',
        color: COLORS.lightGreen
      }}>
        <div style={{ fontSize: '80px', marginBottom: '20px' }}>📅</div>
        <h2 style={{ color: COLORS.textDark, marginBottom: '10px' }}>Nessuna pianta ancora</h2>
        <p>Aggiungi piante per vedere il calendario di innaffiatura</p>
      </div>
    ) : (
      <>
        {/* Header Calendario */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
          padding: '15px',
          backgroundColor: COLORS.militaryGreen,
          borderRadius: 12,
          color: COLORS.creamWhite
        }}>
          <button
            onClick={() => {
              if (currentMonth === 0) {
                setCurrentMonth(11);
                setCurrentYear(currentYear - 1);
              } else {
                setCurrentMonth(currentMonth - 1);
              }
            }}
            style={{
              background: 'none',
              border: 'none',
              color: COLORS.creamWhite,
              fontSize: '24px',
              cursor: 'pointer',
              padding: '5px 10px'
            }}
          >
            ‹
          </button>
          
          <div style={{
            textAlign: 'center',
            flex: 1
          }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
              {getMonthName(currentMonth)}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>
              {currentYear}
            </div>
          </div>
          
          <button
            onClick={() => {
              if (currentMonth === 11) {
                setCurrentMonth(0);
                setCurrentYear(currentYear + 1);
              } else {
                setCurrentMonth(currentMonth + 1);
              }
            }}
            style={{
              background: 'none',
              border: 'none',
              color: COLORS.creamWhite,
              fontSize: '24px',
              cursor: 'pointer',
              padding: '5px 10px'
            }}
          >
            ›
          </button>
        </div>

        {/* Pulsante Oggi */}
        <button
          onClick={() => {
            setCurrentMonth(new Date().getMonth());
            setCurrentYear(new Date().getFullYear());
          }}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: 15,
            backgroundColor: COLORS.accentGreen,
            color: COLORS.creamWhite,
            border: 'none',
            borderRadius: 8,
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          📍 Vai a Oggi
        </button>

        {/* Giorni della Settimana */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 5,
          marginBottom: 10
        }}>
          {['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'].map(day => (
            <div
              key={day}
              style={{
                textAlign: 'center',
                padding: '8px 0',
                fontSize: '12px',
                fontWeight: 'bold',
                color: COLORS.textDark
              }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Griglia Calendario */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 5
        }}>
          {/* Celle vuote per allineare il primo giorno */}
          {Array.from({ length: getFirstDayOfMonth(currentMonth, currentYear) }).map((_, i) => (
            <div key={`empty-${i}`} style={{ aspectRatio: '1' }} />
          ))}

          {/* Giorni del mese */}
          {Array.from({ length: getDaysInMonth(currentMonth, currentYear) }).map((_, i) => {
            const day = i + 1;
            const plantsForDay = getPlantsForDate(day, currentMonth, currentYear, miePiante);
            const today = isToday(day, currentMonth, currentYear);
            const hasPlantsToWater = plantsForDay.length > 0;

            return (
              <div
                key={day}
                onClick={() => {
                  if (plantsForDay.length > 0) {
                    setSelectedPlant(plantsForDay[0]);
                  }
                }}
                style={{
                  aspectRatio: '1',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 5,
                  borderRadius: 8,
                  backgroundColor: today 
                    ? COLORS.accentGreen 
                    : hasPlantsToWater 
                      ? COLORS.alertRed + '20' 
                      : COLORS.creamWhite,
                  border: today 
                    ? `2px solid ${COLORS.militaryGreen}` 
                    : hasPlantsToWater 
                      ? `2px solid ${COLORS.alertRed}` 
                      : `1px solid ${COLORS.lightGreen}40`,
                  cursor: hasPlantsToWater ? 'pointer' : 'default',
                  transition: 'all 0.2s',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  if (hasPlantsToWater) {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <div style={{
                  fontSize: '14px',
                  fontWeight: today ? 'bold' : 'normal',
                  color: today ? COLORS.creamWhite : COLORS.textDark,
                  marginBottom: 2
                }}>
                  {day}
                </div>

                {hasPlantsToWater && (
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    {plantsForDay.slice(0, 3).map((plant, idx) => (
                      <div
                        key={idx}
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          backgroundColor: COLORS.alertRed
                        }}
                      />
                    ))}
                    {plantsForDay.length > 3 && (
                      <div style={{
                        fontSize: '8px',
                        color: COLORS.alertRed,
                        fontWeight: 'bold'
                      }}>
                        +{plantsForDay.length - 3}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legenda */}
        <div style={{
          marginTop: 20,
          padding: 15,
          backgroundColor: COLORS.lightGreen + '20',
          borderRadius: 12
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: COLORS.textDark,
            marginBottom: 10
          }}>
            📖 Legenda
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                backgroundColor: COLORS.accentGreen,
                border: `2px solid ${COLORS.militaryGreen}`
              }} />
              <span style={{ fontSize: '13px', color: COLORS.textDark }}>Oggi</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                backgroundColor: COLORS.alertRed + '20',
                border: `2px solid ${COLORS.alertRed}`
              }} />
              <span style={{ fontSize: '13px', color: COLORS.textDark }}>Giorno con piante da innaffiare</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: COLORS.alertRed
              }} />
              <span style={{ fontSize: '13px', color: COLORS.textDark }}>Ogni pallino = 1 pianta</span>
            </div>
          </div>
        </div>

        {/* Lista Piante da Innaffiare Questo Mese */}
        {miePiante.filter(p => {
          const nextWatering = new Date(p.nextWatering);
          return (
            nextWatering.getMonth() === currentMonth &&
            nextWatering.getFullYear() === currentYear
          );
        }).length > 0 && (
          <div style={{ marginTop: 20 }}>
            <h3 style={{
              color: COLORS.textDark,
              fontSize: '16px',
              marginBottom: 15
            }}>
              🌿 Piante da innaffiare questo mese
            </h3>
            
            {miePiante
              .filter(p => {
                const nextWatering = new Date(p.nextWatering);
                return (
                  nextWatering.getMonth() === currentMonth &&
                  nextWatering.getFullYear() === currentYear
                );
              })
              .sort((a, b) => new Date(a.nextWatering) - new Date(b.nextWatering))
              .map(p => {
                const nextDate = new Date(p.nextWatering);
                const daysLeft = getDaysUntilWatering(p.nextWatering);
                const needsWater = daysLeft <= 0;
                
                return (
                  <div
                    key={p.myId}
                    onClick={() => setSelectedPlant(p)}
                    style={{
                      display: 'flex',
                      gap: 12,
                      padding: 12,
                      marginBottom: 10,
                      borderRadius: 12,
                      backgroundColor: COLORS.creamWhite,
                      border: `2px solid ${needsWater ? COLORS.alertRed : COLORS.lightGreen}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <img
                      src={getPlantImage(p)}
                      alt={p.nome}
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 10,
                        objectFit: 'cover',
                        border: `2px solid ${needsWater ? COLORS.alertRed : COLORS.accentGreen}`
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontWeight: 'bold',
                        color: COLORS.textDark,
                        marginBottom: 4
                      }}>
                        {p.nome}
                      </div>
                      <div style={{
                                               fontSize: '13px',
                        color: needsWater ? COLORS.alertRed : COLORS.lightGreen,
                        fontWeight: '500'
                      }}>
                        {needsWater ? '💧 Innaffia ora!' : `📅 ${nextDate.getDate()} ${getMonthName(currentMonth).substring(0, 3)}`}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </>
    )}
  </>
)}
              </div>  {/* Chiude div contenuto */}

      {/* 🤖 MODAL RISULTATI RICONOSCIMENTO */}
      {showIdentifyModal && identifiedPlants && (
        <div
          onClick={() => setShowIdentifyModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 20,
            animation: 'fadeIn 0.3s'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: COLORS.creamWhite,
              borderRadius: 24,
              maxWidth: 500,
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto',
              animation: 'slideUp 0.3s'
            }}
          >
            {/* Header */}
            <div style={{
              position: 'sticky',
              top: 0,
              backgroundColor: COLORS.militaryGreen,
              padding: '20px',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              zIndex: 10
            }}>
              <h2 style={{ 
                color: COLORS.creamWhite,
                margin: 0,
                fontSize: '20px'
              }}>
                🤖 Risultati Riconoscimento
              </h2>
              <button
                onClick={() => setShowIdentifyModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: COLORS.creamWhite,
                  fontSize: '28px',
                  cursor: 'pointer',
                  padding: 0,
                  lineHeight: 1
                }}
              >
                ×
              </button>
            </div>

            {/* Risultati */}
            <div style={{ padding: 20 }}>
              <div style={{
                fontSize: '14px',
                color: COLORS.lightGreen,
                marginBottom: 15,
                textAlign: 'center'
              }}>
                Abbiamo trovato {identifiedPlants.length} possibili corrispondenze
              </div>

              {identifiedPlants.map((plant, idx) => {
                // Cerca nel database se esiste già
                const existingPlant = plantDB.find(p => 
                  p.nomeScientfico.toLowerCase().includes(plant.nomeScientfico.toLowerCase()) ||
                  p.nome.toLowerCase().includes(plant.nome.toLowerCase())
                );

                return (
                  <div
                    key={idx}
                    style={{
                      marginBottom: 15,
                      padding: 15,
                      borderRadius: 12,
                      backgroundColor: COLORS.lightGreen + '10',
                      border: `2px solid ${COLORS.lightGreen}`,
                      cursor: existingPlant ? 'pointer' : 'default'
                    }}
                    onClick={() => {
                      if (existingPlant) {
                        setSelectedPlant(existingPlant);
                        setShowIdentifyModal(false);
                      }
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 10
                    }}>
                      <div>
                        <div style={{
                          fontWeight: 'bold',
                          color: COLORS.textDark,
                          fontSize: '16px',
                          marginBottom: 4
                        }}>
                          {plant.nome}
                        </div>
                        <div style={{
                          fontSize: '13px',
                          color: COLORS.lightGreen,
                          fontStyle: 'italic'
                        }}>
                          {plant.nomeScientfico}
                        </div>
                      </div>
                      <div style={{
                        padding: '6px 12px',
                        backgroundColor: COLORS.accentGreen,
                        color: COLORS.creamWhite,
                        borderRadius: 8,
                        fontSize: '13px',
                        fontWeight: 'bold'
                      }}>
                        {plant.probabilita}%
                      </div>
                    </div>

                    {plant.immagine && (
                      <img
                        src={plant.immagine}
                        alt={plant.nome}
                        style={{
                          width: '100%',
                          height: 150,
                          objectFit: 'cover',
                          borderRadius: 8,
                          marginBottom: 10
                        }}
                      />
                    )}

                    <div style={{
                      fontSize: '13px',
                      color: COLORS.textDark,
                      marginBottom: 10,
                      lineHeight: 1.5
                    }}>
                      {plant.descrizione.substring(0, 150)}...
                    </div>

                    {existingPlant ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPlant(existingPlant);
                          setShowIdentifyModal(false);
                        }}
                        style={{
                          width: '100%',
                          padding: '10px',
                          backgroundColor: COLORS.militaryGreen,
                          color: COLORS.creamWhite,
                          border: 'none',
                          borderRadius: 8,
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        ✅ Presente nel Plantario
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          alert('💡 Questa pianta non è ancora nel nostro database. Puoi aggiungerla manualmente!');
                        }}
                        style={{
                          width: '100%',
                          padding: '10px',
                          backgroundColor: COLORS.lightGreen,
                          color: COLORS.creamWhite,
                          border: 'none',
                          borderRadius: 8,
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        ➕ Aggiungi Manualmente
                      </button>
                    )}
                  </div>
                );
              })}

              <button
                onClick={() => setShowIdentifyModal(false)}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: 'transparent',
                  color: COLORS.textDark,
                  border: `2px solid ${COLORS.lightGreen}`,
                  borderRadius: 8,
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '14px',
                  marginTop: 10
                }}
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}
    
      {/* 🔍 MODAL DETTAGLIO PIANTA */}
      {selectedPlant && (
        <div
          onClick={() => {
            setSelectedPlant(null);
            setShowImageOptions(false);
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            zIndex: 1000,
            animation: 'fadeIn 0.3s'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: COLORS.creamWhite,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              maxWidth: 500,
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              animation: 'slideUp 0.3s'
            }}
          >
            {/* Header Modal */}
            <div style={{
              position: 'sticky',
              top: 0,
              backgroundColor: COLORS.militaryGreen,
              padding: '20px',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              zIndex: 10
            }}>
              <h2 style={{ 
                color: COLORS.creamWhite,
                margin: 0,
                fontSize: '22px'
              }}>
                {selectedPlant.nome}
              </h2>
              <button
                onClick={() => {
                  setSelectedPlant(null);
                  setShowImageOptions(false);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: COLORS.creamWhite,
                  fontSize: '28px',
                  cursor: 'pointer',
                  padding: 0,
                  lineHeight: 1
                }}
              >
                ×
              </button>
            </div>

            {/* Immagine con pulsante cambio foto */}
            <div style={{ position: 'relative' }}>
              <img
                src={getPlantImage(selectedPlant)}
                alt={selectedPlant.nome}
                style={{
                  width: '100%',
                  height: 250,
                  objectFit: 'cover'
                }}
              />
              
            {selectedPlant.myId && (
  <div style={{
    position: 'absolute',
    bottom: 15,
    right: 15,
    display: 'flex',
    gap: 10
  }}>
    <button
      onClick={() => setShowImageOptions(!showImageOptions)}
      disabled={uploadingImage} // ✅ AGGIUNGI QUESTA RIGA
      style={{
        padding: '10px 16px',
        backgroundColor: uploadingImage ? COLORS.lightGreen : COLORS.militaryGreen, // ✅ MODIFICA
        color: COLORS.creamWhite,
        border: 'none',
        borderRadius: 10,
        fontSize: '14px',
        fontWeight: 'bold',
        cursor: uploadingImage ? 'not-allowed' : 'pointer', // ✅ MODIFICA
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        opacity: uploadingImage ? 0.6 : 1 // ✅ AGGIUNGI QUESTA RIGA
      }}
    >
      {uploadingImage ? '⏳ Caricamento...' : '📸 Cambia foto'} {/* ✅ MODIFICA */}
    </button>
                  
                  {selectedPlant.customImg && (
                    <button
                      onClick={() => {
                        if (confirm('Ripristinare la foto originale?')) {
                          removeCustomImage(selectedPlant.myId);
                          setSelectedPlant({...selectedPlant, customImg: undefined});
                        }
                      }}
                      style={{
                        padding: '10px',
                        backgroundColor: COLORS.alertRed,
                        color: COLORS.creamWhite,
                        border: 'none',
                        borderRadius: 10,
                        fontSize: '14px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                      }}
                    >
                      🗑️
                    </button>
                  )}
                </div>
              )}

              {/* Menu Opzioni Foto */}
              {showImageOptions && selectedPlant.myId && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    position: 'absolute',
                    bottom: 70,
                    right: 15,
                    backgroundColor: COLORS.creamWhite,
                    borderRadius: 12,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                    overflow: 'hidden',
                    minWidth: 200,
                    animation: 'slideUp 0.2s'
                  }}
                >
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '14px 16px',
                    cursor: 'pointer',
                                    borderBottom: `1px solid ${COLORS.lightGreen}30`,
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.lightGreen + '20'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <span style={{ fontSize: '20px' }}>📷</span>
                    <span style={{ 
                      color: COLORS.textDark,
                      fontWeight: '500',
                      fontSize: '14px'
                    }}>
                      Scatta foto
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={(e) => {
                        if (e.target.files[0]) {
                          handleImageUpload(selectedPlant.myId, e.target.files[0]);
                          setShowImageOptions(false);
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setSelectedPlant({...selectedPlant, customImg: reader.result});
                          };
                          reader.readAsDataURL(e.target.files[0]);
                        }
                      }}
                      style={{ display: 'none' }}
                    />
                  </label>

                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '14px 16px',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.lightGreen + '20'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <span style={{ fontSize: '20px' }}>🖼️</span>
                    <span style={{ 
                      color: COLORS.textDark,
                      fontWeight: '500',
                      fontSize: '14px'
                    }}>
                      Carica da galleria
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files[0]) {
                          handleImageUpload(selectedPlant.myId, e.target.files[0]);
                          setShowImageOptions(false);
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setSelectedPlant({...selectedPlant, customImg: reader.result});
                          };
                          reader.readAsDataURL(e.target.files[0]);
                        }
                      }}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Contenuto Modal */}
            <div style={{ padding: 20 }}>
              
              {selectedPlant.customImg && (
                <div style={{
                  display: 'inline-block',
                  padding: '6px 12px',
                  backgroundColor: COLORS.accentGreen,
                  color: COLORS.creamWhite,
                  borderRadius: 8,
                  fontSize: '12px',
                  fontWeight: 'bold',
                  marginBottom: 15
                }}>
                  📸 Foto personalizzata
                </div>
              )}

              <div style={{
                fontSize: '14px',
                color: COLORS.lightGreen,
                fontStyle: 'italic',
                marginBottom: 15
              }}>
                {selectedPlant.nomeScientfico}
              </div>

              <div style={{
                display: 'inline-block',
                padding: '6px 12px',
                backgroundColor: COLORS.accentGreen + '30',
                color: COLORS.textDark,
                borderRadius: 8,
                fontSize: '13px',
                fontWeight: 'bold',
                marginBottom: 20
              }}>
                Difficoltà: {selectedPlant.difficolta}
              </div>

              {/* Caratteristiche */}
              <div style={{
                backgroundColor: COLORS.lightGreen + '20',
                padding: 15,
                borderRadius: 12,
                marginBottom: 20
              }}>
                <h3 style={{
                  margin: '0 0 10px 0',
                  color: COLORS.textDark,
                  fontSize: '16px'
                }}>
                  📝 Caratteristiche
                </h3>
                <p style={{
                  margin: 0,
                  color: COLORS.textDark,
                  lineHeight: 1.6
                }}>
                  {selectedPlant.caratteristiche}
                </p>
              </div>

              {/* Esigenze */}
              <div style={{
                backgroundColor: COLORS.lightGreen + '20',
                padding: 15,
                borderRadius: 12,
                marginBottom: 20
              }}>
                <h3 style={{
                  margin: '0 0 15px 0',
                  color: COLORS.textDark,
                  fontSize: '16px'
                }}>
                  🌱 Esigenze
                </h3>
                
                <div style={{ marginBottom: 12 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    marginBottom: 8
                  }}>
                    <span style={{ fontSize: '20px' }}>{getLightIcon(selectedPlant.luce)}</span>
                    <div>
                      <div style={{ fontWeight: 'bold', color: COLORS.textDark }}>Luce</div>
                      <div style={{ fontSize: '14px', color: COLORS.lightGreen }}>{selectedPlant.luce}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    marginBottom: 8
                  }}>
                    <span style={{ fontSize: '20px' }}>{getWaterIcon(selectedPlant.quantitaAcqua)}</span>
                    <div>
                      <div style={{ fontWeight: 'bold', color: COLORS.textDark }}>Acqua</div>
                      <div style={{ fontSize: '14px', color: COLORS.lightGreen }}>
                        {selectedPlant.quantitaAcqua} (ogni {selectedPlant.giorniAcqua} giorni)
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Curiosità */}
              <div style={{
                backgroundColor: COLORS.accentGreen + '20',
                padding: 15,
                borderRadius: 12,
                marginBottom: 20
              }}>
                <h3 style={{
                  margin: '0 0 15px 0',
                  color: COLORS.textDark,
                  fontSize: '16px'
                }}>
                  💡 Lo sapevi che...
                </h3>
                {selectedPlant.curiosita.map((fact, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      gap: 10,
                      marginBottom: i < selectedPlant.curiosita.length - 1 ? 12 : 0
                    }}
                  >
                    <span style={{ fontSize: '16px' }}>•</span>
                    <p style={{
                      margin: 0,
                      color: COLORS.textDark,
                      lineHeight: 1.5,
                      fontSize: '14px'
                    }}>
                      {fact}
                    </p>
                  </div>
                ))}
              </div>

              {/* Pulsanti Azione */}
              <div style={{
                display: 'flex',
                gap: 10,
                marginTop: 20
              }}>
                {selectedPlant.myId ? (
                  <>
                    <button
                      onClick={() => {
                        waterPlant(selectedPlant.myId);
                        setSelectedPlant(null);
                        setShowImageOptions(false);
                      }}
                      style={{
                        flex: 1,
                        padding: '14px',
                        backgroundColor: COLORS.militaryGreen,
                        color: COLORS.creamWhite,
                        border: 'none',
                        borderRadius: 12,
                        fontSize: '15px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8
                      }}
                    >
                      💧 Ho innaffiato
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Rimuovere ${selectedPlant.nome}?`)) {
                          removePlant(selectedPlant.myId);
                          setShowImageOptions(false);
                        }
                      }}
                      style={{
                        flex: 1,
                        padding: '14px',
                        backgroundColor: COLORS.alertRed,
                        color: COLORS.creamWhite,
                        border: 'none',
                        borderRadius: 12,
                        fontSize: '15px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8
                      }}
                    >
                      🗑️ Rimuovi
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      addPlant(selectedPlant);
                      setSelectedPlant(null);
                      setShowImageOptions(false);
                    }}
                    disabled={miePiante.some(p => p.nome === selectedPlant.nome)}
                    style={{
                      width: '100%',
                      padding: '14px',
                      backgroundColor: miePiante.some(p => p.nome === selectedPlant.nome) 
                        ? COLORS.lightGreen 
                        : COLORS.militaryGreen,
                      color: COLORS.creamWhite,
                      border: 'none',
                      borderRadius: 12,
                      fontSize: '15px',
                      fontWeight: 'bold',
                      cursor: miePiante.some(p => p.nome === selectedPlant.nome) 
                        ? 'not-allowed' 
                        : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8
                    }}
                  >
                    {miePiante.some(p => p.nome === selectedPlant.nome) 
                      ? '✓ Già aggiunta' 
                      : '➕ Aggiungi alle mie piante'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🎨 ANIMAZIONI CSS */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes slideDown {
          from { 
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
          to { 
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        * {
          box-sizing: border-box;
        }
        body {
          margin: 0;
          padding: 0;
        }
      `}</style>
    </div>
  );
}

