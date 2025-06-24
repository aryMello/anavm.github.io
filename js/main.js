async function loadProjects() {
  const pinnedRepos = [
    "IBM-Data-Engineer-Capstone-Project",
    "hands-on-ml",
    "hands-on-ai-cv",
    "HackerRank-Mastery-Challenges",
    "DataCampAssociateDE"
  ];

  const grid = document.getElementById('projects-grid');

  try {
    const res = await axios.get('https://api.github.com/users/aryMello/repos?per_page=100');
    const repos = res.data.filter(r =>
      pinnedRepos.includes(r.name) && !r.fork && !r.private
    );

    for (const r of repos) {
      let readmeHTML = '';
      try {
        const readmeRes = await axios.get(`https://api.github.com/repos/aryMello/${r.name}/readme`);
        const decodedContent = atob(readmeRes.data.content || '');
        readmeHTML = marked.parse(decodedContent); // Convert Markdown to HTML
      } catch (err) {
        console.warn(`No README found for ${r.name}`, err);
        readmeHTML = '<p><em>README not available.</em></p>';
      }

      const card = document.createElement('div');
      card.className = 'project-card';
      const imageUrl = `assets/${r.name}.png`;
      card.innerHTML = `
        <img src="${imageUrl}" alt="${r.name}">
        <div class="project-content">
          <h3><a href="${r.html_url}" target="_blank">${r.name}</a></h3>
          <div class="readme">${readmeHTML}</div>
          <a href="${r.html_url}" target="_blank">View on GitHub →</a>
        </div>`;
      grid.append(card);
    }
  } catch (e) {
    console.error('Failed to fetch repos', e);
    grid.innerHTML = '<p>Unable to load projects.</p>';
  }
}

document.addEventListener('DOMContentLoaded', loadProjects);
