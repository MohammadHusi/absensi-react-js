/**
 * ==============================================================================
 * SISTEM INFORMASI ABSENSI SEKOLAH (SIAM) - SMK MAWADDAH PALENGAAN
 * Google Apps Script Backend (Code.gs)
 * ==============================================================================
 * Dibuat untuk menghandle:
 * 1. Web App HTML Service (doGet)
 * 2. API JSON Endpoints (doGet / doPost)
 * 3. Atomic Database Operations (Google Sheets + LockService)
 * 4. Autentikasi aman berbasis Token & Hash SHA-256
 * 5. Setup otomatis database & seed data awal
 * ==============================================================================
 */

// Konfigurasi Database & Token Secret
const CONFIG = {
  APP_NAME: "SIAM SMK Mawaddah Palengaan",
  SECRET_SALT: "MawaddahPalengaan_Absensi2026_SecureSalt!#",
  TOKEN_EXPIRY_HOURS: 24,
  SHEETS: {
    USERS: "Users",
    CLASSES: "Classes",
    STUDENTS: "Students",
    TEACHERS: "Teachers",
    ATTENDANCE: "Attendance"
  }
};

/**
 * Mendapatkan referensi Spreadsheet aktif
 */
function getDb() {
  return SpreadsheetApp.getActiveSpreadsheet();
}

/**
 * -----------------------------------------------------------------------------
 * 1. ROUTING HTTP (doGet & doPost)
 * -----------------------------------------------------------------------------
 */

/**
 * Handle HTTP GET Request
 * Jika parameter 'action' disertakan -> Mengembalikan JSON API
 * Jika tidak -> Menyajikan antarmuka Web App (Index.html)
 */
function doGet(e) {
  try {
    e = e || { parameter: {} };
    const action = e.parameter.action;

    // Jika dipanggil via API fetch GET
    if (action) {
      const result = handleApiGet(e.parameter);
      return createJsonResponse(result);
    }

    // Default: Sajikan Halaman Web App
    const template = HtmlService.createTemplateFromFile("Index");
    template.appName = CONFIG.APP_NAME;
    
    return template.evaluate()
      .setTitle(CONFIG.APP_NAME)
      .addMetaTag("viewport", "width=device-width, initial-scale=1.0, maximum-scale=1.0")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } catch (err) {
    return createJsonResponse({ status: "error", message: err.toString() });
  }
}

/**
 * Handle HTTP POST Request
 * Mengelola semua mutasi data: Login, CRUD Siswa/Guru/Kelas, dan Input Absensi
 */
