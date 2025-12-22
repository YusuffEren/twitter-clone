// ============================================
// GLOBAL VARIABLES
// ============================================
const API_URL = '/api';
let currentUser = null;
let currentSection = 'home';
let currentTweetId = null; // For modal

// DOM Elements
const currentUserSelect = document.getElementById('currentUser');
const pageTitle = document.getElementById('pageTitle');
const tweetContent = document.getElementById('tweetContent');
const tweetBtn = document.getElementById('tweetBtn');
const charCount = document.getElementById('charCount');
const contentArea = document.getElementById('contentArea');
const trendingList = document.getElementById('trendingList');
const dbStats = document.getElementById('dbStats');
const commentModal = document.getElementById('commentModal');
const commentsList = document.getElementById('commentsList');
const commentContent = document.getElementById('commentContent');
const addCommentBtn = document.getElementById('addCommentBtn');

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    await loadUsers();
    await loadTweets(); // Default to home feed
    await loadTrending();
    await loadStats();

    // Event Listeners
    if (tweetBtn) tweetBtn.addEventListener('click', postTweet);
    if (tweetContent) tweetContent.addEventListener('input', updateCharCount);
    if (addCommentBtn) addCommentBtn.addEventListener('click', postComment);

    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (item.dataset.section) {
                e.preventDefault();
                document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');

                // Update page title
                const title = item.querySelector('span').textContent;
                pageTitle.textContent = title;

                loadContent(item.dataset.section);
            }
        });
    });

    // User Selection Change
    currentUserSelect.addEventListener('change', (e) => {
        currentUser = e.target.value;
        if (currentUser) {
            // Update mini profile (optional: fetch user details)
            // document.getElementById('miniProfileAvatar').textContent = ...
        }
    });
});

async function fetchAPI(endpoint, options = {}) {
    try {
        const response = await fetch(API_URL + endpoint, {
            headers: { 'Content-Type': 'application/json' },
            ...options
        });
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return { error: 'Bağlantı hatası' };
    }
}

// ============================================
// LOAD CONTENT
// ============================================

async function loadUsers() {
    const users = await fetchAPI('/users');
    if (users && !users.error) {
        // Populate User Select
        currentUserSelect.innerHTML = '<option value="">Select User...</option>' +
            users.map(u => `<option value="${u.user_id}">@${u.username}</option>`).join('');

        // Auto-select first user for demo
        if (users.length > 0) {
            currentUser = users[0].user_id;
            currentUserSelect.value = currentUser;
        }
    }
}

async function loadContent(section) {
    currentSection = section;
    showLoading();

    switch (section) {
        case 'home':
            loadTweets();
            break;
        case 'users':
            const users = await fetchAPI('/users');
            renderUsers(users);
            break;
        case 'trending':
            loadHashtagTweets('teknoloji'); // Demo
            break;
        case 'popular':
            const popular = await fetchAPI('/tweets/popular');
            renderTweets(popular);
            break;
        default:
            loadTweets();
    }
}

async function loadTweets() {
    const tweets = await fetchAPI('/tweets');
    renderTweets(tweets);
}

async function loadHashtagTweets(tag) {
    const tweets = await fetchAPI(`/hashtags/${tag}/tweets`);
    renderTweets(tweets);
}

async function loadTrending() {
    const trends = await fetchAPI('/hashtags');
    if (trends && !trends.error) {
        trendingList.innerHTML = trends.map(t => `
            <div class="trend-item" onclick="loadHashtagTweets('${t.tag_name}')">
                <div class="trend-meta">
                    <span>Trending in Turkey</span>
                    <i class="fas fa-ellipsis"></i>
                </div>
                <span class="trend-tag">#${t.tag_name}</span>
                <span class="trend-count">${t.usage_count} Tweets</span>
            </div>
        `).join('') + '<div class="show-more">Show more</div>';
    }
}

async function loadStats() {
    if (dbStats) {
        dbStats.innerHTML = `
            <div class="trend-item">
                <div class="trend-tag">GitHub Repository</div>
                <div class="trend-count">@MCBU-PROJE</div>
            </div>
            <div class="trend-item">
                <div class="trend-tag">Project Team</div>
                <div class="trend-count">Yusuf & Friends</div>
            </div>
        `;
    }
}

