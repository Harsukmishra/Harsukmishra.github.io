const videoIds = [
    'fKjQNDrv1L8', 'eC9hfZrH8zk', 'zIseTfXrcyM',
    '5weqh6hGqLA', 'oevmZROkNe4', 'XUbtTj9Hfug',
    'fpKMRvlp1rU', 'Hq9NMCN1q4c', 'O6JVKFPerGs'
];

// 🟢 Load Liked Videos from Local Storage
let likedVideos = JSON.parse(localStorage.getItem("likedVideos")) || [];

// 🟢 Page Load: Initialize Everything
window.onload = function() {
    updateVideoList();
    updateLikedVideos();
    loadDarkMode();

    // 🟢 Attach Dark Mode Toggle Event
    document.getElementById("darkModeToggle").addEventListener("change", toggleDarkMode);
};

// 🟢 Update Video List
function updateVideoList() {
    const list = document.getElementById("videoList");
    list.innerHTML = '';

    videoIds.forEach(videoId => {
        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        const channelUrl = `https://youtube.com/@harsukmisra`;

        const listItem = document.createElement("li");

        const videoLink = document.createElement("a");
        videoLink.href = "#";
        videoLink.innerHTML = `<img src="${thumbnailUrl}" class="thumbnail">`;
        videoLink.onclick = function() {
            openPlayer(videoId);
        };

        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("buttonContainer");

        const subscribeButton = document.createElement("button");
        subscribeButton.classList.add("subscribeBtn");
        subscribeButton.innerHTML = '<i class="fas fa-bell"></i> Subscribe';
        subscribeButton.onclick = function() {
            window.open(channelUrl, '_blank');
        };

        const shareButton = document.createElement("button");
        shareButton.classList.add("shareBtn");
        shareButton.innerHTML = '<i class="fas fa-share-alt"></i> Share';
        shareButton.onclick = function() {
            shareVideo(videoId);
        };

        const likeButton = document.createElement("button");
        likeButton.classList.add("likeBtn");
        likeButton.onclick = function() {
            toggleLikeVideo(videoId, thumbnailUrl, likeButton);
        };

        updateLikeButton(videoId, likeButton);

        buttonContainer.appendChild(subscribeButton);
        buttonContainer.appendChild(shareButton);
        buttonContainer.appendChild(likeButton);

        listItem.appendChild(videoLink);
        listItem.appendChild(buttonContainer);
        list.appendChild(listItem);
    });
}

// 🟢 Toggle Like/Unlike Video
function toggleLikeVideo(videoId, thumbnailUrl, button) {
    const index = likedVideos.findIndex(video => video.id === videoId);

    if (index === -1) {
        likedVideos.push({ id: videoId, thumbnail: thumbnailUrl });
    } else {
        likedVideos.splice(index, 1);
    }

    updateLikeButton(videoId, button);
    saveLikedVideos();
    updateLikedVideos();
}

// 🟢 Update Like Button Style
function updateLikeButton(videoId, likeBtn) {
    if (likedVideos.some(video => video.id === videoId)) {
        likeBtn.classList.add("liked");
        likeBtn.innerHTML = '<i class="fas fa-thumbs-up"></i> Liked';
    } else {
        likeBtn.classList.remove("liked");
        likeBtn.innerHTML = '<i class="fas fa-thumbs-up"></i> Like';
    }
}

// 🟢 Save Liked Videos to Local Storage
function saveLikedVideos() {
    localStorage.setItem("likedVideos", JSON.stringify(likedVideos));
}

// 🟢 Update Liked Videos Section
function updateLikedVideos() {
    const likedList = document.getElementById("likedVideosList");
    likedList.innerHTML = '';

    likedVideos.forEach(video => {
        const listItem = document.createElement("li");

        const videoLink = document.createElement("a");
        videoLink.href = `https://youtube.com/shorts/${video.id}`;
        videoLink.target = "_blank";
        videoLink.innerHTML = `<img src="${video.thumbnail}" class="thumbnail">`;

        listItem.appendChild(videoLink);
        likedList.appendChild(listItem);
    });
}

// 🟢 Open Video Player
function openPlayer(videoId) {
    let player = document.getElementById("videoPlayer");
    let iframe = document.getElementById("videoIframe");

    iframe.src = "";
    setTimeout(() => {
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }, 100);

    player.style.display = "flex";
}

// 🟢 Close Video Player
function closePlayer() {
    let player = document.getElementById("videoPlayer");
    let iframe = document.getElementById("videoIframe");

    player.style.display = "none";
    iframe.src = "";
}

// 🟢 Share Video Function
function shareVideo(videoId) {
    const videoUrl = `https://youtube.com/shorts/${videoId}`;
    const shareText = `Check out this amazing YouTube Short!\n${videoUrl}`;

    const shareLinks = {
        WhatsApp: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`,
        Telegram: `https://t.me/share/url?url=${encodeURIComponent(videoUrl)}&text=${encodeURIComponent(shareText)}`,
        Facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(videoUrl)}`,
        Twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(videoUrl)}&text=${encodeURIComponent(shareText)}`,
        LinkedIn: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(videoUrl)}`,
        Email: `mailto:?subject=Check this out&body=${encodeURIComponent(shareText)}`
    };

    const existingModal = document.querySelector(".shareModal");
    if (existingModal) existingModal.remove();

    const shareModal = document.createElement("div");
    shareModal.classList.add("shareModal");

    let modalContent = `<div class="shareContent">
        <h3>Share This Video</h3>`;

    for (const [platform, url] of Object.entries(shareLinks)) {
        modalContent += `<a href="${url}" target="_blank" class="shareBtn">${platform}</a>`;
    }

    modalContent += `<button class="closeBtn">Close</button></div>`;
    shareModal.innerHTML = modalContent;

    document.body.appendChild(shareModal);

    shareModal.querySelector(".closeBtn").addEventListener("click", () => {
        shareModal.remove();
    });

    shareModal.addEventListener("click", (event) => {
        if (event.target === shareModal) {
            shareModal.remove();
        }
    });
}

// 🟢 Dark Mode Toggle (Fixed)
function toggleDarkMode() {
    const isDarkMode = document.body.classList.toggle("dark-mode");
    
    // 🟢 Save Dark Mode State in Local Storage
    localStorage.setItem("darkMode", isDarkMode ? "enabled" : "disabled");
}

// 🟢 Load Dark Mode from Local Storage
function loadDarkMode() {
    const isDarkMode = localStorage.getItem("darkMode") === "enabled";
    document.body.classList.toggle("dark-mode", isDarkMode);
    document.getElementById("darkModeToggle").checked = isDarkMode;
}

// 🟢 Show Home Section
function showHome() {
    document.getElementById("homeSection").style.display = "block";
    document.getElementById("likedVideosSection").style.display = "none";
}

// 🟢 Show Liked Videos Section
function showLikedVideos() {
    document.getElementById("homeSection").style.display = "none";
    document.getElementById("likedVideosSection").style.display = "block";
}