function doPost(e) {
  // Gunakan LockService agar tidak terjadi race condition saat banyak pengguna submit bersamaan
  const lock = LockService.getScriptLock();
  try {
    // Tunggu lock hingga 20 detik
    lock.waitLock(20000);

    let payload;
    if (e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        payload = e.parameter;
      }
    } else {
      payload = e.parameter || {};
    }

    const action = payload.action;
    let result = { status: "error", message: "Aksi tidak dikenali." };

    switch (action) {
      case "setupDatabase":
        result = setupDatabase();
        break;
      case "login":
        result = handleLogin(payload.username, payload.password);
        break;
      case "saveAttendanceBatch":
        result = saveAttendanceBatch(payload);
        break;
      case "submitStudentExcuse":
        result = submitStudentExcuse(payload);
        break;
      // Master Data CRUD
      case "saveStudent":
        result = saveStudent(payload.data);
        break;
      case "deleteStudent":
        result = deleteRowById(CONFIG.SHEETS.STUDENTS, payload.id);
        break;
      case "saveTeacher":
        result = saveTeacher(payload.data);
        break;
      case "deleteTeacher":
        result = deleteRowById(CONFIG.SHEETS.TEACHERS, payload.id);
        break;
      case "saveClass":
        result = saveClass(payload.data);
        break;
      case "deleteClass":
        result = deleteRowById(CONFIG.SHEETS.CLASSES, payload.id);
        break;
      case "saveUser":
        result = saveUser(payload.data);
        break;
      case "deleteUser":
        result = deleteRowById(CONFIG.SHEETS.USERS, payload.id);
        break;
      default:
        result = { status: "error", message: "Action '" + action + "' tidak valid." };
    }

    return createJsonResponse(result);
  } catch (err) {
    return createJsonResponse({ status: "error", message: "Server Error: " + err.toString() });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Router untuk API GET
 */
function handleApiGet(params) {
  const action = params.action;
  switch (action) {
    case "getInitialData":
      return getInitialPublicData();
    case "getDashboardSummary":
      return getDashboardSummary(params);
    case "getStudentsByClass":
      return getStudentsByClass(params.class_id, params.date);
    case "getAttendanceHistory":
      return getAttendanceHistory(params);
    case "getStudentDashboard":
      return getStudentDashboard(params.student_id);
    case "getMasterData":
      return getMasterData(params.type);
    case "exportAttendanceCsv":
      return exportAttendanceCsv(params);
    default:
      return { status: "error", message: "Action GET '" + action + "' tidak valid." };
  }
}

/**
 * Helper untuk format response JSON
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * -----------------------------------------------------------------------------
 * 2. AUTENTIKASI & KEAMANAN
 * -----------------------------------------------------------------------------
 */

/**
 * Helper Enkripsi SHA-256 dengan Salt
 */
function hashPassword(password) {
  const salted = password + CONFIG.SECRET_SALT;
  const rawHash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, salted, Utilities.Charset.UTF_8);
  let hashString = "";
  for (let i = 0; i < rawHash.length; i++) {
    let byteVal = rawHash[i];
    if (byteVal < 0) byteVal += 256;
    let byteStr = byteVal.toString(16);
    if (byteStr.length === 1) byteStr = "0" + byteStr;
    hashString += byteStr;
  }
  return hashString;
}

/**
 * Menghasilkan token sesi sederhana
 */
function generateToken(user) {
  const exp = new Date().getTime() + (CONFIG.TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);
  const raw = `${user.id}|${user.username}|${user.role}|${exp}`;
  return Utilities.base64Encode(raw);
}

/**
 * Login Handler
 */
function handleLogin(username, password) {
  if (!username || !password) {
    return { status: "error", message: "Username dan password wajib diisi." };
  }

  const sheet = getSheet(CONFIG.SHEETS.USERS);
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) {
    return { status: "error", message: "Database pengguna masih kosong. Jalankan Setup Database terlebih dahulu." };
  }

  const inputHash = hashPassword(password);
  const usernameClean = username.toString().trim().toLowerCase();

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const uName = row[1].toString().trim().toLowerCase();
    const pHash = row[2].toString();

    if (uName === usernameClean && pHash === inputHash) {
      const user = {
        id: row[0],
        username: row[1],
        full_name: row[3],
        role: row[4],
        class_id: row[5] || "",
        student_id: row[6] || ""
      };

      const token = generateToken(user);
      return {
        status: "success",
        message: "Login berhasil. Selamat datang di SIAM SMK Mawaddah Palengaan!",
        data: {
          user: user,
          token: token
        }
      };
    }
  }

  return { status: "error", message: "Username atau password salah." };
}

/**
 * -----------------------------------------------------------------------------
 * 3. BUSINESS LOGIC & DATA ACCESS (OPTIMIZED BATCH OPERATIONS)
 * -----------------------------------------------------------------------------
 */

/**
 * Mengambil ringkasan awal (Kelas & Info Sekolah)
 */
function getInitialPublicData() {
  const classesSheet = getSheet(CONFIG.SHEETS.CLASSES);
  const classData = classesSheet.getDataRange().getValues();
  const classes = [];
  for (let i = 1; i < classData.length; i++) {
    classes.push({
      id: classData[i][0],
      class_name: classData[i][1],
      academic_year: classData[i][2]
    });
  }

  return {
    status: "success",
    school_name: "SMK Mawaddah Palengaan",
    classes: classes
  };
}

