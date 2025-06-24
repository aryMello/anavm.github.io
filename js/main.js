async function loadProjects() {
  const pinnedRepos = [
    "IBM-Data-Engineer-Capstone-Project",
    "hands-on-ml",
    "hands-on-ai-cv",
    "HackerRank-Mastery-Challenges",
    "DataCampAssociateDE"
  ];

  const grid = document.getElementById('projects-grid');
  grid.innerHTML = ''; // clear before loading

  try {
    const { data } = await axios.get('https://api.github.com/users/aryMello/repos?per_page=100');
    console.log('All repos:', data.map(r => r.name));

    const repos = data.filter(r =>
      pinnedRepos.includes(r.name) && !r.fork && !r.private
    );
    console.log('Showing repos:', repos.map(r => r.name));

    if (repos.length === 0) {
      grid.innerHTML = `<p class="error-message">No featured projects—check names or visibility.</p>`;
      return;
    }

    repos.forEach(r => {
      let summary = '';
      // Fetch & format README
      const readmePromise = axios
        .get(`https://api.github.com/repos/aryMello/${r.name}/readme`)
        .then(res => atob(res.data.content))
        .then(text =>
          text
            .split('\n')
            .filter(line => line.trim() && !/^#+/.test(line))
            .slice(0, 3)
            .join(' ')
        )
        .catch(() => r.description || 'No description available.');

      readmePromise.then(read => {
        const card = document.createElement('div');
        card.className = 'project-card';
        const img = `assets/${r.name}.png`;

        card.innerHTML = `
          <img src="${img}" alt="${r.name}">
          <div class="project-content">
            <h3><a href="${r.html_url}" target="_blank">${r.name}</a></h3>
            <p class="project-summary">${read}</p>
            <a href="${r.html_url}" class="btn-outline" target="_blank">View on GitHub →</a>
          </div>
        `;
        grid.appendChild(card);
      });
    });

  } catch (err) {
    console.error(err);
    grid.innerHTML = `<p class="error-message">Failed to load projects.</p>`;
  }
}
