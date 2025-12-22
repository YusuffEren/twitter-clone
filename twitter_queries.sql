-- ============================================
-- TWITTER VERİTABANI - 10 ÖNEMLİ SORGU
-- Her sorgu açıklamalı olarak hazırlanmıştır
-- ============================================

-- ============================================
-- SORGU 1: En Çok Takipçisi Olan Kullanıcılar
-- Açıklama: Influencer analizi için kullanılır.
-- Platform üzerinde en popüler kullanıcıları listeler.
-- ============================================
SELECT 
    u.user_id,
    u.username,
    u.display_name,
    u.is_verified,
    COUNT(f.follower_id) AS takipci_sayisi
FROM users u
LEFT JOIN follows f ON u.user_id = f.following_id
GROUP BY u.user_id, u.username, u.display_name, u.is_verified
ORDER BY takipci_sayisi DESC
LIMIT 10;

-- ============================================
-- SORGU 2: En Çok Beğeni Alan Tweetler
-- Açıklama: Popüler içerik analizi için kullanılır.
-- Viral olan tweetleri bulmak için önemlidir.
-- ============================================
SELECT 
    t.tweet_id,
    u.username,
    u.display_name,
    t.content,
    t.like_count,
    t.retweet_count,
    t.created_at
FROM tweets t
JOIN users u ON t.user_id = u.user_id
ORDER BY t.like_count DESC
LIMIT 10;

-- ============================================
-- SORGU 3: Belirli Bir Hashtag'i İçeren Tweetler
-- Açıklama: Trend analizi için kullanılır.
-- Örnek: #teknoloji hashtag'ini içeren tweetler
-- ============================================
SELECT 
    t.tweet_id,
    u.username,
    t.content,
    h.tag_name AS hashtag,
    t.created_at
FROM tweets t
JOIN users u ON t.user_id = u.user_id
JOIN tweet_hashtags th ON t.tweet_id = th.tweet_id
JOIN hashtags h ON th.hashtag_id = h.hashtag_id
WHERE h.tag_name = 'teknoloji'
ORDER BY t.created_at DESC;

-- ============================================
-- SORGU 4: Bir Kullanıcının Timeline'ı
-- Açıklama: Kullanıcının takip ettiği kişilerin tweetlerini gösterir.
-- Örnek: user_id = 1 olan kullanıcının timeline'ı
-- ============================================
SELECT 
    t.tweet_id,
    u.username,
    u.display_name,
    u.profile_image,
    t.content,
    t.like_count,
    t.retweet_count,
    t.created_at
FROM tweets t
JOIN users u ON t.user_id = u.user_id
WHERE t.user_id IN (
    SELECT following_id 
    FROM follows 
    WHERE follower_id = 1
)
ORDER BY t.created_at DESC
LIMIT 20;

-- ============================================
-- SORGU 5: Karşılıklı Takipleşenler (Mutual Follows)
-- Açıklama: Birbirini takip eden kullanıcıları bulur.
-- Arkadaşlık ilişkilerini analiz etmek için kullanılır.
-- ============================================
SELECT 
    u1.username AS kullanici1,
    u2.username AS kullanici2,
    f1.created_at AS takip_tarihi
FROM follows f1
JOIN follows f2 ON f1.follower_id = f2.following_id 
    AND f1.following_id = f2.follower_id
JOIN users u1 ON f1.follower_id = u1.user_id
JOIN users u2 ON f1.following_id = u2.user_id
WHERE f1.follower_id < f1.following_id;

-- ============================================
-- SORGU 6: Son 7 Günde En Aktif Kullanıcılar
-- Açıklama: Aktivite analizi için kullanılır.
-- En çok tweet atan kullanıcıları listeler.
-- ============================================
SELECT 
    u.user_id,
    u.username,
    u.display_name,
    COUNT(t.tweet_id) AS tweet_sayisi,
    MAX(t.created_at) AS son_tweet_tarihi