/**
 * Mendapatkan metrik dashboard harian (Admin)
 */
function getDashboardSummary(params) {
  const today = params.date || Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyy-MM-dd");

  const studentCount = Math.max(0, getSheet(CONFIG.SHEETS.STUDENTS).getLastRow() - 1);
  const teacherCount = Math.max(0, getSheet(CONFIG.SHEETS.TEACHERS).getLastRow() - 1);
  const classCount = Math.max(0, getSheet(CONFIG.SHEETS.CLASSES).getLastRow() - 1);

  // Hitung status absensi hari ini
  const attSheet = getSheet(CONFIG.SHEETS.ATTENDANCE);
  const attData = attSheet.getDataRange().getValues();
  
  let hadir = 0, izin = 0, sakit = 0, alpa = 0;
  for (let i = 1; i < attData.length; i++) {
    const rowDate = attData[i][5];
    let rowDateStr = "";
    if (rowDate instanceof Date) {
      rowDateStr = Utilities.formatDate(rowDate, "Asia/Jakarta", "yyyy-MM-dd");
    } else {
      rowDateStr = rowDate.toString().slice(0, 10);
    }

    if (rowDateStr === today) {
      const status = (attData[i][6] || "").toString().toLowerCase();
      if (status === "hadir") hadir++;
      else if (status === "izin") izin++;
      else if (status === "sakit") sakit++;
      else if (status === "alpa") alpa++;
    }
  }

  const totalAbsenHariIni = hadir + izin + sakit + alpa;
  const persentaseHadir = totalAbsenHariIni > 0 ? Math.round((hadir / totalAbsenHariIni) * 100) : 0;

  return {
    status: "success",
    data: {
      date: today,
      total_students: studentCount,
      total_teachers: teacherCount,
      total_classes: classCount,
      today_stats: {
        hadir: hadir,
        izin: izin,
        sakit: sakit,
        alpa: alpa,
        total: totalAbsenHariIni,
        attendance_rate: persentaseHadir
      }
    }
  };
}

/**
 * Mengambil daftar siswa berdasarkan kelas untuk input absensi
 * Sekaligus mengecek apakah sudah ada data absensi pada tanggal tersebut
 */
function getStudentsByClass(classId, dateStr) {
  if (!classId) return { status: "error", message: "Class ID diperlukan." };
  dateStr = dateStr || Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyy-MM-dd");

  const studentSheet = getSheet(CONFIG.SHEETS.STUDENTS);
  const sData = studentSheet.getDataRange().getValues();
  const students = [];

  for (let i = 1; i < sData.length; i++) {
    if (sData[i][3].toString() === classId.toString()) {
      students.push({
        id: sData[i][0],
        nisn: sData[i][1],
        full_name: sData[i][2],
        class_id: sData[i][3],
        gender: sData[i][4],
        parent_phone: sData[i][5],
        status: "Hadir", // default
        notes: "",
        attendance_id: ""
      });
    }
  }

  // Cek apakah absensi tanggal ini sudah diinput sebelumnya (untuk edit hari ini)
  const attSheet = getSheet(CONFIG.SHEETS.ATTENDANCE);
  const attData = attSheet.getDataRange().getValues();

  for (let j = 1; j < attData.length; j++) {
    const row = attData[j];
    let rowDate = row[5];
    if (rowDate instanceof Date) {
      rowDate = Utilities.formatDate(rowDate, "Asia/Jakarta", "yyyy-MM-dd");
    } else {
      rowDate = rowDate.toString().slice(0, 10);
    }

    if (row[3].toString() === classId.toString() && rowDate === dateStr) {
      const sId = row[2].toString();
      const st = students.find(s => s.id.toString() === sId);
      if (st) {
        st.status = row[6];
        st.notes = row[7] || "";
        st.attendance_id = row[0];
      }
    }
  }

  return {
    status: "success",
    data: {
      class_id: classId,
      date: dateStr,
      students: students
    }
  };
}

