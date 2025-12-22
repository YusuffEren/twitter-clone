-- ============================================
-- QUERY 1: Users with Most Followers
-- Description: Used for influencer analysis.
-- Lists the most popular users on the platform.
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
