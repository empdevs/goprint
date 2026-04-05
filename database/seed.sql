USE goprint_db;

INSERT INTO users (id, full_name, email, phone, nim, study_program, password_hash, role, campus_location)
VALUES
  (
    '8f94516d-31b2-47db-ab3b-65b0db0caf38',
    'Admin GoPrint',
    'admin@goprint.local',
    '081200000001',
    NULL,
    NULL,
    '7a26baf66792f6e74c4ba412ff568c9c:ca28bed3cc04234a09b952ab48c4090f8fec026855b0b9e9327b0e423df497e3a455320a98bae20b0b843d2dddb85ce1273dad9238b0e8115e533d9a3fd50a31',
    'admin',
    'Gedung Viktor Lt. 1'
  ),
  (
    '6d49acb3-1c58-4f13-b1ca-b40985a03886',
    'Basement Print Center',
    'copyshop@goprint.local',
    '081200000002',
    NULL,
    NULL,
    '33e747de0b21ca9151b428e705fb3516:4bc2d047e605ee025b114e5336cd511ebfb2231604a67e978613bdd98d25a0633f7758b9bdace15cd12e9e9251b7e4ffff449ca0ed46f1f8cd26212ac6525809',
    'copy_shop',
    'Basement Kampus'
  ),
  (
    '0e64804a-3b0e-4bb6-a8b1-912c370428e8',
    'Alya Mahasiswa',
    'student@goprint.local',
    '081200000003',
    '221011700123',
    'Teknik Informatika',
    '04dfce0beafdc02a185f04cf9ed99400:86cfd9163a08f93493c80c0713a62e68cd2d074c050ff38840f3c2f2c0530794b8a021063ebf499c2cecd42ac6d0750f5cb07620f78fac6543cf54cd5473f876',
    'student',
    'Gedung Viktor Lt. 5'
  )
ON DUPLICATE KEY UPDATE
  full_name = VALUES(full_name),
  phone = VALUES(phone),
  nim = VALUES(nim),
  study_program = VALUES(study_program),
  password_hash = VALUES(password_hash),
  role = VALUES(role),
  campus_location = VALUES(campus_location);