/**
 * Menyimpan Absensi satu kelas secara Atomic (Batch Update)
 */
function saveAttendanceBatch(payload) {
  const { class_id, teacher_id, date, records } = payload;
  if (!class_id || !records || !records.length) {
    return { status: "error", message: "Data absensi tidak lengkap." };
  }

  const targetDate = date || Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyy-MM-dd");
  const attSheet = getSheet(CONFIG.SHEETS.ATTENDANCE);
  const data = attSheet.getDataRange().getValues();
  const nowTimestamp = new Date();

  // Buat map record yang ada pada tanggal & kelas tersebut
  const existingMap = {};
  for (let i = 1; i < data.length; i++) {
    let rowDate = data[i][5];
    if (rowDate instanceof Date) {
      rowDate = Utilities.formatDate(rowDate, "Asia/Jakarta", "yyyy-MM-dd");
    } else {
      rowDate = rowDate.toString().slice(0, 10);
    }

    if (data[i][3].toString() === class_id.toString() && rowDate === targetDate) {
      const studentId = data[i][2].toString();
      existingMap[studentId] = i + 1; // 1-indexed row number
    }
  }

  const rowsToAppend = [];

  records.forEach(item => {
    const studentId = item.student_id.toString();
    const status = item.status || "Hadir";
    const notes = item.notes || "";

    if (existingMap[studentId]) {
      // Update baris yang sudah ada
      const rowIdx = existingMap[studentId];
      attSheet.getRange(rowIdx, 2).setValue(nowTimestamp);
      attSheet.getRange(rowIdx, 5).setValue(teacher_id || "");
      attSheet.getRange(rowIdx, 7).setValue(status);
      attSheet.getRange(rowIdx, 8).setValue(notes);
    } else {
      // Baris baru
      const newId = "ATT-" + Utilities.getUuid().slice(0, 8);
      rowsToAppend.push([
        newId,
        nowTimestamp,
        studentId,
        class_id,
        teacher_id || "",
        targetDate,
        status,
        notes,
        "" // photo_url/attachment
      ]);
    }
  });

  if (rowsToAppend.length > 0) {
    attSheet.getRange(attSheet.getLastRow() + 1, 1, rowsToAppend.length, rowsToAppend[0].length)
      .setValues(rowsToAppend);
  }

  return {
    status: "success",
    message: `Absensi kelas berhasil disimpan (${records.length} siswa diproses).`
  };
}

/**
 * Siswa mengajukan izin/sakit mandiri
 */
function submitStudentExcuse(payload) {
  const { student_id, class_id, date, status, notes, attachment_url } = payload;
  if (!student_id || !status) {
    return { status: "error", message: "Data pengajuan tidak lengkap." };
  }

  const attSheet = getSheet(CONFIG.SHEETS.ATTENDANCE);
  const newId = "ATT-IZN-" + Utilities.getUuid().slice(0, 8);
  const now = new Date();
  const targetDate = date || Utilities.formatDate(now, "Asia/Jakarta", "yyyy-MM-dd");

  attSheet.appendRow([
    newId,
    now,
    student_id,
    class_id || "",
    "MANDIRI",
    targetDate,
    status, // "Izin" atau "Sakit"
    notes || "Pengajuan mandiri oleh siswa",
    attachment_url || ""
  ]);

  return {
    status: "success",
    message: "Pengajuan " + status + " berhasil dikirimkan ke pihak sekolah."
  };
}

/**
 * Dashboard Siswa: Statistik dan riwayat kehadiran pribadi
 */
