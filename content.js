const API_ENDPOINT = "https://safebrowsing.googleapis.com/v4/threatMatches:find?key=AIzaSyAP3iAXqYFcRGrZbwF1EGxH8HTxw_Rjkpk";

// Fonction pour marquer les liens frauduleux
function markFraudulentLink(linkElement) {
    linkElement.style.border = "2px solid red";
    linkElement.title = "This link is potentially fraudulent";
}

// Fonction pour marquer les liens sûrs
function markSafeLink(linkElement) {
    linkElement.style.border = "2px solid green";
    linkElement.title = "This link is safe";
}

// Fonction pour vérifier les liens sur la page
function checkLinks() {
    // Récupère tous les liens sur la page
    const links = document.querySelectorAll("a[href], iframe[src], form[action]");
    const urlsToCheck = Array.from(links).map((link) => {
        if (link.tagName === "A") return link.href;
        if (link.tagName === "IFRAME") return link.src;
        if (link.tagName === "FORM") return link.action;
    });

    if (urlsToCheck.length === 0) {
        return;
    }

    // Préparation des données pour l'API
    const body = {
        client: {
            clientId: "night", // Identifiant de votre projet
            clientVersion: "1.0.0",
        },
        threatInfo: {
            threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APP", "THREAT_TYPE_UNSPECIFIED"],
            platformTypes: ["ANY_PLATFORM"],
            threatEntryTypes: ["URL"],
            threatEntries: urlsToCheck.map((url) => ({ url })),
        },
    };

    // Appel à l'API Safe Browsing   
    fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })
    .then((response) => response.json())
    .then((data) => {
        const fraudulentUrls = data.matches ? data.matches.map((match) => match.threat.url) : [];

        // Marquer les liens en fonction des résultats
        links.forEach((link) => {
            let urlToCheck = "";
            if (link.tagName === "A") urlToCheck = link.href;
            if (link.tagName === "IFRAME") urlToCheck = link.src;
            if (link.tagName === "FORM") urlToCheck = link.action;

            if (fraudulentUrls.includes(urlToCheck)) {
                markFraudulentLink(link);
            } else {
                markSafeLink(link);
            }
        });
    })
    .catch((error) => {
        console.error("Error checking links:", error);
    });
}

// Vérifie les liens dès que le script est exécuté
checkLinks();