FROM users u
JOIN tweets t ON u.user_id = t.user_id
WHERE t.created_at >= CURRENT_TIMESTAMP - INTERVAL '7 days'
GROUP BY u.user_id, u.username, u.display_name
ORDER BY tweet_sayisi DESC
LIMIT 10;

-- ============================================
-- SORGU 7: En Çok Yorum Alan Tweetler
-- Açıklama: Etkileşim analizi için kullanılır.
-- Tartışma yaratan içerikleri bulmak için önemlidir.
-- ============================================
SELECT 
    t.tweet_id,
    u.username,
    t.content,
    COUNT(c.comment_id) AS yorum_sayisi,
    t.like_count,
    t.created_at
FROM tweets t
JOIN users u ON t.user_id = u.user_id
LEFT JOIN comments c ON t.tweet_id = c.tweet_id
GROUP BY t.tweet_id, u.username, t.content, t.like_count, t.created_at
ORDER BY yorum_sayisi DESC
LIMIT 10;

-- ============================================
-- SORGU 8: Kullanıcı İstatistikleri
-- Açıklama: Her kullanıcının tweet, takipçi ve takip sayılarını gösterir.
-- Profil sayfası için gerekli istatistikleri sağlar.
-- ============================================
SELECT 
    u.user_id,
    u.username,
    u.display_name,
    u.is_verified,
    (SELECT COUNT(*) FROM tweets t WHERE t.user_id = u.user_id) AS tweet_sayisi,
    (SELECT COUNT(*) FROM follows f WHERE f.following_id = u.user_id) AS takipci_sayisi,
    (SELECT COUNT(*) FROM follows f WHERE f.follower_id = u.user_id) AS takip_edilen_sayisi,
    (SELECT COUNT(*) FROM likes l WHERE l.user_id = u.user_id) AS begeni_sayisi
FROM users u
ORDER BY takipci_sayisi DESC;

-- ============================================
-- SORGU 9: Trending Hashtag'ler
-- Açıklama: En çok kullanılan etiketleri listeler.
-- Gündem takibi için kullanılır.
-- ============================================
SELECT 
    h.hashtag_id,
    h.tag_name,
    COUNT(th.tweet_id) AS kullanim_sayisi,
    MAX(t.created_at) AS son_kullanim_tarihi
FROM hashtags h
JOIN tweet_hashtags th ON h.hashtag_id = th.hashtag_id
JOIN tweets t ON th.tweet_id = t.tweet_id
GROUP BY h.hashtag_id, h.tag_name
ORDER BY kullanim_sayisi DESC
LIMIT 10;

-- ============================================
-- SORGU 10: Belirli Tarih Aralığındaki Tweetler
-- Açıklama: Zaman bazlı filtreleme yapar.
-- Örnek: Ocak 2024 içindeki tweetler
-- ============================================
SELECT 
    t.tweet_id,
    u.username,
    u.display_name,
    t.content,
    t.like_count,
    t.retweet_count,
    t.created_at
FROM tweets t
JOIN users u ON t.user_id = u.user_id
WHERE t.created_at BETWEEN '2024-01-01 00:00:00' AND '2024-01-31 23:59:59'
ORDER BY t.created_at DESC;

-- ============================================
-- BONUS SORGU: Kullanıcının Tüm Etkileşimleri
-- Açıklama: Bir kullanıcının aldığı tüm beğeni, 
-- retweet ve yorumları gösterir.
-- ============================================
SELECT 
    u.username,
    t.tweet_id,
    t.content,
    (SELECT COUNT(*) FROM likes l WHERE l.tweet_id = t.tweet_id) AS begeni_sayisi,
    (SELECT COUNT(*) FROM retweets r WHERE r.tweet_id = t.tweet_id) AS retweet_sayisi,
    (SELECT COUNT(*) FROM comments c WHERE c.tweet_id = t.tweet_id) AS yorum_sayisi
FROM tweets t
JOIN users u ON t.user_id = u.user_id
WHERE u.username = 'ahmetyilmaz'
ORDER BY t.created_at DESC;