function getStudentDashboard(studentId) {
  if (!studentId) return { status: "error", message: "Student ID diperlukan." };

  const attSheet = getSheet(CONFIG.SHEETS.ATTENDANCE);
  const data = attSheet.getDataRange().getValues();

  let hadir = 0, izin = 0, sakit = 0, alpa = 0;
  const logs = [];

  for (let i = 1; i < data.length; i++) {
    if (data[i][2].toString() === studentId.toString()) {
      const status = (data[i][6] || "").toString();
      const lower = status.toLowerCase();
      if (lower === "hadir") hadir++;
      else if (lower === "izin") izin++;
      else if (lower === "sakit") sakit++;
      else if (lower === "alpa") alpa++;

      let dateFormatted = data[i][5];
      if (dateFormatted instanceof Date) {
        dateFormatted = Utilities.formatDate(dateFormatted, "Asia/Jakarta", "dd-MM-yyyy");
      }

      logs.push({
        id: data[i][0],
        date: dateFormatted,
        status: status,
        notes: data[i][7] || "-",
        attachment: data[i][8] || ""
      });
    }
  }

  const total = hadir + izin + sakit + alpa;
  const persentase = total > 0 ? Math.round((hadir / total) * 100) : 0;

  // Urutkan dari yang terbaru
  logs.reverse();

  return {
    status: "success",
    data: {
      stats: {
        hadir: hadir,
        izin: izin,
        sakit: sakit,
        alpa: alpa,
        total: total,
        percentage: persentase
      },
      history: logs.slice(0, 30) // 30 hari terakhir
    }
  };
}

/**
 * Mengambil Riwayat Absensi Terfilter (Untuk Guru & Admin)
 */
function getAttendanceHistory(params) {
  const { class_id, start_date, end_date } = params;
  const attSheet = getSheet(CONFIG.SHEETS.ATTENDANCE);
  const data = attSheet.getDataRange().getValues();

  // Buat lookup siswa
  const sData = getSheet(CONFIG.SHEETS.STUDENTS).getDataRange().getValues();
  const studentMap = {};
  for (let s = 1; s < sData.length; s++) {
    studentMap[sData[s][0].toString()] = {
      nisn: sData[s][1],
      name: sData[s][2]
    };
  }

  // Buat lookup kelas
  const cData = getSheet(CONFIG.SHEETS.CLASSES).getDataRange().getValues();
  const classMap = {};
  for (let c = 1; c < cData.length; c++) {
    classMap[cData[c][0].toString()] = cData[c][1];
  }

  const results = [];
  for (let i = 1; i < data.length; i++) {
    const rowClass = data[i][3].toString();
    let rowDate = data[i][5];
    let rowDateIso = "";
    if (rowDate instanceof Date) {
      rowDateIso = Utilities.formatDate(rowDate, "Asia/Jakarta", "yyyy-MM-dd");
    } else {
      rowDateIso = rowDate.toString().slice(0, 10);
    }

    if (class_id && rowClass !== class_id.toString()) continue;
    if (start_date && rowDateIso < start_date) continue;
    if (end_date && rowDateIso > end_date) continue;

    const studentInfo = studentMap[data[i][2].toString()] || { nisn: "-", name: "Siswa ID: " + data[i][2] };

    results.push({
      id: data[i][0],
      date: rowDateIso,
      class_name: classMap[rowClass] || rowClass,
      student_nisn: studentInfo.nisn,
      student_name: studentInfo.name,
      status: data[i][6],
      notes: data[i][7] || "-"
    });
  }

  // Sort descending tanggal
  results.sort((a, b) => (a.date < b.date ? 1 : -1));

  return {
    status: "success",
    data: results
  };
}

/**
 * -----------------------------------------------------------------------------
 * 4. MASTER DATA CRUD (Students, Teachers, Classes, Users)
 * -----------------------------------------------------------------------------
 */

