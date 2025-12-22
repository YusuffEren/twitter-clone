-- ============================================
-- QUERY 7: Most Commented Tweets
-- Description: Used for engagement analysis.
-- Important for finding content that sparks discussions.
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
