// --------------------
// USERS DATA - alleen hier wijzigen
// --------------------
const usersData = {
  "littendekitten@gmail.com": { password: "1234", balance: 0 },
  "otheruser@example.com": { password: "abcd", balance: 50 }
};

// Functie: login
function loginUser(email, password){
  if(!usersData[email]) return { success: false, error: "Account does not exist!" };
  if(usersData[email].password !== password) return { success: false, error: "Incorrect password!" };
  localStorage.setItem("kittyUser", email); // session
  if(localStorage.getItem("balance_" + email) === null){
    localStorage.setItem("balance_" + email, usersData[email].balance);
  }
  return { success: true };
}

// Functie: register
function registerUser(email, password){
  if(usersData[email]) return { success: false, error: "Account already exists!" };
  usersData[email] = { password, balance: 0 };
  localStorage.setItem("balance_" + email, 0);
  return { success: true };
}

// Balance ophalen
function getBalance(email){
  return parseInt(localStorage.getItem("balance_" + email)) || 0;
}

// Balance updaten
function updateBalance(email, amount){
  localStorage.setItem("balance_" + email, amount);
}

// Trade uitvoeren
function tradeKittyCoins(fromEmail, toEmail, amount){
  let balance = getBalance(fromEmail);
  if(amount < 1) return { success: false, error: "Amount must be at least 1 KittyCoin." };
  if(amount > balance) return { success: false, error: "Not enough KittyCoins." };
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!emailRegex.test(toEmail)) return { success: false, error: "Invalid email address." };

  balance -= amount;
  updateBalance(fromEmail, balance);
  return { success: true, balance };
}

// Logout
function logoutUser(){
  localStorage.removeItem("kittyUser");
}

// Huidige user
function getCurrentUser(){
  return localStorage.getItem("kittyUser");
}
