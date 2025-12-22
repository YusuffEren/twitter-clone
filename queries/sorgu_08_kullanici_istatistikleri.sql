-- ============================================
-- QUERY 8: User Statistics
-- Description: Shows each user's tweet, follower, and following counts.
-- Provides necessary statistics for the profile page.
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
