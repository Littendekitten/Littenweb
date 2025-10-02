// --------------------
// datasave.js
// --------------------

// Default users (edit here)
const usersData = {

};

// Admin emails - voeg hier admins toe
const adminEmails = [
  "littendekitten@gmail.com" // voorbeeld: deze email is admin
];

// --- Basic data functions ---

function isAdmin(email) {
  return adminEmails.includes(email);
}

function loginUser(email, password){
  if(!usersData[email]) return { success: false, error: "Account does not exist!" };
  if(usersData[email].password !== password) return { success: false, error: "Incorrect password!" };

  localStorage.setItem("kittyUser", email); // session
  if(localStorage.getItem("balance_" + email) === null){
    localStorage.setItem("balance_" + email, usersData[email].balance);
  }
  return { success: true };
}

function logoutUser(){
  localStorage.removeItem("kittyUser");
}

function getCurrentUser(){
  return localStorage.getItem("kittyUser");
}

function getBalance(email){
  return parseInt(localStorage.getItem("balance_" + email)) || 0;
}

function updateBalance(email, amount){
  localStorage.setItem("balance_" + email, amount);
}

// min balance per user (optional)
// stored as "min_balance_email" in localStorage
function getMinBalance(email){
  return parseInt(localStorage.getItem("min_balance_" + email)) || 0;
}
function setMinBalance(email, minAmount){
  localStorage.setItem("min_balance_" + email, minAmount);
}

// Trade function (normal users)
function tradeKittyCoins(fromEmail, toEmail, amount){
  let balance = getBalance(fromEmail);
  if(amount < 1) return { success: false, error: "Amount must be at least 1 KittyCoin." };

  const minAllowed = getMinBalance(fromEmail);
  if(balance - amount < minAllowed) return { success: false, error: `You must keep at least ${minAllowed} KittyCoins.` };

  if(amount > balance) return { success: false, error: "Not enough KittyCoins." };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!emailRegex.test(toEmail)) return { success: false, error: "Enter a valid email address." };

  // subtract from sender
  balance -= amount;
  updateBalance(fromEmail, balance);

  // optionally add to recipient if you want:
  // let recBalance = getBalance(toEmail);
  // updateBalance(toEmail, recBalance + amount);

  return { success: true, balance };
}

// --- Admin functions ---

// Set a user's balance directly (admin)
function adminSetBalance(targetEmail, amount){
  if(typeof targetEmail !== "string") return { success: false, error: "Invalid email." };
  if(isNaN(amount) || amount < 0) return { success: false, error: "Invalid amount." };

  // ensure user exists in usersData or create minimal entry
  if(!usersData[targetEmail]){
    // create a placeholder user entry if you want
    usersData[targetEmail] = { password: "", balance: 0 };
  }
  updateBalance(targetEmail, amount);
  return { success: true, balance: getBalance(targetEmail) };
}

// Adjust user's balance by delta (admin subtract/add)
function adminAdjustBalance(targetEmail, delta){
  let current = getBalance(targetEmail);
  const minAllowed = getMinBalance(targetEmail);
  const newAmount = current + delta;
  if(newAmount < minAllowed) return { success: false, error: `Cannot set balance below min (${minAllowed}).` };
  if(newAmount < 0) return { success: false, error: "Balance cannot go below 0." };
  updateBalance(targetEmail, newAmount);
  return { success: true, balance: newAmount };
}

// Admin verify password (for re-auth)
function adminVerify(email, password){
  if(!usersData[email]) return { success: false, error: "Account does not exist!" };
  if(usersData[email].password !== password) return { success: false, error: "Incorrect password!" };
  return { success: true };
}

// Helper: list all users known (from usersData or localStorage balances)
function listAllUsers(){
  const users = new Set();
  // from usersData
  for(const key in usersData){
    users.add(key);
  }
  // from localStorage balances
  for(let i=0;i<localStorage.length;i++){
    const k = localStorage.key(i);
    if(k.startsWith("balance_")){
      users.add(k.replace("balance_",""));
    }
  }
  return Array.from(users).sort();
}
