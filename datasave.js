// --------------------
// datasave.js
// --------------------

// Default users (edit here)
const usersData = {
  "littendekitten@gmail.com": { password: "Poepje.123", balance: 100 },
};

// Admin emails - deze zien admin-knop
const adminEmails = [
  "littendekitten@gmail.com"
];

// --------------------
// Basic functions
// --------------------
function isAdmin(email){
  return adminEmails.includes(email);
}

function loginUser(email, password){
  if(!usersData[email]) return { success:false, error:"Account does not exist!" };
  if(usersData[email].password !== password) return { success:false, error:"Incorrect password!" };

  localStorage.setItem("kittyUser", email);
  if(localStorage.getItem("balance_" + email) === null){
    localStorage.setItem("balance_" + email, usersData[email].balance);
  }
  return { success:true };
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

// --------------------
// Trade functions
// --------------------
function tradeKittyCoins(fromEmail, toEmail, amount){
  let balance = getBalance(fromEmail);
  if(amount < 1) return { success:false, error:"Amount must be at least 1 KittyCoin." };

  if(balance - amount < 0) return { success:false, error:"Balance cannot go below 0." };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!emailRegex.test(toEmail)) return { success:false, error:"Enter a valid email address." };

  balance -= amount;
  updateBalance(fromEmail, balance);
  return { success:true, balance };
}

// --------------------
// Admin functions
// --------------------
function adminSetBalance(targetEmail, amount){
  if(typeof targetEmail !== "string") return { success:false, error:"Invalid email." };
  if(isNaN(amount) || amount < 0) return { success:false, error:"Invalid amount." };

  if(!usersData[targetEmail]){
    usersData[targetEmail] = { password:"", balance:0 };
  }
  updateBalance(targetEmail, amount);
  return { success:true, balance:getBalance(targetEmail) };
}

function adminAdjustBalance(targetEmail, delta){
  let current = getBalance(targetEmail);
  const newAmount = current + delta;
  if(newAmount < 0) return { success:false, error:"Balance cannot go below 0." };
  updateBalance(targetEmail, newAmount);
  return { success:true, balance:newAmount };
}

function adminVerify(email, password){
  if(!usersData[email]) return { success:false, error:"Account does not exist!" };
  if(usersData[email].password !== password) return { success:false, error:"Incorrect password!" };
  return { success:true };
}

function listAllUsers(){
  const users = new Set();
  for(const key in usersData){ users.add(key); }
  for(let i=0;i<localStorage.length;i++){
    const k = localStorage.key(i);
    if(k.startsWith("balance_")) users.add(k.replace("balance_",""));
  }
  return Array.from(users).sort();
}
