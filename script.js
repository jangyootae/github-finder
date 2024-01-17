// script.js
class GitHubFinder {
    constructor() {
        this.usernameInput = document.getElementById('username');
        this.profileDiv = document.getElementById('profile');
        this.viewProfileButton = document.getElementById('View_Profile');
        this.latestReposContainer = document.getElementById('latest_repos');
        this.jandiDiv = document.getElementById('jandi');
        this.profileinfo = document.getElementById('profile-right');

        this.viewProfileButton.style.display = 'none';
        this.profileinfo.style.display = 'none';
        this.usernameInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                this.searchProfile();
            }
        });
    }

    // displayProfile 메서드에 다음 코드를 추가합니다.
    displayProfile(user) {
        document.getElementById('profileImage').innerHTML = `<img src="${user.avatar_url}" alt="${user.login}" width="250px ">`;

        const profileGitDiv = document.getElementById('profile_git');
        profileGitDiv.innerHTML = `
            <div id="publicRepos" class="profile-box"><p>Public Repos: ${user.public_repos}</p></div>
            <div id="publicGists" class="profile-box"><p>Public Gists: ${user.public_gists}</p></div>
            <div id="followers" class="profile-box"><p>Followers: ${user.followers}</p></div>
            <div id="following" class="profile-box"><p>Following: ${user.following}</p></div>
        `;

        const profileInfoDiv = document.getElementById('profile_info');
        profileInfoDiv.innerHTML = `
            <div id="company" class="profile-line"><p>Company: ${user.company || 'undefined'}</p></div>
            <div id="website" class="profile-line"><p">Website/Blog: <a href="${user.blog}" target="_blank" >${user.blog || 'undefined'}</a></p></div>
            <div id="location" class="profile-line"><p>Location: ${user.location || 'undefined'}</p></div>
            <div id="memberSince" class="profile-line"><p>Member Since: ${new Date(user.created_at).toLocaleDateString()}</p></div>
        `;
        this.viewProfileButton.style.display = 'block';
        this.profileinfo.style.display='block';
        this.viewProfileButton.setAttribute('onclick', `window.open('${user.html_url}', '_blank')`);

        this.displayLatestRepos(user.login);
    }

    // 새로운 메서드를 추가합니다.
    async displayLatestRepos(username) {
        // 먼저 이전의 Latest Repos를 지웁니다.
        this.latestReposContainer.innerHTML = '';

        try {
            const repos = await this.fetchLatestRepos(username);
            // 새로운 Latest Repos를 표시합니다.
            repos.slice(0, 5).forEach(repo => {
                const repoDiv = document.createElement('div');
                repoDiv.className = 'repo-item';
                repoDiv.innerHTML = `
                    <p><strong>${repo.name}</strong></p>
                    <div class="repos_right">
                    <p id="Stars">Stars: ${repo.stargazers_count}</p>
                    <p id="Watchers">Watchers: ${repo.watchers_count}</p>
                    <p id="Forks">Forks: ${repo.forks_count}</p>
                    </div>
                `;
                this.latestReposContainer.appendChild(repoDiv);
            });
        } catch (error) {
            console.error('에러 발생:', error);
        }
    }

    async fetchLatestRepos(username) {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated`);
        const data = await response.json();
        return data;
    }

    async searchProfile() {
        const username = this.usernameInput.value;

        if (username === '') {
            alert('GitHub 사용자명을 입력하세요.');
            return;
        }

        try {
            const userData = await this.fetchGitHubProfile(username);

            if (userData.message === 'Not Found') {
                alert('사용자를 찾을 수 없습니다.');
            } else {
                this.displayProfile(userData);
            }
        } catch (error) {
            console.error('에러 발생:', error);
        }
    }
    // async jandiDiv() {
    //     try {
    //         // 이미지를 표시할 컨테이너
    //         const jandiContainer = document.getElementById('jandi_img');
    
    //         // 이미지 엘리먼트 생성
    //         const jandiImage = document.createElement('img');
    //         jandiImage.src = `https://ghchart.rshah.org/${username}`;
    //         jandiImage.alt = 'GitHub Contribution Chart';
    
    //         // 이미지를 컨테이너에 추가
    //         jandiContainer.innerHTML = '';
    //         jandiContainer.appendChild(jandiImage);
    //     } catch (error) {
    //         console.error('잔디 이미지를 처리하는 중 에러가 발생했습니다:', error);
    //     }
    // }
    
    async fetchGitHubProfile(username) {
        const response = await fetch(`https://api.github.com/users/${username}`);
        const data = await response.json();
        return data;
    }
}

const githubFinder = new GitHubFinder();
