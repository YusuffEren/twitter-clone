-- ============================================
-- TWITTER VERİTABANI ÖRNEK VERİLERİ
-- Her tablo için 10 kayıt
-- ============================================

-- ============================================
-- 1. USERS TABLOSU (10 Kullanıcı)
-- ============================================
INSERT INTO users (username, email, password_hash, display_name, bio, profile_image, created_at, is_verified) VALUES
('ahmetyilmaz', 'ahmet@email.com', 'hash123abc', 'Ahmet Yılmaz', 'Yazılım geliştirici | İstanbul', 'ahmet.jpg', '2023-01-15 10:30:00', TRUE),
('aylozengin', 'ayse@email.com', 'hash456def', 'Ayşe Özengin', 'Dijital pazarlama uzmanı', 'ayse.jpg', '2023-02-20 14:45:00', FALSE),
('mehmetdemir', 'mehmet@email.com', 'hash789ghi', 'Mehmet Demir', 'Fotoğrafçı | Doğa aşığı', 'mehmet.jpg', '2023-03-10 09:15:00', TRUE),
('fatmakaya', 'fatma@email.com', 'hashabc123', 'Fatma Kaya', 'Öğretmen | Kitap kurdu', 'fatma.jpg', '2023-04-05 16:20:00', FALSE),
('aliozturk', 'ali@email.com', 'hashdef456', 'Ali Öztürk', 'Girişimci | Startup founder', 'ali.jpg', '2023-05-12 11:00:00', TRUE),
('zeynepcelik', 'zeynep@email.com', 'hashghi789', 'Zeynep Çelik', 'Grafik tasarımcı', 'zeynep.jpg', '2023-06-18 13:30:00', FALSE),
('mustafasahin', 'mustafa@email.com', 'hash111aaa', 'Mustafa Şahin', 'Müzisyen | Gitarist', 'mustafa.jpg', '2023-07-22 15:45:00', FALSE),
('elifyildiz', 'elif@email.com', 'hash222bbb', 'Elif Yıldız', 'Doktor | Sağlık haberleri', 'elif.jpg', '2023-08-30 10:10:00', TRUE),
('emreaktas', 'emre@email.com', 'hash333ccc', 'Emre Aktaş', 'Spor yazarı | Futbol fanatiği', 'emre.jpg', '2023-09-14 12:25:00', FALSE),
('serapkoc', 'serap@email.com', 'hash444ddd', 'Serap Koç', 'Aşçı | Yemek tarifleri', 'serap.jpg', '2023-10-08 17:00:00', FALSE);

-- ============================================
-- 2. TWEETS TABLOSU (10 Tweet)
-- ============================================
INSERT INTO tweets (user_id, content, created_at, like_count, retweet_count) VALUES
(1, 'Bugün yeni bir proje başlattık! #yazılım #teknoloji', '2024-01-10 09:00:00', 45, 12),
(2, 'Dijital pazarlamada 2024 trendleri hakkında blog yazım yayında! #dijitalpazarlama', '2024-01-11 10:30:00', 32, 8),
(3, 'Kapadokya''dan muhteşem manzaralar #fotoğrafçılık #türkiye', '2024-01-12 14:15:00', 128, 45),
(4, 'Yeni okuduğum kitap: Suç ve Ceza. Harika! #kitap #okuma', '2024-01-13 16:45:00', 67, 15),
(5, 'Startup yolculuğumuzda önemli bir adım attık! #girişimcilik', '2024-01-14 11:20:00', 89, 23),
(6, 'Yeni tasarım çalışmam hazır! Yorumlarınızı bekliyorum #tasarım', '2024-01-15 13:00:00', 54, 11),
(7, 'Bu akşam canlı konser var! Herkesi bekliyorum #müzik #konser', '2024-01-16 18:30:00', 76, 28),
(8, 'Kış aylarında bağışıklık sisteminizi güçlendirin! #sağlık', '2024-01-17 09:45:00', 112, 56),
(9, 'Galatasaray şampiyonluğa koşuyor! #spor #futbol', '2024-01-18 20:00:00', 234, 89),
(10, 'Bugünkü tarifim: Mantı! Tarif linkte #yemek #tarif', '2024-01-19 12:30:00', 98, 34);

