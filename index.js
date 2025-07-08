const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./task-tracker.db", (err) => {
  if (err) return console.error(err.message);
  console.log("SQLite connection established.");
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS drivers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS vehicles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      plate TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS engineers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      branch TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS missions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      driver_id INTEGER,
      vehicle_id INTEGER,
      engineers TEXT,
      start_time TEXT,
      end_time TEXT,
      status TEXT
    )
  `);

  db.get("SELECT COUNT(*) as count FROM drivers", (err, row) => {
    if (err) {
      console.error("Error during data validation:", err.message);
      return;
    }

    if (row && row.count === 0) {
      console.log("Test data adding...");
      db.run(
        `INSERT INTO drivers (name) VALUES ('Ahmet Demir'), ('Mehmet Yıldız'), ('Mustafa Kara'), ('Zeynep Yılmaz'), ('Ali Şahin'),
('Hasan Aydın'), ('Emre Çelik'), ('Murat Koç'), ('Fatma Arslan'), ('Ramazan Güneş')`
      );
      db.run(
        `INSERT INTO vehicles (plate) VALUES ('06 ABC 123'), ('34 XYZ 987'), ('06 KTR 529'), ('34 YDZ 218'), ('35 HLM 803'), ('01 BKC 740'), ('16 NAR 651'), ('42 RMT 374'), ('07 ZPL 986'), ('21 DKN 123'), ('55 EYT 430'), ('61 VSK 209')`
      );
      db.run(`INSERT INTO engineers (name, branch) VALUES 
        ('Ali Yıldız', 'Çevre'),
        ('Mehmet Koç', 'İnşaat'),
        ('Ayşe Güneş', 'Ziraat'),
        ('Abdullah Turgut', 'Elektrik-Elektronik'),
        ('Serkan Aydınlı', 'Maden'),
        ('Hasan Demir', 'Bilgisayar')
      `);
    }
  });
});

app.get("/", (req, res) => {
  res.send("Task Tracker Backend is now running...");
});

app.post("/missions", (req, res) => {
  const { driver_id, vehicle_id, engineers, start_time, end_time } = req.body;
  const status = "active";
  const engineersStr = JSON.stringify(engineers);

  const sql = `
    INSERT INTO missions (driver_id, vehicle_id, engineers, start_time, end_time, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.run(
    sql,
    [driver_id, vehicle_id, engineersStr, start_time, end_time, status],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    }
  );
});

app.get("/missions", (req, res) => {
  const sql = `
    SELECT missions.*, 
           drivers.name as driver_name, 
           vehicles.plate as plate_number
    FROM missions
    JOIN drivers ON drivers.id = missions.driver_id
    JOIN vehicles ON vehicles.id = missions.vehicle_id
    ORDER BY missions.id DESC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const formatted = rows.map((row) => ({
      ...row,
      engineers: JSON.parse(row.engineers),
    }));

    res.json(formatted);
  });
});

app.delete("/missions/:id", (req, res) => {
  const missionId = req.params.id;

  db.run(`DELETE FROM missions WHERE id = ?`, [missionId], function (err) {
    if (err) {
      console.error("Mission deletion error:", err.message);
      return res.status(500).json({ error: err.message });
    }

    res.json({ success: true });
  });
});

app.put("/missions/:id/complete", (req, res) => {
  const missionId = req.params.id;

  db.run(
    `UPDATE missions SET status = 'completed' WHERE id = ?`,
    [missionId],
    function (err) {
      if (err) {
        console.error("Mission completion error:", err.message);
        return res.status(500).json({ error: err.message });
      }

      res.json({ success: true });
    }
  );
});

app.get("/available-drivers", (req, res) => {
  db.all(
    `
    SELECT * FROM drivers WHERE id NOT IN (
      SELECT driver_id FROM missions WHERE status = 'active'
    )
  `,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

app.get("/available-vehicles", (req, res) => {
  db.all(
    `
    SELECT * FROM vehicles WHERE id NOT IN (
      SELECT vehicle_id FROM missions WHERE status = 'active'
    )
  `,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

app.get("/available-engineers", (req, res) => {
  db.all(`SELECT * FROM engineers`, [], (err, engineers) => {
    if (err) return res.status(500).json({ error: err.message });

    db.all(
      `SELECT engineers FROM missions WHERE status = 'active'`,
      [],
      (err2, rows) => {
        if (err2) return res.status(500).json({ error: err2.message });

        const usedIds = new Set();

        rows.forEach((row) => {
          try {
            const engs = JSON.parse(row.engineers);
            engs.forEach((e) => usedIds.add(e.id));
          } catch {}
        });

        const available = engineers.filter((e) => !usedIds.has(e.id));
        res.json(available);
      }
    );
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT} address.`);
});
