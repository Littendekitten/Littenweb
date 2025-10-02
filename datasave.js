// --------------------
// USERS DATA - Edit here for default accounts
// --------------------
const usersData = {
  "littendekitten@gmail.com": { password: "Poepje.123", balance: 100 },
};

// Login function
function loginUser(email, password){
  if(!usersData[email]) return { success: false, error: "Account does not exist!" };
  if(usersData[email].password !== password) return { success: false, error: "Incorrect password!" };

  localStorage.setItem("kittyUser", email); // session
  if(localStorage.getItem("balance_" + email) === null){
    localStorage.setItem("balance_" + email, usersData[email].balance);
  }
  return { success: true };
}

// Logout
function logoutUser(){
  localStorage.removeItem("kittyUser");
}

// Get current logged-in user
function getCurrentUser(){
  return localStorage.getItem("kittyUser");
}

// Get balance
function getBalance(email){
  return parseInt(localStorage.getItem("balance_" + email)) || 0;
}

// Update balance
function updateBalance(email, amount){
  localStorage.setItem("balance_" + email, amount);
}

// Trade function
function tradeKittyCoins(fromEmail, toEmail, amount){
  let balance = getBalance(fromEmail);
  if(amount < 1) return { success: false, error: "Amount must be at least 1 KittyCoin." };
  if(amount > balance) return { success: false, error: "Not enough KittyCoins." };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!emailRegex.test(toEmail)) return { success: false, error: "Enter a valid email address." };

  balance -= amount;
  updateBalance(fromEmail, balance);

  return { success: true, balance };
}
