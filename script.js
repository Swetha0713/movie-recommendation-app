const API_KEY = "202d6312";
 // TODO: replace
const API_URL = "https://www.omdbapi.com/";

async function searchMovies() {
  const query = document.getElementById("searchInput").value.trim();
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  if (!query) {
    resultsDiv.textContent = "Please enter a movie title.";
    return;
  }

  try {
    // base search
    const res = await fetch(`${API_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}`);
    const data = await res.json();
    if (data.Response === "False") {
      resultsDiv.textContent = data.Error || "No results.";
      return;
    }

    // take first as reference
    const firstId = data.Search[0].imdbID;
    const refDetails = await fetch(`${API_URL}?apikey=${API_KEY}&i=${firstId}`).then(r => r.json());
    const primaryGenre = refDetails.Genre.split(",")[0].trim();

    const header = document.createElement("h2");
    header.textContent = `Results for "${query}" + recommendations for genre ${primaryGenre}`;
    resultsDiv.appendChild(header);

    // fetch details for each & collect
    const movies = [];
    for (const item of data.Search) {
      const d = await fetch(`${API_URL}?apikey=${API_KEY}&i=${item.imdbID}`).then(r => r.json());
      movies.push(d);
    }

    // recommendation: same primary genre & imdbRating >= 7
    const recs = movies
      .filter(m => m.Genre && m.Genre.includes(primaryGenre))
      .sort((a, b) => parseFloat(b.imdbRating) - parseFloat(a.imdbRating || 0));

    for (const m of recs) {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${m.Poster !== "N/A" ? m.Poster : "https://via.placeholder.com/200x300?text=No+Image"}">
        <h3>${m.Title}</h3>
        <div class="meta">
          <div>Genre: ${m.Genre}</div>
          <div>IMDB: ${m.imdbRating}</div>
        </div>
      `;
      resultsDiv.appendChild(card);
    }
  } catch (err) {
    console.error(err);
    resultsDiv.textContent = "Error fetching data.";
  }
}
