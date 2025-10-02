// Alle users data ophalen of initialiseren
let usersData = JSON.parse(localStorage.getItem("usersData")) || {};

// Admin emails en wachtwoord
const adminEmails = ["admin@gmail.com"];
const adminPassword = "admin";

// Huidige ingelogde gebruiker
function getCurrentUser() {
    return localStorage.getItem("currentUser");
}

// Login
function loginUser(email, password) {
    if (!usersData[email]) return { success: false, error: "User does not exist." };
    if (usersData[email].password !== password) return { success: false, error: "Incorrect password." };
    localStorage.setItem("currentUser", email);
    return { success: true };
}

// Register
function registerUser(email, password) {
    if (usersData[email]) return { success: false, error: "User already exists." };
    usersData[email] = { password: password, balance: 0 };
    saveUsers();
    localStorage.setItem("currentUser", email);
    return { success: true };
}

// Logout
function logoutUser() {
    localStorage.removeItem("currentUser");
}

// Admin check
function isAdmin(email) {
    return adminEmails.includes(email);
}

// Admin password verify
function adminVerify(email, pass) {
    if (!isAdmin(email)) return { success: false, error: "Not admin." };
    if (pass !== adminPassword) return { success: false, error: "Incorrect admin password." };
    return { success: true };
}

// Get balance
function getBalance(email) {
    if (!usersData[email]) return 0;
    return usersData[email].balance;
}

// Update balance
function updateBalance(email, newBalance) {
    if (!usersData[email]) usersData[email] = { password: "", balance: newBalance };
    else usersData[email].balance = newBalance;
    saveUsers();
}

// Trade KittyCoins
function tradeKittyCoins(fromEmail, toEmail, amount) {
    let senderBalance = getBalance(fromEmail);

    if (amount < 1) return { success: false, error: "Amount must be at least 1 KittyCoin." };
    if (senderBalance - amount < 0) return { success: false, error: "Balance cannot go below 0." };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(toEmail)) return { success: false, error: "Enter a valid email address." };

    // Sender
    senderBalance -= amount;
    updateBalance(fromEmail, senderBalance);

    // Receiver
    let receiverBalance = getBalance(toEmail);
    receiverBalance += amount;
    updateBalance(toEmail, receiverBalance);

    return { success: true, balance: senderBalance };
}

// Admin set balance
function adminSetBalance(email, amount) {
    updateBalance(email, amount);
}

// Haal alle users op
function getAllUsersData() {
    const allUsers = Object.keys(usersData).map(email=>{
        return { email: email, balance: usersData[email].balance };
    });
    const normalUsers = allUsers.filter(u=>!isAdmin(u.email));
    const adminUsers = allUsers.filter(u=>isAdmin(u.email));
    return { normalUsers, adminUsers };
}

// Opslaan helper
function saveUsers() {
    localStorage.setItem("usersData", JSON.stringify(usersData));
}