function getMasterData(type) {
  let sheetName = "";
  if (type === "students") sheetName = CONFIG.SHEETS.STUDENTS;
  else if (type === "teachers") sheetName = CONFIG.SHEETS.TEACHERS;
  else if (type === "classes") sheetName = CONFIG.SHEETS.CLASSES;
  else if (type === "users") sheetName = CONFIG.SHEETS.USERS;
  else return { status: "error", message: "Tipe master data tidak valid." };

  const sheet = getSheet(sheetName);
  const data = sheet.getDataRange().getValues();
  const list = [];

  for (let i = 1; i < data.length; i++) {
    if (type === "students") {
      list.push({
        id: data[i][0],
        nisn: data[i][1],
        full_name: data[i][2],
        class_id: data[i][3],
        gender: data[i][4],
        parent_phone: data[i][5]
      });
    } else if (type === "teachers") {
      list.push({
        id: data[i][0],
        nip: data[i][1],
        full_name: data[i][2],
        subject: data[i][3]
      });
    } else if (type === "classes") {
      list.push({
        id: data[i][0],
        class_name: data[i][1],
        academic_year: data[i][2]
      });
    } else if (type === "users") {
      list.push({
        id: data[i][0],
        username: data[i][1],
        full_name: data[i][3],
        role: data[i][4],
        class_id: data[i][5] || "-",
        created_at: data[i][7] || "-"
      });
    }
  }

  return { status: "success", data: list };
}

function saveStudent(data) {
  const sheet = getSheet(CONFIG.SHEETS.STUDENTS);
  if (data.id) {
    // Edit
    const all = sheet.getDataRange().getValues();
    for (let i = 1; i < all.length; i++) {
      if (all[i][0].toString() === data.id.toString()) {
        const row = i + 1;
        sheet.getRange(row, 2, 1, 5).setValues([[
          data.nisn,
          data.full_name,
          data.class_id,
          data.gender,
          data.parent_phone
        ]]);
        return { status: "success", message: "Data siswa berhasil diperbarui." };
      }
    }
  } else {
    // Baru
    const newId = "STD-" + Utilities.getUuid().slice(0, 6);
    sheet.appendRow([newId, data.nisn, data.full_name, data.class_id, data.gender, data.parent_phone]);
    return { status: "success", message: "Siswa baru berhasil ditambahkan." };
  }
}

function saveTeacher(data) {
  const sheet = getSheet(CONFIG.SHEETS.TEACHERS);
  if (data.id) {
    const all = sheet.getDataRange().getValues();
    for (let i = 1; i < all.length; i++) {
      if (all[i][0].toString() === data.id.toString()) {
        const row = i + 1;
        sheet.getRange(row, 2, 1, 3).setValues([[
          data.nip,
          data.full_name,
          data.subject
        ]]);
        return { status: "success", message: "Data guru berhasil diperbarui." };
      }
    }
  } else {
    const newId = "TCH-" + Utilities.getUuid().slice(0, 6);
    sheet.appendRow([newId, data.nip, data.full_name, data.subject]);
    return { status: "success", message: "Guru baru berhasil ditambahkan." };
  }
}

function saveClass(data) {
  const sheet = getSheet(CONFIG.SHEETS.CLASSES);
  if (data.id) {
    const all = sheet.getDataRange().getValues();
    for (let i = 1; i < all.length; i++) {
      if (all[i][0].toString() === data.id.toString()) {
        const row = i + 1;
        sheet.getRange(row, 2, 1, 2).setValues([[
          data.class_name,
          data.academic_year
        ]]);
        return { status: "success", message: "Data kelas berhasil diperbarui." };
      }
    }
  } else {
    const newId = "CLS-" + Utilities.getUuid().slice(0, 6);
    sheet.appendRow([newId, data.class_name, data.academic_year]);
    return { status: "success", message: "Kelas baru berhasil ditambahkan." };
  }
}

