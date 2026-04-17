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
    'c3f56de7-2e5a-4f6e-8d89-6ef2dfb313ce',
    'Viktor Fast Print',
    'copyshop2@goprint.local',
    '081200000004',
    NULL,
    NULL,
    '33e747de0b21ca9151b428e705fb3516:4bc2d047e605ee025b114e5336cd511ebfb2231604a67e978613bdd98d25a0633f7758b9bdace15cd12e9e9251b7e4ffff449ca0ed46f1f8cd26212ac6525809',
    'copy_shop',
    'Kantin Kampus'
  ),
  (
    '0e64804a-3b0e-4bb6-a8b1-912c370428e8',
    'Alya Mahasiswa',
    'user@goprint.local',
    '081200000003',
    '221011700123',
    'Teknik Informatika',
    '04dfce0beafdc02a185f04cf9ed99400:86cfd9163a08f93493c80c0713a62e68cd2d074c050ff38840f3c2f2c0530794b8a021063ebf499c2cecd42ac6d0750f5cb07620f78fac6543cf54cd5473f876',
    'user',
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

INSERT INTO copy_shops (id, user_id, shop_name, location_note, is_active)
VALUES
  (
    'b6378b10-6fcb-4a43-8d54-870d540d0b65',
    '6d49acb3-1c58-4f13-b1ca-b40985a03886',
    'Basement Print Center',
    'Basement Kampus, dekat lift utama',
    TRUE
  ),
  (
    'ef725b85-8aeb-46d8-9402-f632ebf7a7ff',
    'c3f56de7-2e5a-4f6e-8d89-6ef2dfb313ce',
    'Viktor Fast Print',
    'Area kantin kampus, sisi timur',
    TRUE
  )
ON DUPLICATE KEY UPDATE
  shop_name = VALUES(shop_name),
  location_note = VALUES(location_note),
  is_active = VALUES(is_active);

INSERT INTO feedbacks (id, name, nim, study_program, rating, comment)
VALUES
  (
    '2ec18d0f-363d-40c7-9351-8e71f3d6dd48',
    'Alya Mahasiswa',
    '221011700123',
    'Teknik Informatika',
    5,
    'UI GoPrint sudah membantu, tapi akan lebih nyaman kalau feedback publik bisa langsung terlihat di halaman login.'
  ),
  (
    '9c2ca9b7-6034-45cd-9262-884c14a93b2f',
    'Bagas Unpam',
    '221011700451',
    'Sistem Informasi',
    4,
    'Saya suka ide pemesanan online. Akan mantap kalau user bisa pilih gerai fotokopi terdekat.'
  )
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  nim = VALUES(nim),
  study_program = VALUES(study_program),
  rating = VALUES(rating),
  comment = VALUES(comment);
