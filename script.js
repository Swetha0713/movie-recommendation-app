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
    const res = await fetch(`${API_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}`);
    const data = await res.json();

    if (data.Response === "False") {
      resultsDiv.textContent = data.Error || "No results.";
      return;
    }

    for (const item of data.Search) {
      // fetch full details for rating/genre
      const detailsRes = await fetch(`${API_URL}?apikey=${API_KEY}&i=${item.imdbID}`);
      const details = await detailsRes.json();

      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${details.Poster !== "N/A" ? details.Poster : "https://via.placeholder.com/200x300?text=No+Image"}">
        <h3>${details.Title}</h3>
        <div class="meta">
          <div>Year: ${details.Year}</div>
          <div>Genre: ${details.Genre}</div>
          <div>IMDB: ${details.imdbRating}</div>
        </div>
      `;
      resultsDiv.appendChild(card);
    }
  } catch (err) {
    console.error(err);
    resultsDiv.textContent = "Error fetching data.";
  }
}