function saveUser(data) {
  const sheet = getSheet(CONFIG.SHEETS.USERS);
  const now = new Date();
  if (data.id) {
    const all = sheet.getDataRange().getValues();
    for (let i = 1; i < all.length; i++) {
      if (all[i][0].toString() === data.id.toString()) {
        const row = i + 1;
        sheet.getRange(row, 2).setValue(data.username);
        if (data.password && data.password.trim() !== "") {
          sheet.getRange(row, 3).setValue(hashPassword(data.password));
        }
        sheet.getRange(row, 4).setValue(data.full_name);
        sheet.getRange(row, 5).setValue(data.role);
        sheet.getRange(row, 6).setValue(data.class_id || "");
        return { status: "success", message: "Pengguna berhasil diperbarui." };
      }
    }
  } else {
    const newId = "USR-" + Utilities.getUuid().slice(0, 6);
    const passHash = hashPassword(data.password || "123456");
    sheet.appendRow([
      newId,
      data.username,
      passHash,
      data.full_name,
      data.role,
      data.class_id || "",
      data.student_id || "",
      now
    ]);
    return { status: "success", message: "Akun pengguna berhasil dibuat." };
  }
}

function deleteRowById(sheetName, id) {
  const sheet = getSheet(sheetName);
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0].toString() === id.toString()) {
      sheet.deleteRow(i + 1);
      return { status: "success", message: "Data berhasil dihapus." };
    }
  }
  return { status: "error", message: "Data tidak ditemukan." };
}

/**
 * -----------------------------------------------------------------------------
 * 5. SETUP OTOMATIS DATABASE & SEED DATA AWAL
 * -----------------------------------------------------------------------------
 */

