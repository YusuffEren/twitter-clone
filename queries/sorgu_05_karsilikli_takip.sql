-- ============================================
-- QUERY 5: Mutual Follows
-- Description: Finds users who follow each other.
-- Used for analyzing friendship relationships.
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