async function loadUserStats(userId) {
    showLoading();
    const stats = await fetchAPI(`/users/${userId}/stats`);
    if (stats && !stats.error) {
        // Render detailed user profile view (Simple version)
        contentArea.innerHTML = `
            <div style="padding: 16px;">
                <div style="background: #333; height: 150px; margin: -16px -16px 0 -16px;"></div>
                <div style="margin-top: -50px; display: flex; justify-content: space-between; align-items: flex-end;">
                    <div style="width: 100px; height: 100px; border-radius: 50%; background: #000; border: 4px solid black; display: flex; align-items: center; justify-content: center; font-size: 40px; font-weight: bold;">
                        ${stats.display_name.charAt(0)}
                    </div>
                    <button class="btn-sidebar-tweet" style="width: auto; padding: 0 20px; height: 36px; margin: 0;">Follow</button>
                </div>
                <div style="margin-top: 12px;">
                    <h2 style="font-weight: 800; font-size: 20px;">${stats.display_name}</h2>
                    <div style="color: #71767b;">@${stats.username}</div>
                </div>
                <div style="margin-top: 12px;">${stats.bio || ''}</div>
                <div style="display: flex; gap: 20px; margin-top: 12px; color: #71767b; font-size: 14px;">
                    <span><strong style="color: #e7e9ea;">${stats.following_count}</strong> Following</span>
                    <span><strong style="color: #e7e9ea;">${stats.followers_count}</strong> Followers</span>
                </div>
            </div>
            <div style="border-bottom: 1px solid #2f3336;"></div>
        `;
        // Load user's tweets (Not implemented in API demo, but could be added)
    }
}

// ============================================
// RENDER FUNCTIONS
// ============================================