function setupDatabase() {
  const ss = getDb();

  // 1. Sheet Users
  const userSheet = getOrCreateSheet(ss, CONFIG.SHEETS.USERS);
  userSheet.clear();
  userSheet.appendRow([
    "id", "username", "password_hash", "full_name", "role", "class_id", "student_id", "created_at"
  ]);

  // Format header
  formatHeaderRow(userSheet);

  // Seed Users
  const defaultPasswordHash = hashPassword("admin123");
  const guruPasswordHash = hashPassword("guru123");
  const muridPasswordHash = hashPassword("murid123");
  const now = new Date();

  userSheet.appendRow([
    "USR-001", "admin", defaultPasswordHash, "Administrator Utama", "admin", "", "", now
  ]);
  userSheet.appendRow([
    "USR-002", "guru.ahmad", guruPasswordHash, "Ahmad Baihaqi, S.Pd", "guru", "CLS-01", "", now
  ]);
  userSheet.appendRow([
    "USR-003", "0061234567", muridPasswordHash, "Mohammad Zainal Arifin", "murid", "CLS-01", "STD-001", now
  ]);

  // 2. Sheet Classes
  const classSheet = getOrCreateSheet(ss, CONFIG.SHEETS.CLASSES);
  classSheet.clear();
  classSheet.appendRow(["id", "class_name", "academic_year"]);
  formatHeaderRow(classSheet);
  classSheet.appendRow(["CLS-01", "X (Kelas 10)-A", "2025/2026", "Bisnis Digital"]);
  classSheet.appendRow(["CLS-02", "XI (Kelas 11)-A", "2025/2026", "Bisnis Digital"]);
  classSheet.appendRow(["CLS-03", "XII (Kelas 12)-A", "2025/2026", "Bisnis Digital"]);
  classSheet.appendRow(["CLS-04", "X (Kelas 10)-B", "2025/2026", "Bisnis Digital"]);
  classSheet.appendRow(["CLS-05", "XI (Kelas 11)-B", "2025/2026", "Bisnis Digital"]);
  classSheet.appendRow(["CLS-06", "XII (Kelas 12)-B", "2025/2026", "Bisnis Digital"]);

  // 3. Sheet Students
  const studentSheet = getOrCreateSheet(ss, CONFIG.SHEETS.STUDENTS);
  studentSheet.clear();
  studentSheet.appendRow(["id", "nisn", "full_name", "class_id", "gender", "parent_phone"]);
  formatHeaderRow(studentSheet);

  const sampleStudents = [
    ["STD-001", "0061234567", "Mohammad Zainal Arifin", "CLS-01", "L", "081234567890"],
    ["STD-002", "0061234568", "Siti Nur Haliza", "CLS-01", "P", "081234567891"],
    ["STD-003", "0061234569", "Achmad Fawaid", "CLS-01", "L", "081234567892"],
    ["STD-004", "0061234570", "Nurul Hidayati", "CLS-01", "P", "081234567893"],
    ["STD-005", "0061234571", "Moh. Rizki Maulana", "CLS-01", "L", "081234567894"],
    ["STD-006", "0062234572", "Fatimatuz Zahra", "CLS-02", "P", "081234567895"],
    ["STD-007", "0062234573", "Khoirul Anam", "CLS-02", "L", "081234567896"]
  ];
  sampleStudents.forEach(row => studentSheet.appendRow(row));

  // 4. Sheet Teachers
  const teacherSheet = getOrCreateSheet(ss, CONFIG.SHEETS.TEACHERS);
  teacherSheet.clear();
  teacherSheet.appendRow(["id", "nip", "full_name", "subject"]);
  formatHeaderRow(teacherSheet);
  teacherSheet.appendRow(["TCH-001", "198501122010011003", "Ahmad Baihaqi, S.Pd", "Teknologi Jaringan"]);
  teacherSheet.appendRow(["TCH-002", "199008242015022004", "Nurul Qomariyah, M.Kom", "Pemrograman Web"]);
  teacherSheet.appendRow(["TCH-003", "198203152008011009", "Drs. H. Mahrus Ali", "Pendidikan Agama Islam"]);

  // 5. Sheet Attendance
  const attSheet = getOrCreateSheet(ss, CONFIG.SHEETS.ATTENDANCE);
  attSheet.clear();
  attSheet.appendRow([
    "id", "timestamp", "student_id", "class_id", "teacher_id", "date", "status", "notes", "photo_url"
  ]);
  formatHeaderRow(attSheet);

  // Sample Attendance hari ini
  const todayStr = Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyy-MM-dd");
  attSheet.appendRow(["ATT-001", now, "STD-001", "CLS-01", "TCH-001", todayStr, "Hadir", "Tepat waktu", ""]);
  attSheet.appendRow(["ATT-002", now, "STD-002", "CLS-01", "TCH-001", todayStr, "Hadir", "Tepat waktu", ""]);
  attSheet.appendRow(["ATT-003", now, "STD-003", "CLS-01", "TCH-001", todayStr, "Sakit", "Surat dokter terlampir", ""]);
  attSheet.appendRow(["ATT-004", now, "STD-004", "CLS-01", "TCH-001", todayStr, "Izin", "Acara keluarga", ""]);
  attSheet.appendRow(["ATT-005", now, "STD-005", "CLS-01", "TCH-001", todayStr, "Alpa", "Tanpa keterangan", ""]);

  return {
    status: "success",
    message: "Setup Database Berhasil! Semua tabel (Users, Classes, Students, Teachers, Attendance) dan akun default berhasil dibuat."
  };
}

/**
 * Helper: Ambil Sheet atau Buat jika belum ada
 */
function getOrCreateSheet(ss, name) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}

function getSheet(name) {
  const ss = getDb();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}

/**
 * Styling Header Row di Google Sheets
 */
function formatHeaderRow(sheet) {
  const header = sheet.getRange(1, 1, 1, sheet.getLastColumn());
  header.setBackground("#059669") // Hijau Zamrud / Emerald
        .setFontColor("#FFFFFF")
        .setFontWeight("bold")
        .setHorizontalAlignment("center");
  sheet.setFrozenRows(1);
}
