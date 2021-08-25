import axios from 'axios'

export const getGitHubStars = async (
  author: string,
  repo: string,
): Promise<string> => {
  try {
    const { data } = await axios.get(
      `https://api.github.com/repos/${author}/${repo}`,
    )
    return data.stargazers_count.toLocaleString()
  } catch (error) {
    return '0'
  }
}