function renderTweets(tweets) {
    if (!tweets || tweets.length === 0) {
        showEmpty('No tweets found');
        return;
    }

    contentArea.innerHTML = tweets.map(tweet => `
        <div class="tweet-card">
            <div class="tweet-avatar">${tweet.display_name.charAt(0)}</div>
            <div class="tweet-content">
                <div class="tweet-header">
                    <span class="tweet-name">${tweet.display_name}</span>
                    ${tweet.is_verified ? '<span class="verified-badge"><i class="fas fa-circle-check"></i></span>' : ''}
                    <span class="tweet-username">@${tweet.username}</span>
                    <span class="tweet-time">${formatTime(tweet.created_at)}</span>
                </div>
                <div class="tweet-text">${highlightHashtags(tweet.content)}</div>
                <div class="tweet-actions">
                    <button class="action-btn comment" onclick="openComments(${tweet.tweet_id})">
                        <i class="far fa-comment"></i>
                        <span>${tweet.comments_count || 0}</span>
                    </button>
                    <button class="action-btn retweet ${tweet.retweeted ? 'retweeted' : ''}" onclick="retweetTweet(${tweet.tweet_id}, this)">
                        <i class="fas fa-retweet"></i>
                        <span>${tweet.retweet_count}</span>
                    </button>
                    <button class="action-btn like ${tweet.liked ? 'liked' : ''}" onclick="likeTweet(${tweet.tweet_id}, this)">
                        <i class="${tweet.liked ? 'fas' : 'far'} fa-heart"></i>
                        <span>${tweet.like_count}</span>
                    </button>
                    <button class="action-btn">
                         <i class="far fa-share-square"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function renderUsers(users) {
    if (users.length === 0) {
        showEmpty('No users found');
        return;
    }

    contentArea.innerHTML = users.map(user => `
        <div class="user-card" style="padding: 12px 16px; border-bottom: 1px solid #e6ecf0; display: flex; cursor: pointer;">
            <div style="width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #1DA1F2, #71c9f8); margin-right: 12px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 20px; color: white;" onclick="loadUserStats(${user.user_id})">${user.display_name.charAt(0)}</div>
            <div class="user-info" style="flex: 1;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div onclick="loadUserStats(${user.user_id})" style="cursor: pointer;">
                        <div class="user-displayname" style="font-weight: 700; color: #14171a;">
                            ${user.display_name}
                            ${user.is_verified ? '<span class="verified-badge"><i class="fas fa-circle-check"></i></span>' : ''}
                        </div>
                        <div class="user-username" style="color: #657786;">@${user.username}</div>
                    </div>
                    <button class="follow-btn" onclick="event.stopPropagation(); followUser(${user.user_id}, this)" style="padding: 8px 16px; border-radius: 9999px; font-weight: 700; font-size: 14px; cursor: pointer; border: 1px solid #1DA1F2; background: #1DA1F2; color: white; transition: all 0.2s;">Follow</button>
                </div>
                <div class="user-bio" style="margin-top: 4px; color: #14171a;">${user.bio || ''}</div>
            </div>
        </div>
    `).join('');
}

// ============================================
// TWEET ACTIONS
// ============================================

function updateCharCount() {
    const count = tweetContent.value.length;
    if (charCount) charCount.textContent = count;
    tweetBtn.disabled = count === 0 || count > 280;
}

async function postTweet() {
    if (!currentUser) {
        alert('Please select a user first');
        return;
    }

    const content = tweetContent.value.trim();
    if (!content) return;

    const result = await fetchAPI('/tweets', {
        method: 'POST',
        body: JSON.stringify({
            user_id: currentUser,
            content: content
        })
    });

    if (result && !result.error) {
        tweetContent.value = '';
        updateCharCount();
        loadTweets();
        loadTrending();
    } else {
        alert(result?.error || 'Failed to post tweet');
    }
}

async function likeTweet(tweetId, button) {
    if (!currentUser) {
        alert('Please select a user first');
        return;
    }

    const result = await fetchAPI(`/tweets/${tweetId}/like`, {
        method: 'POST',
        body: JSON.stringify({ user_id: currentUser })
    });

    if (result && !result.error) {
        button.classList.toggle('liked', result.liked);

        // Toggle Heart Icon and Animate
        const icon = button.querySelector('i');
        icon.style.transform = 'scale(1.3)';
        setTimeout(() => icon.style.transform = 'scale(1)', 200);

        if (result.liked) {
            icon.classList.remove('far');
            icon.classList.add('fas');
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
        }

        const countSpan = button.querySelector('span:last-child');
        const currentCount = parseInt(countSpan.textContent);
        countSpan.textContent = result.liked ? currentCount + 1 : currentCount - 1;
    }
}

// ============================================
// COMMENTS
// ============================================

async function openComments(tweetId) {
    currentTweetId = tweetId;
    commentModal.style.display = 'flex';
    commentsList.innerHTML = '<div class="loading">Loading...</div>';

    const comments = await fetchAPI(`/tweets/${tweetId}/comments`);
    if (comments && comments.length > 0) {
        commentsList.innerHTML = comments.map(comment => `
            <div class="tweet-card" style="border: none;">
                <div class="tweet-avatar" style="width: 30px; height: 30px; font-size: 14px;">${comment.display_name.charAt(0)}</div>
                <div class="tweet-content">
                    <div class="tweet-header">
                        <span class="tweet-name">${comment.display_name}</span>
                        <span class="tweet-username">@${comment.username}</span>
                    </div>
                    <div class="tweet-text">${comment.content}</div>
                </div>
            </div>
        `).join('');
    } else {
        commentsList.innerHTML = '<div style="padding: 20px; text-align: center; color: #71767b;">No replies yet.</div>';
    }
}

function closeCommentModal() {
    commentModal.style.display = 'none';
    commentContent.value = '';
    currentTweetId = null;
}

async function postComment() {
    if (!currentUser || !currentTweetId) {
        alert('Please select a user');
        return;
    }

    const content = commentContent.value.trim();
    if (!content) return;

    const result = await fetchAPI(`/tweets/${currentTweetId}/comments`, {
        method: 'POST',
        body: JSON.stringify({
            user_id: currentUser,
            content: content
        })
    });

    if (result && !result.error) {
        commentContent.value = '';
        openComments(currentTweetId);
        loadTweets(); // Refresh feed to show comment count update if beneficial
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function showLoading() {
    contentArea.innerHTML = '<div class="loading"><i class="fas fa-circle-notch fa-spin fa-2x"></i></div>';
}

function showEmpty(message) {
    contentArea.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #657786;">
            <p>${message}</p>
        </div>
    `;
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    // Simple formatting
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function highlightHashtags(text) {
    return text.replace(/#([\wüğıiöşçÇÖŞİĞÜ]+)/g, '<span class="hashtag" onclick="event.stopPropagation(); loadHashtagTweets(\'$1\')">$1</span>');
}

// ============================================
// RETWEET FUNCTION
// ============================================

async function retweetTweet(tweetId, button) {
    if (!currentUser) {
        alert('Please select a user first');
        return;
    }

    const result = await fetchAPI(`/tweets/${tweetId}/retweet`, {
        method: 'POST',
        body: JSON.stringify({ user_id: currentUser })
    });

    if (result && !result.error) {
        button.classList.toggle('retweeted', result.retweeted);

        // Toggle Retweet Icon and Animate
        const icon = button.querySelector('i');
        icon.style.transform = 'scale(1.3)';
        setTimeout(() => icon.style.transform = 'scale(1)', 200);

        if (result.retweeted) {
            button.style.color = '#17bf63';
        } else {
            button.style.color = '';
        }

        const countSpan = button.querySelector('span');
        const currentCount = parseInt(countSpan.textContent);
        countSpan.textContent = result.retweeted ? currentCount + 1 : currentCount - 1;
    }
}

// ============================================
// FOLLOW FUNCTION
// ============================================

async function followUser(userId, button) {
    if (!currentUser) {
        alert('Please select a user first');
        return;
    }

    if (currentUser == userId) {
        alert('You cannot follow yourself');
        return;
    }

    const result = await fetchAPI(`/users/${userId}/follow`, {
        method: 'POST',
        body: JSON.stringify({ user_id: currentUser })
    });

    if (result && !result.error) {
        // Toggle button style
        if (result.following) {
            button.textContent = 'Following';
            button.style.background = 'white';
            button.style.color = '#1DA1F2';
            button.style.border = '1px solid #1DA1F2';
        } else {
            button.textContent = 'Follow';
            button.style.background = '#1DA1F2';
            button.style.color = 'white';
            button.style.border = '1px solid #1DA1F2';
        }

        // Animate
        button.style.transform = 'scale(1.05)';
        setTimeout(() => button.style.transform = 'scale(1)', 200);
    }
}
