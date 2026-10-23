const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Remplacez par votre token secret IPinfo
const IPINFO_TOKEN = 'ddecbbefdd0735';

app.get('/', async (req, res) => {
    // 1. Récupérer l'adresse IP du visiteur (en gérant les proxys des hébergeurs cloud)
    let clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    if (clientIp && clientIp.includes(',')) {
        clientIp = clientIp.split(',')[0].trim();
    }

    console.log(`[+] Nouvelle visite détectée ! IP brute/filtrée : ${clientIp}`);

    // 2. Interroger l'API IPinfo pour obtenir les détails
    try {
        const response = await fetch(`https://ipinfo.io/${clientIp}/json?token=${IPINFO_TOKEN}`);
        const data = await response.json();
        
        // 3. Afficher les informations dans VOTRE console de serveur
        console.log("--- INFORMATIONS DE GÉOLOCALISATION ---");
        console.log(`Ville : ${data.city || 'Inconnue'}`);
        console.log(`Région : ${data.region || 'Inconnue'}`);
        console.log(`Pays : ${data.country || 'Inconnu'}`);
        console.log(`Fournisseur (FAI) : ${data.org || 'Inconnu'}`);
        console.log(`Coordonnées approximatives : ${data.loc || 'Inconnues'}`);
        console.log("----------------------------------------");

    } catch (error) {
        console.error("[-] Erreur lors de l'appel à l'API IPinfo :", error);
    }

    // 4. Ce que votre ami voit à l'écran (une page banale pour ne pas éveiller les soupçons)
    res.send(`
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <title>Mini-Jeu en ligne</title>
        </head>
        <body style="font-family: Arial, sans-serif; text-align: center; margin-top: 100px; background-color: #f4f4f9;">
            <div style="background: white; padding: 30px; display: inline-block; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1);">
                <h2>🎮 Chargement du Défi...</h2>
                <p>Connexion au serveur du jeu en cours, veuillez patienter...</p>
            </div>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`Serveur de test démarré sur le port ${PORT}`);
});