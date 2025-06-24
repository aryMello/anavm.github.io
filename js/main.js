async function loadProjects() {
  try {
    const res = await axios.get('https://api.github.com/users/aryMello/repos?per_page=6&sort=pushed');
    const repos = res.data.filter(r => !r.fork && !r.private).sort((a,b)=>b.stargazers_count - a.stargazers_count);

    const grid = document.getElementById('projects-grid');
    repos.forEach(r => {
      const card = document.createElement('div');
      card.className = 'project-card';
      const imageUrl = `assets/${r.name}.png`;
      card.innerHTML = `
        <img src="${imageUrl}" alt="${r.name}">
        <div class="project-content">
          <h3><a href="${r.html_url}" target="_blank">${r.name}</a></h3>
          <p>${r.description || ''}</p>
          <a href="${r.html_url}" target="_blank">View on GitHub →</a>
        </div>`;
      grid.append(card);
    });
  } catch(e) {
    console.error('Failed to fetch repos', e);
    document.getElementById('projects-grid').innerHTML = '<p>Unable to load projects.</p>';
  }
}

document.addEventListener('DOMContentLoaded', loadProjects);
