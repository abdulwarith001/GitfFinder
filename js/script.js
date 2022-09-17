const input = document.getElementById('input')
const container = document.getElementById('container')
const url = "https://api.github.com/users/";
const pageLimit = 3;
let currentPage = 0;
let followingPage = 1;

const getUserDetails = async() => {
  try {
    const followerURL = `${url}${input.value.toLowerCase()}/followers`;
    const followingRL = `${url}${input.value.toLowerCase()}/following`;
    followingPage = 1
     const { data } = await axios.get(`${url}${input.value.toLowerCase()}`);
     const allFollowers = await getFollows(followerURL)
     const allFollowing = await getFollows(followingRL);
    const { avatar_url, name, login, bio, email, location, company, twitter_username, followers, following, public_repos } = data;
    
       const txt = `<div class="flex flex-col items-center w-full gap-2">
                <img src="${avatar_url}" class="w-28 h-28 rounded-md border-2 border-slate-100" alt="Github avatar">
                <p class="text-md text-zinc-300 font-bold font-poppins">${
                  name || login
                }</p>
            </div>
            <div class="flex flex-col font-poppins mt-4 gap-2 bg-lightBlack p-4 rounded-xl md:w-full">
                <h3 class="text-sky-500 text-lg text-center font-bold font-poppins">Basic Info</h3>
                <div class=" flex items-center gap-2 text-zinc-300">
                    <p class="">Bio:</p>
                    <h5 class="font-bold text-md">${bio || "Not avaliable"}</h5>
                </div>
                <div class="flex items-end gap-2 text-zinc-300">
                    <p class="">Location:</p>
                    <h5 class="font-bold text-md">${
                      location || "Not avaliable"
                    }</h5>
                </div>
                <div class="flex items-end gap-2 text-zinc-300">
                    <p class="">E-mail:</p>
                    <h5 class="font-bold text-md">${
                      email || "Not avaliable"
                    }</h5>
                </div>
                <div class="flex items-end gap-2 text-zinc-300">
                    <p class="">Twitter:</p>
                    <h5 class="font-bold text-md">${
                      twitter_username || "Not avaliable"
                    }</h5>
                </div>
                <div class="flex items-end gap-2 text-zinc-300">
                    <p class="">Company:</p>
                    <h5 class="font-bold text-md">${
                      company || "Not avaliable"
                    }</h5>
                </div>
                <div class="flex items-end gap-2 text-zinc-300">
                    <p class="">Followers:</p>
                    <h5 class="font-bold text-md">${
                      followers.toLocaleString("en-US") || "Not avaliable"
                    }</h5>
                </div>
                <div class="flex items-end gap-2 text-zinc-300">
                    <p class="">Following:</p>
                    <h5 class="font-bold text-md">${
                      following.toLocaleString("en-US") || "Not avaliable"
                    }</h5>
                </div>
                <div class="flex items-end gap-2 text-zinc-300">
                    <p class="">Public repository:</p>
                    <h5 class="font-bold text-md">${
                      public_repos || "Not avaliable"
                    }</h5>
                </div>
            </div>
                <div class="flex flex-col font-poppins mt-4 gap-4 bg-lightBlack p-4 rounded-xl md:w-full">
                <h3 class="text-sky-500 text-lg text-center font-bold font-poppins">Followers</h3>
                <div class="flex flex-col gap-4" id="followersWrapper">${allFollowers}</div>
                 <div class="flex gap-2 justify-center">
                    <button onclick="previousPages(this)" class="p-2 bg-slate-900 hover:bg-slate-500 text-white rounded-md">Prev</button>
                    <button id="btn" onclick="nextPages(this)" class="p-2 bg-slate-900 hover:bg-slate-500 text-white rounded-md">Next</button>
                </div>
            </div>
            <div class="flex flex-col font-poppins mt-4 gap-4 bg-lightBlack p-4 rounded-xl md:w-full">
                <h3 class="text-sky-500 text-lg text-center font-bold font-poppins ">Following</h3>
                <div class="flex flex-col gap-4" id="followingWrapper">${allFollowing}</div>
                 <div class="flex gap-2 justify-center">
                    <button onclick="previousFollowing(this)" class="p-2 bg-slate-900 hover:bg-slate-500 text-white rounded-md">Prev</button>
                    <button id="btn" onclick="nextFollowing(this)" class="p-2 bg-slate-900 hover:bg-slate-500 text-white rounded-md">Next</button>
                </div>
            </div>`;
     container.innerHTML = txt;
   } catch (error) {
      container.innerHTML = `<div class="flex justify-center items-center">
                                <img src="images/jaconda-17.gif" class="" alt="">
                              </div>`
   }
}

// template for follow data
const followTemplate = (avatar, username) => {
  const txt = `<div class="flex items-center w-full gap-2">
                    <img src="${avatar}" class="w-16 h-16 rounded-full border-2 border-slate-100" alt="Github avatar">
                    <p class="text-md text-zinc-300 font-bold font-poppins">${username}</p>
                  </div>`;
  return txt;
}

const getFollows = async (url) => {
  const { data } = await axios(url);

  if (data.length === 0) {
    return `<p class="text-white text-md text-center my-2">No followers data was gotten.</p>`;
  }

  const paginatedData = pagination(data);
  const follows= paginatedData.map((follow) => {
    const { login, avatar_url } = follow;
    const template = followTemplate(avatar_url, login);
    return template;
  });

  return follows.join(" ");
};

