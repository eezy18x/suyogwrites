fetch("data/writeups.json")
  .then(res => res.json())
  .then(writeups => {
    const container = document.getElementById("writeup-list");
    const tagCounts = {};

    writeups.forEach(w => {
      // Entry
      const entry = document.createElement("div");
      entry.className = "entry";

      const link = document.createElement("a");
      link.href = "writeups/" + w.file;
      link.textContent = w.title;

      const meta = document.createElement("div");
      meta.className = "meta";

      meta.innerHTML = `
        <span class="tag">${w.os}</span>
        <span class="tag">${w.difficulty}</span>
        ${w.tags.map(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          return `<span class="tag filter-tag" data-tag="${tag}">${tag}</span>`;
        }).join("")}
      `;

      entry.appendChild(link);
      entry.appendChild(meta);
      container.appendChild(entry);
    });

    // Sort tags by count
    const trending = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5); // top 5

    const sidebar = document.getElementById("sidebar-tags");
    trending.forEach(([tag]) => {
      const el = document.createElement("span");
      el.className = "tag clickable";
      el.textContent = tag;
      el.dataset.tag = tag;
      el.onclick = () => {
        document.querySelectorAll(".entry").forEach(entry => {
          const tags = entry.querySelectorAll(".filter-tag");
          let match = false;
          tags.forEach(t => {
            if (t.dataset.tag === tag) match = true;
          });
          entry.style.display = match ? "block" : "none";
        });
      };
      sidebar.appendChild(el);
    });

    // Search feature
    const searchBox = document.getElementById("searchInput");
    searchBox.addEventListener("input", function () {
      const query = this.value.toLowerCase();
      document.querySelectorAll(".entry").forEach(entry => {
        const text = entry.textContent.toLowerCase();
        entry.style.display = text.includes(query) ? "block" : "none";
      });
    });
  });
