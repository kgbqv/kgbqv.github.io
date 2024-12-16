const postsPerPage = 10;
let currentPage = 1;
let allPosts = [];
function parseMarkdown(md) {
    const [_, meta, content] = md.match(/---\n([\s\S]+?)\n---\n([\s\S]*)/);
    const metadata = Object.fromEntries(
        meta.split("\n").map(line => line.split(": ").map(s => s.trim()))
    );
    return { ...metadata, content };
}
async function fetchPostList() {
    try {
        allPosts = ["first_post.md"];
        console.log("All posts:", allPosts);
        renderPosts(currentPage);
    } catch (error) {
        console.error("Error fetching post list:", error);
    }
}
async function renderPosts(page) {
    const container = document.getElementById("blog-container");
    container.innerHTML = "";

    const start = (page - 1) * postsPerPage;
    const end = start + postsPerPage;
    const pagePosts = allPosts.slice(start, end);

    if (pagePosts.length === 0) {
        container.innerHTML = "<p>No posts found.</p>";
        return;
    }

    for (const post of pagePosts) {
        const response = await fetch(`/blog/${post}`);
        const mdText = await response.text();
        const { title, date, tags, content } = parseMarkdown(mdText);

        const postElement = document.createElement("div");
        postElement.classList.add("content");
        postElement.innerHTML = `
            <h2><a href="post.html?post=${post.substring(0, post.length - 3)}">${title}</a></h2>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Tags:</strong> ${tags.substring(1, tags.length - 1)}</p>
            <p>${content.slice(0, 100)}${(content.length > 100)?"...":""}</p>
        `;
        container.appendChild(postElement);
    }

    updatePagination(page);
}
function updatePagination(page) {
    const totalPages = Math.ceil(allPosts.length / postsPerPage);
    document.getElementById("prev-btn").disabled = page === 1;
    document.getElementById("next-btn").disabled = page === totalPages;
    document.getElementById("page-info").textContent = `page ${page} of ${totalPages}`;
}
document.getElementById("prev-btn").addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        renderPosts(currentPage);
    }
});

document.getElementById("next-btn").addEventListener("click", () => {
    if (currentPage < Math.ceil(allPosts.length / postsPerPage)) {
        currentPage++;
        renderPosts(currentPage);
    }
});

fetchPostList();
