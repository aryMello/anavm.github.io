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
    const repos = res.data
      .filter(r => pinnedRepos.includes(r.name) && !r.fork && !r.private);

    for (const r of repos) {
      let readmeText = '';
      try {
        const readmeRes = await axios.get(`https://api.github.com/repos/aryMello/${r.name}/readme`);
        const decodedContent = atob(readmeRes.data.content);
        readmeText = decodedContent.split('\n').slice(0, 5).join('\n'); // Show first 5 lines
      } catch (err) {
        console.warn(`No README found for ${r.name}`, err);
        readmeText = r.description || 'No description provided.';
      }

      const card = document.createElement('div');
      card.className = 'project-card';
      const imageUrl = `assets/${r.name}.png`;
      card.innerHTML = `
        <img src="${imageUrl}" alt="${r.name}">
        <div class="project-content">
          <h3><a href="${r.html_url}" target="_blank">${r.name}</a></h3>
          <pre>${readmeText}</pre>
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
