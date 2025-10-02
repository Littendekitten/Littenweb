// Check of een gebruiker is ingelogd
function getCurrentUser() {
    return localStorage.getItem("kittyUser");
}

// Login functie
function loginUser(email, password) {
    let storedPassword = localStorage.getItem("user_" + email);
    if (!storedPassword) return { success: false, error: "Account does not exist!" };
    if (storedPassword !== password) return { success: false, error: "Incorrect password!" };
    localStorage.setItem("kittyUser", email);
    if (!localStorage.getItem("balance_" + email)) {
        localStorage.setItem("balance_" + email, 0); // start balance 0
    }
    return { success: true };
}

// Register functie
function registerUser(email, password) {
    if (localStorage.getItem("user_" + email)) {
        return { success: false, error: "Account already exists!" };
    }
    localStorage.setItem("user_" + email, password);
    localStorage.setItem("balance_" + email, 0); // start balance 0
    return { success: true };
}

// Logout
function logoutUser() {
    localStorage.removeItem("kittyUser");
}

// Balance ophalen
function getBalance(email) {
    return parseInt(localStorage.getItem("balance_" + email)) || 0;
}

// Balance updaten
function updateBalance(email, amount) {
    localStorage.setItem("balance_" + email, amount);
}

// Trade uitvoeren
function tradeKittyCoins(fromEmail, toEmail, amount) {
    let balance = getBalance(fromEmail);
    if (amount < 1) return { success: false, error: "Amount must be at least 1 KittyCoin." };
    if (amount > balance) return { success: false, error: "Not enough KittyCoins." };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(toEmail)) return { success: false, error: "Invalid email address." };

    balance -= amount;
    updateBalance(fromEmail, balance);
    return { success: true, balance };
}