function pagination(data) {
  currentPage = 1
    const start = (currentPage - 1) * pageLimit;
    const end = currentPage * pageLimit;
  const getActivePage = data.slice(start, end);
  return getActivePage
}


async function nextPages(e) {
  currentPage++
  const followersWrapper = document.getElementById("followersWrapper");
  followersWrapper.innerHTML = ` <div class="flex items-center justify-center loader">
            <span></span>
            <span></span>
            <span></span>
        </div>`;
  console.log(currentPage);
  const { data: page } = await axios(`${url}${input.value.toLowerCase()}/followers`);
  
  if (page.length <= pageLimit) {
     currentPage = 1
     const displayPage = page.map((follower) => {
       const { login, avatar_url } = follower;
          const template = followTemplate(avatar_url, login);
          return template;
     });
     // console.log(activePage);
     followersWrapper.innerHTML = displayPage.join(" ");
     return;
   }
  const start = (currentPage - 1) * pageLimit;
  const end = currentPage * pageLimit;
  const activePage = page.slice(start, end);

  if (activePage.length === 0) {
    followersWrapper.innerHTML = `<p class="text-white text-md text-center my-2">Oops, seems that's a wrap!</p>`;
    currentPage--;
   return;
 }
  const displayPage = activePage.map(follower => {
    const { login, avatar_url } = follower;
     const template = followTemplate(avatar_url, login);
     return template;
  })
  followersWrapper.innerHTML = displayPage.join(" ");
  return activePage;
}
async function previousPages(e) {
  const followersWrapper = document.getElementById("followersWrapper");
  followersWrapper.innerHTML = ` <div class="flex items-center justify-center loader">
            <span></span>
            <span></span>
            <span></span>
        </div>`;
  const { data: page } = await axios(`${url}${input.value.toLowerCase()}/followers`);

  if (page.length <= pageLimit) {
    currentPage = 1
      const displayPage = page.map(follower => {
    const { login, avatar_url } = follower;
      const template = followTemplate(avatar_url, login);
      return template;
  })
  followersWrapper.innerHTML = displayPage.join(" ");
  return 
  }
  currentPage--
  console.log(currentPage);
  const start = (currentPage - 1) * pageLimit;
  const end = currentPage * pageLimit;
  const activePage = page.slice(start, end);

  if (activePage.length === 0) {
    followersWrapper.innerHTML = `<p class="text-white text-md text-center my-2">Oops, seems that's a wrap!</p>`;
     currentPage++  
     return;
   }
  const displayPage = activePage.map(follower => {
    const { login, avatar_url } = follower;
      const template = followTemplate(avatar_url, login);
      return template;
  })
  followersWrapper.innerHTML = displayPage.join(" ");
  return activePage;
}


//following starts here
async function nextFollowing(e) {
  followingPage++;
  const followersWrapper = document.getElementById("followingWrapper");
  followersWrapper.innerHTML = ` <div class="flex items-center justify-center loader">
            <span></span>
            <span></span>
            <span></span>
        </div>`;
  console.log(followingPage);
  const { data: page } = await axios(
    `${url}${input.value.toLowerCase()}/following`
  );

  if (page.length <= pageLimit) {
    followingPage = 1;
    const displayPage = page.map((follower) => {
      const { login, avatar_url } = follower;
        const template = followTemplate(avatar_url, login);
        return template;
    });
    followersWrapper.innerHTML = displayPage.join(" ");
    return;
  }
  const start = (followingPage - 1) * pageLimit;
  const end = followingPage * pageLimit;
  const activePage = page.slice(start, end);

  if (activePage.length === 0) {
    followersWrapper.innerHTML = `<p class="text-white text-md text-center my-2">Oops, seems that's a wrap!</p>`;
    followingPage--;
    return;
  }
  const displayPage = activePage.map((follower) => {
    const { login, avatar_url } = follower;
    const template = followTemplate(avatar_url, login);
    return template;
  });
  followersWrapper.innerHTML = displayPage.join(" ");
  return activePage;
}
async function previousFollowing(e) {
  const followersWrapper = document.getElementById("followingWrapper");
  followersWrapper.innerHTML = ` <div class="flex items-center justify-center loader">
            <span></span>
            <span></span>
            <span></span>
        </div>`;
  const { data: page } = await axios(
    `${url}${input.value.toLowerCase()}/following`
  );

  if (page.length <= pageLimit) {
    followingPage = 1;
    const displayPage = page.map((follower) => {
      const { login, avatar_url } = follower;
       const template = followTemplate(avatar_url, login);
       return template;
    });
    followersWrapper.innerHTML = displayPage.join(" ");
    return;
  }
  followingPage--;
  console.log(followingPage);
  const start = (followingPage - 1) * pageLimit;
  const end = followingPage * pageLimit;
  const activePage = page.slice(start, end);

  if (activePage.length === 0) {
    followersWrapper.innerHTML = `<p class="text-white text-md text-center my-2">Oops, seems that's a wrap!</p>`;
    followingPage++;
    return;
  }
  const displayPage = activePage.map((follower) => {
    const { login, avatar_url } = follower;
     const template = followTemplate(avatar_url, login);
     return template;
  });
  followersWrapper.innerHTML = displayPage.join(" ");
  return activePage;
}



input.addEventListener('keyup', (e) => {
   if (e.key === 'Enter') {
     getUserDetails()
    //  getFollowers()
   }
})