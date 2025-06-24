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

    for (const repo of repos) {
      let summary = '';

      try {
        const readmeRes = await axios.get(`https://api.github.com/repos/aryMello/${repo.name}/readme`);
        const decoded = atob(readmeRes.data.content || '');
        summary = decoded
          .split('\n')
          .filter(line => line.trim() && !line.startsWith('#'))
          .slice(0, 3)
          .join(' ')
          .replace(/\[(.*?)\]\(.*?\)/g, '$1'); // remove markdown links
      } catch {
        summary = repo.description || 'A code project without a detailed description.';
      }

      const card = document.createElement('div');
      card.className = 'project-card';

      const imageUrl = `assets/${repo.name}.png`;

      card.innerHTML = `
        <img src="${imageUrl}" alt="${repo.name}">
        <div class="project-content">
          <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
          <p class="project-summary">${summary}</p>
          <a href="${repo.html_url}" target="_blank">View on GitHub →</a>
        </div>
      `;

      grid.appendChild(card);
    }
  } catch (err) {
    console.error('Error loading repositories:', err);
    grid.innerHTML = `<p class="error-message">⚠️ Sorry, unable to load projects at this time.</p>`;
  }
}
