function getYear(date) {
  return new Date(date).getFullYear();
}

function computePopularity(repo) {
  return repo.stargazers_count * parseInt(repo.forks_count);
} 

module.exports = {
  getYear: getYear,
  computePopularity: computePopularity
}