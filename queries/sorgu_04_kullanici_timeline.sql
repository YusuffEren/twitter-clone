-- ============================================
-- QUERY 4: User's Timeline
-- Description: Shows tweets from people the user follows.
-- Example: Timeline for user with user_id = 1
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