-- ============================================
-- 3. LIKES TABLOSU (10 Beğeni)
-- ============================================
INSERT INTO likes (user_id, tweet_id, created_at) VALUES
(2, 1, '2024-01-10 09:30:00'),
(3, 1, '2024-01-10 10:00:00'),
(4, 2, '2024-01-11 11:00:00'),
(5, 3, '2024-01-12 15:00:00'),
(6, 3, '2024-01-12 15:30:00'),
(7, 4, '2024-01-13 17:00:00'),
(8, 5, '2024-01-14 12:00:00'),
(9, 6, '2024-01-15 14:00:00'),
(10, 7, '2024-01-16 19:00:00'),
(1, 8, '2024-01-17 10:00:00');

-- ============================================
-- 4. RETWEETS TABLOSU (10 Retweet)
-- ============================================
INSERT INTO retweets (user_id, tweet_id, created_at) VALUES
(3, 1, '2024-01-10 11:00:00'),
(4, 1, '2024-01-10 12:00:00'),
(5, 2, '2024-01-11 13:00:00'),
(6, 3, '2024-01-12 16:00:00'),
(7, 3, '2024-01-12 17:00:00'),
(8, 4, '2024-01-13 18:00:00'),
(9, 5, '2024-01-14 13:00:00'),
(10, 6, '2024-01-15 15:00:00'),
(1, 7, '2024-01-16 20:00:00'),
(2, 8, '2024-01-17 11:00:00');

-- ============================================
-- 5. FOLLOWS TABLOSU (10 Takip İlişkisi)
-- ============================================
INSERT INTO follows (follower_id, following_id, created_at) VALUES
(1, 2, '2023-03-01 10:00:00'),
(1, 3, '2023-03-02 11:00:00'),
(2, 1, '2023-03-03 12:00:00'),
(2, 4, '2023-03-04 13:00:00'),
(3, 1, '2023-03-05 14:00:00'),
(4, 5, '2023-03-06 15:00:00'),
(5, 6, '2023-03-07 16:00:00'),
(6, 7, '2023-03-08 17:00:00'),
(7, 8, '2023-03-09 18:00:00'),
(8, 9, '2023-03-10 19:00:00');

-- ============================================
-- 6. COMMENTS TABLOSU (10 Yorum)
-- ============================================
INSERT INTO comments (user_id, tweet_id, content, created_at) VALUES
(2, 1, 'Harika bir proje! Başarılar dilerim.', '2024-01-10 09:45:00'),
(3, 1, 'Hangi teknolojileri kullanıyorsunuz?', '2024-01-10 10:15:00'),
(4, 2, 'Çok faydalı bilgiler, teşekkürler!', '2024-01-11 11:30:00'),
(5, 3, 'Muhteşem fotoğraflar! Hangi kamera?', '2024-01-12 15:15:00'),
(6, 4, 'Bu kitabı ben de okumak istiyorum.', '2024-01-13 17:15:00'),
(7, 5, 'Tebrikler! Detayları paylaşır mısın?', '2024-01-14 12:30:00'),
(8, 6, 'Çok profesyonel görünüyor!', '2024-01-15 13:45:00'),
(9, 7, 'Keşke gelebilsem! Kayıt olacak mı?', '2024-01-16 18:45:00'),
(10, 8, 'Çok değerli bilgiler, teşekkürler doktor!', '2024-01-17 10:15:00'),
(1, 9, 'İnşallah bu sene şampiyon oluruz!', '2024-01-18 20:30:00');

-- ============================================
-- 7. HASHTAGS TABLOSU (10 Hashtag)
-- ============================================
INSERT INTO hashtags (tag_name) VALUES
('yazılım'),
('teknoloji'),
('dijitalpazarlama'),
('fotoğrafçılık'),
('türkiye'),
('kitap'),
('girişimcilik'),
('sağlık'),
('spor'),
('yemek');

-- ============================================
-- 8. TWEET_HASHTAGS TABLOSU (10 Tweet-Hashtag İlişkisi)
-- ============================================
INSERT INTO tweet_hashtags (tweet_id, hashtag_id) VALUES
(1, 1),
(1, 2),
(2, 3),
(3, 4),
(3, 5),
(4, 6),
(5, 7),
(8, 8),
(9, 9),
(10, 10);

