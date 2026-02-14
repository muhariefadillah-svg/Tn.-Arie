
/**
 * Backend Script for Google Spreadsheet
 */

function doPost(e) {
  var output = {};
  try {
    var contents = e.postData.contents;
    var data = JSON.parse(contents);
    var action = data.action;
    
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Auth & Modul Sheets
    if (action === 'register' || action === 'verify' || action === 'login') {
      var userSheet = ss.getSheetByName("Users") || ss.insertSheet("Users");
      if (userSheet.getLastRow() === 0) {
        userSheet.appendRow(["Email", "Username", "Password", "IsVerified", "VerificationCode"]);
      }
      
      if (action === 'register') output = registerUser(userSheet, data);
      else if (action === 'verify') output = verifyCode(userSheet, data);
      else if (action === 'login') output = loginUser(userSheet, data);
    } 
    else if (action === 'saveModul') {
      var modulSheet = ss.getSheetByName("ModulAjar") || ss.insertSheet("ModulAjar");
      if (modulSheet.getLastRow() === 0) {
        modulSheet.appendRow(["ID", "Subject", "Topic", "Grade", "Fase", "Content", "Date", "User"]);
      }
      modulSheet.appendRow([data.id, data.subject, data.topic, data.grade, data.fase, data.content, data.createdAt, data.username]);
      output = { success: true };
    }
    else {
      output = { success: false, message: "Aksi tidak dikenal" };
    }
  } catch (err) {
    output = { success: false, message: "Error: " + err.toString() };
  }
  
  return ContentService.createTextOutput(JSON.stringify(output))
    .setMimeType(ContentService.MimeType.JSON);
}

function registerUser(sheet, data) {
  var email = data.email;
  var username = data.username;
  var password = data.password;
  var values = sheet.getDataRange().getValues();
  
  for (var i = 1; i < values.length; i++) {
    if (values[i][0] === email) return { success: false, message: "Email sudah ada" };
    if (values[i][1] === username) return { success: false, message: "Username sudah ada" };
  }
  
  var code = Math.floor(100000 + Math.random() * 900000).toString();
  sheet.appendRow([email, username, password, false, code]);
  
  try {
    MailApp.sendEmail(email, "Kode Verifikasi", "Kode Anda adalah: " + code);
  } catch(e) {
    return { success: true, message: "Terdaftar (Gunakan kode: " + code + ")" };
  }
  return { success: true, message: "Kode terkirim" };
}

function verifyCode(sheet, data) {
  var range = sheet.getDataRange();
  var values = range.getValues();
  for (var i = 1; i < values.length; i++) {
    if (values[i][0] === data.email && values[i][4] == data.code) {
      sheet.getRange(i + 1, 4).setValue(true);
      return { success: true };
    }
  }
  return { success: false, message: "Kode salah" };
}

function loginUser(sheet, data) {
  var values = sheet.getDataRange().getValues();
  for (var i = 1; i < values.length; i++) {
    if (values[i][1] === data.username && values[i][2] === data.password) {
      if (values[i][3] == true || values[i][3] == "TRUE") {
        return { success: true, user: { username: values[i][1], email: values[i][0] } };
      }
      return { success: false, message: "Email belum diverifikasi" };
    }
  }
  return { success: false, message: "Login gagal" };
}
