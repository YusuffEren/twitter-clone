-- ============================================
-- QUERY 2: Most Liked Tweets
-- Description: Used for popular content analysis.
-- Important for finding viral tweets.
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
