let finderTimeout = null

/*Set the paramas for finding the HITs*/
function finderParamas(){
	const url = new window.URL("https://worker.mturk.com/");
	url.searchParams.append("sort", storage.hitFinder["filter-sort"]);
	url.searchParams.append("page_size", storage.hitFinder["filter-page-size"]);
	url.searchParams.append("filters[masters]", storage.hitFinder["filter-masters"]);
	url.searchParams.append("filters[qualified]", storage.hitFinder["filter-qualified"]);
	url.searchParams.append("filters[min_reward]", storage.hitFinder["filter-min-reward"]);
	url.searchParams.append("filters[search_term]", storage.hitFinder["filter-search-term"]);
	url.searchParams.append("format", "json");

	return url;
}

function finderToggle () {
  const active = document.getElementById("find").classList.toggle("active");

  if (active) {
  	console.log("active loop");
    finderExecution();
  }
}

async function finderExecution(){
	const start = window.performance.now();

	clearTimeout(finderTimeout);

	//if find function is not activation return
	if(!$("#find").hasClass("active")){
		return;
	}

	try {
		const response = await window.fetch(finderParamas(), {
			credentials: "include"
		});

		console.log(response);

		//if user are log in to AMT worker
		if (~response.url.indexOf("https://worker.mturk.com")) {
			if(response.ok) {
				await finderProcess(await response.json())
			}

			if(response.status === 429) {
				//TODO: error message
			}

			nextFinder(start);
		} else {
			logout();
		}
	} catch(e) {
		// statements
		console.error(e);
		nextFinder(start);
	} finally {
		// statements
		//TODO:calculator
	}

}

function finderProcess(){
	return new Promise(async (resolve) => {
		const [json] = arguments;

		const recentFragment = document.createDocumentFragment();
		const loggedFragment = document.createDocumentFragment();
		const includedFragment = document.createDocumentFragment();
		let sound = false;
		let blocked = 0;

		requesterReviewsCheck([...new Set(json.results.map((o) => o.requester_id))]);

		resolve();
	})
}

function nextFinder(){
	const [lastScan] = arguments;

	const speed = Number(storage.hitFinder["speed"]);

	if(speed > 0){
		const delay = lastScan + speed - window.performance.now();
		finderTimeout = setTimeout(finderExecution, delay);
	}else{
		finderToggle();
	}
}

function logout(){
	finderToggle();
	window.textToSpeech(`HIT Finder Stopped, you are logged out of MTurk.`, `Google US English`);
}

function requesterReviewsCheck(){

}

function blockListed(){

}

function includeListed(){

}

document.getElementById("find").addEventListener("click", finderToggle);
