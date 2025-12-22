-- ============================================
-- QUERY 6: Most Active Users in the Last 7 Days
-- Description: Used for activity analysis.
-- Lists users who tweet the most.
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
